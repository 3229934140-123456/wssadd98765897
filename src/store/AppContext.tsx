import React, { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import Taro from '@tarojs/taro';
import {
  Work,
  DailyTask,
  CabinItem,
  MonsterState,
  StatsData,
  HistoryRecord,
  WorkTarget,
  GameSave
} from '@/types';
import {
  mockWork,
  mockDailyTasks,
  mockCabinItems,
  mockMonster,
  mockStats,
  mockHistory,
  monsterMessagesGentle,
  monsterMessagesUrgent,
  targetOptions,
  mockMakeUpTasks,
  getTodayStr,
  streakRewards,
  titleList
} from '@/data/mockData';

const STORAGE_KEY = 'cabin_save_v1';
const SAVE_VERSION = 1;

interface NextRewardInfo {
  days: number;
  name: string;
  daysRemaining: number;
  type: 'item' | 'title';
}

interface AppContextType {
  work: Work;
  dailyTasks: DailyTask[];
  cabinItems: CabinItem[];
  monster: MonsterState;
  stats: StatsData;
  history: HistoryRecord[];
  targetOptions: WorkTarget[];
  selectedMakeUpTask: string | null;
  nextReward: NextRewardInfo | null;
  completeTask: (taskId: string) => void;
  updateWork: (updates: Partial<Work>) => void;
  updateWorkTarget: (target: WorkTarget) => void;
  selectMakeUpTask: (type: string) => void;
  dismissMonster: () => void;
  checkAndTriggerMonster: () => void;
  checkDailyReset: () => void;
  forceTriggerMonster: () => void;
  clearSave: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const loadSave = (): GameSave | null => {
  try {
    const raw = Taro.getStorageSync(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameSave;
    if (parsed.version !== SAVE_VERSION) return null;
    console.log('[AppContext] Loaded save from:', parsed.lastActiveDate);
    return parsed;
  } catch (e) {
    console.warn('[AppContext] Failed to load save:', e);
    return null;
  }
};

const saveState = (state: Omit<GameSave, 'version' | 'lastActiveDate'>) => {
  try {
    const save: GameSave = {
      version: SAVE_VERSION,
      lastActiveDate: getTodayStr(),
      ...state
    };
    Taro.setStorageSync(STORAGE_KEY, JSON.stringify(save));
  } catch (e) {
    console.warn('[AppContext] Failed to save state:', e);
  }
};

const getNextReward = (currentStreak: number): NextRewardInfo | null => {
  const rewards = [...streakRewards].sort((a, b) => a.days - b.days);
  for (const reward of rewards) {
    if (currentStreak < reward.days) {
      return {
        days: reward.days,
        name: reward.name,
        daysRemaining: reward.days - currentStreak,
        type: reward.type as 'item' | 'title'
      };
    }
  }
  return null;
};

const getCurrentTitle = (streakDays: number): string => {
  const titles = [...titleList].sort((a, b) => b.days - a.days);
  for (const title of titles) {
    if (streakDays >= title.days) {
      return title.name;
    }
  }
  return titleList[0].name;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const saved = loadSave();

  const [work, setWork] = useState<Work>(saved?.work ?? mockWork);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(saved?.dailyTasks ?? mockDailyTasks);
  const [cabinItems, setCabinItems] = useState<CabinItem[]>(saved?.cabinItems ?? mockCabinItems);
  const [monster, setMonster] = useState<MonsterState>(saved?.monster ?? mockMonster);
  const [stats, setStats] = useState<StatsData>(saved?.stats ?? mockStats);
  const [history, setHistory] = useState<HistoryRecord[]>(saved?.history ?? mockHistory);
  const [selectedMakeUpTask, setSelectedMakeUpTask] = useState<string | null>(saved?.selectedMakeUpTask ?? null);
  const [nextReward, setNextReward] = useState<NextRewardInfo | null>(() => getNextReward(saved?.stats?.currentStreak ?? mockStats.currentStreak));

  const cabinItemsRef = useRef(cabinItems);
  const dailyTasksRef = useRef(dailyTasks);
  const historyRef = useRef(history);
  const statsRef = useRef(stats);
  const workRef = useRef(work);
  const selectedMakeUpTaskRef = useRef(selectedMakeUpTask);
  cabinItemsRef.current = cabinItems;
  dailyTasksRef.current = dailyTasks;
  historyRef.current = history;
  statsRef.current = stats;
  workRef.current = work;
  selectedMakeUpTaskRef.current = selectedMakeUpTask;

  useEffect(() => {
    saveState({ work, dailyTasks, cabinItems, monster, stats, history, selectedMakeUpTask });
  }, [work, dailyTasks, cabinItems, monster, stats, history, selectedMakeUpTask]);

  useEffect(() => {
    const streak = saved?.stats?.currentStreak ?? mockStats.currentStreak;
    const newItems = [...cabinItems];
    let changed = false;
    newItems.forEach((item, idx) => {
      if (item.isStreakReward && item.streakDaysRequired && streak >= item.streakDaysRequired && !item.unlocked) {
        newItems[idx] = { ...item, unlocked: true };
        changed = true;
      }
    });
    if (changed) {
      console.log('[AppContext] Auto-granting streak rewards on init');
      setCabinItems(newItems);
      const unlockedCount = newItems.filter(i => i.unlocked).length;
      setStats(s => ({ ...s, unlockedItems: unlockedCount, currentTitle: getCurrentTitle(streak) }));
    }
  }, []);

  const checkStreakRewards = useCallback((newStreak: number) => {
    setCabinItems(items => {
      const newItems = [...items];
      items.forEach((item, idx) => {
        if (item.isStreakReward && item.streakDaysRequired && newStreak >= item.streakDaysRequired && !item.unlocked) {
          newItems[idx] = { ...item, unlocked: true };
        }
      });
      const newlyUnlocked = newItems.filter(i => i.unlocked).length;
      setStats(s => ({
        ...s,
        unlockedItems: newlyUnlocked,
        currentTitle: getCurrentTitle(newStreak),
        currentStreak: Math.max(s.currentStreak, newStreak),
        longestStreak: Math.max(s.longestStreak, newStreak)
      }));
      return newItems;
    });
    setNextReward(getNextReward(newStreak));
  }, []);

  const completeTask = useCallback((taskId: string) => {
    const today = getTodayStr();

    setDailyTasks(prev => {
      const targetTask = prev.find(t => t.id === taskId);
      if (!targetTask || targetTask.completed) return prev;

      const wasItemLocked = !cabinItemsRef.current.find(i => i.id === targetTask.rewardItem)?.unlocked;
      const newTasks = prev.map(task =>
        task.id === taskId ? { ...task, completed: true } : task
      );
      const completedCount = newTasks.filter(t => t.completed).length;
      const allCompleted = completedCount === 3;

      setCabinItems(items => items.map(item =>
        item.id === targetTask.rewardItem ? { ...item, unlocked: true } : item
      ));

      setStats(s => {
        const newStreak = s.currentStreak + (allCompleted ? 1 : 0);
        const newStats = {
          ...s,
          completedTasks: s.completedTasks + 1,
          unlockedItems: wasItemLocked ? s.unlockedItems + 1 : s.unlockedItems,
          currentStreak: newStreak,
          longestStreak: Math.max(s.longestStreak, newStreak),
          currentTitle: getCurrentTitle(newStreak)
        };
        if (allCompleted) {
          checkStreakRewards(newStreak);
        }
        return newStats;
      });

      setHistory(hist => {
        const todayRecord = hist.find(r => r.date === today);
        const wordsWritten = completedCount * 1000;
        if (todayRecord) {
          return hist.map(r =>
            r.date === today
              ? { ...r, tasksCompleted: completedCount, wordsWritten }
              : r
          );
        }
        return [
          { date: today, tasksCompleted: completedCount, wordsWritten, hadMakeUp: false },
          ...hist
        ];
      });

      if (allCompleted) {
        setWork(w => ({ ...w, streakDays: w.streakDays + 1, totalWords: w.totalWords + 1000 }));
      } else {
        setWork(w => ({ ...w, totalWords: w.totalWords + 1000 }));
      }

      setMonster(m => ({ ...m, active: false, dismissedForDate: null }));

      return newTasks;
    });
    console.log('[AppContext] Task completed:', taskId);
  }, [checkStreakRewards]);

  const updateWork = useCallback((updates: Partial<Work>) => {
    setWork(prev => ({ ...prev, ...updates }));
  }, []);

  const updateWorkTarget = useCallback((target: WorkTarget) => {
    setWork(prev => ({ ...prev, target }));
  }, []);

  const selectMakeUpTask = useCallback((type: string) => {
    const makeUpTask = mockMakeUpTasks.find(t => t.type === type);
    const label = makeUpTask?.title || type;
    const today = getTodayStr();

    setSelectedMakeUpTask(type);

    setHistory(prev => {
      const todayRecord = prev.find(r => r.date === today);
      if (todayRecord) {
        return prev.map(r =>
          r.date === today
            ? { ...r, hadMakeUp: true, makeUpType: type, makeUpLabel: label }
            : r
        );
      }
      return [
        {
          date: today,
          tasksCompleted: 0,
          wordsWritten: type === 'extra1000' ? 1000 : 0,
          hadMakeUp: true,
          makeUpType: type,
          makeUpLabel: label
        },
        ...prev
      ];
    });

    setMonster({ active: false, level: 1, message: '', position: 0, dismissedForDate: null });
    console.log('[AppContext] Make-up task selected:', type);
  }, []);

  const dismissMonster = useCallback(() => {
    const today = getTodayStr();
    setMonster(prev => ({ ...prev, active: false, dismissedForDate: today }));
  }, []);

  const checkAndTriggerMonster = useCallback(() => {
    const today = getTodayStr();
    const anyCompleted = dailyTasksRef.current.some(t => t.completed);
    const hasMakeUp = selectedMakeUpTaskRef.current !== null;

    if (anyCompleted || hasMakeUp) return;

    const hour = new Date().getHours();
    if (hour < 20) return;

    setMonster(currentMonster => {
      if (currentMonster.dismissedForDate === today) return currentMonster;
      if (currentMonster.active) return currentMonster;

      if (hour < 23) {
        const msg = monsterMessagesGentle[Math.floor(Math.random() * monsterMessagesGentle.length)];
        console.log('[AppContext] Monster gentle reminder');
        return {
          active: true,
          level: 1,
          message: msg,
          position: 30,
          dismissedForDate: null
        };
      } else {
        const msg = monsterMessagesUrgent[Math.floor(Math.random() * monsterMessagesUrgent.length)];
        console.log('[AppContext] Monster urgent reminder');
        return {
          active: true,
          level: 2,
          message: msg,
          position: 60,
          dismissedForDate: null
        };
      }
    });
  }, []);

  const forceTriggerMonster = useCallback(() => {
    const msg = monsterMessagesUrgent[Math.floor(Math.random() * monsterMessagesUrgent.length)];
    setMonster({
      active: true,
      level: 2,
      message: msg,
      position: 60,
      dismissedForDate: null
    });
    console.log('[AppContext] Monster force-triggered (debug)');
  }, []);

  const checkDailyReset = useCallback(() => {
    const today = getTodayStr();
    const savedData = loadSave();
    const lastDate = savedData?.lastActiveDate;

    if (lastDate && lastDate !== today) {
      console.log('[AppContext] Daily reset: lastDate =', lastDate, ', today =', today);

      const yesterdayTasks = dailyTasksRef.current;
      const yesterdayCompleted = yesterdayTasks.filter(t => t.completed).length;

      if (yesterdayCompleted === 0) {
        console.log('[AppContext] No tasks completed yesterday, breaking streak');
        setStats(s => ({ ...s, currentStreak: 0 }));
        setWork(w => ({ ...w, streakDays: 0 }));
        setNextReward(getNextReward(0));
      } else {
        const yesterdayHistory = historyRef.current.find(h => h.date === lastDate);
        if (!yesterdayHistory) {
          setHistory(hist => [
            { date: lastDate, tasksCompleted: yesterdayCompleted, wordsWritten: yesterdayCompleted * 1000, hadMakeUp: false },
            ...hist
          ]);
        }
      }

      setDailyTasks(mockDailyTasks.map(t => ({ ...t, completed: false })));
      setSelectedMakeUpTask(null);
      setMonster({ active: false, level: 1, message: '', position: 0, dismissedForDate: null });
      setStats(s => ({ ...s, totalDays: s.totalDays + 1 }));
    }

    checkAndTriggerMonster();
  }, [checkAndTriggerMonster]);

  const clearSave = useCallback(() => {
    try {
      Taro.removeStorageSync(STORAGE_KEY);
      Taro.showToast({ title: '存档已清除', icon: 'success' });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (e) {
      console.warn('[AppContext] Failed to clear save:', e);
    }
  }, []);

  return (
    <AppContext.Provider value={{
      work,
      dailyTasks,
      cabinItems,
      monster,
      stats,
      history,
      targetOptions,
      selectedMakeUpTask,
      nextReward,
      completeTask,
      updateWork,
      updateWorkTarget,
      selectMakeUpTask,
      dismissMonster,
      checkAndTriggerMonster,
      checkDailyReset,
      forceTriggerMonster,
      clearSave
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
