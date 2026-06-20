import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import {
  Work,
  DailyTask,
  CabinItem,
  MonsterState,
  StatsData,
  HistoryRecord,
  WorkTarget
} from '@/types';
import {
  mockWork,
  mockDailyTasks,
  mockCabinItems,
  mockMonster,
  mockStats,
  mockHistory,
  monsterMessages,
  targetOptions,
  mockMakeUpTasks
} from '@/data/mockData';

interface AppContextType {
  work: Work;
  dailyTasks: DailyTask[];
  cabinItems: CabinItem[];
  monster: MonsterState;
  stats: StatsData;
  history: HistoryRecord[];
  targetOptions: WorkTarget[];
  selectedMakeUpTask: string | null;
  completeTask: (taskId: string) => void;
  updateWork: (updates: Partial<Work>) => void;
  updateWorkTarget: (target: WorkTarget) => void;
  selectMakeUpTask: (type: string) => void;
  dismissMonster: () => void;
  checkAndTriggerMonster: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [work, setWork] = useState<Work>(mockWork);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(mockDailyTasks);
  const [cabinItems, setCabinItems] = useState<CabinItem[]>(mockCabinItems);
  const [monster, setMonster] = useState<MonsterState>(mockMonster);
  const [stats, setStats] = useState<StatsData>(mockStats);
  const [history, setHistory] = useState<HistoryRecord[]>(mockHistory);
  const [selectedMakeUpTask, setSelectedMakeUpTask] = useState<string | null>(null);
  const cabinItemsRef = useRef(cabinItems);
  cabinItemsRef.current = cabinItems;

  const completeTask = useCallback((taskId: string) => {
    setDailyTasks(prev => {
      const targetTask = prev.find(t => t.id === taskId);
      if (!targetTask || targetTask.completed) return prev;

      const wasItemLocked = !cabinItemsRef.current.find(i => i.id === targetTask.rewardItem)?.unlocked;

      setCabinItems(items => items.map(item =>
        item.id === targetTask.rewardItem ? { ...item, unlocked: true } : item
      ));

      setStats(s => ({
        ...s,
        completedTasks: s.completedTasks + 1,
        unlockedItems: wasItemLocked ? s.unlockedItems + 1 : s.unlockedItems
      }));

      setMonster(m => ({ ...m, active: false, dismissed: false }));

      return prev.map(task =>
        task.id === taskId ? { ...task, completed: true } : task
      );
    });
    console.log('[AppContext] Task completed:', taskId);
  }, []);

  const updateWork = useCallback((updates: Partial<Work>) => {
    setWork(prev => ({ ...prev, ...updates }));
    console.log('[AppContext] Work updated:', updates);
  }, []);

  const updateWorkTarget = useCallback((target: WorkTarget) => {
    setWork(prev => ({ ...prev, target }));
    console.log('[AppContext] Work target updated:', target);
  }, []);

  const selectMakeUpTask = useCallback((type: string) => {
    const makeUpTask = mockMakeUpTasks.find(t => t.type === type);
    const label = makeUpTask?.title || type;
    const today = new Date().toISOString().split('T')[0];

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

    setMonster({ active: false, level: 1, message: '', position: 0, dismissed: false });
    console.log('[AppContext] Make-up task selected:', type);
  }, []);

  const dismissMonster = useCallback(() => {
    setMonster(prev => ({ ...prev, active: false, dismissed: true }));
    console.log('[AppContext] Monster dismissed');
  }, []);

  const checkAndTriggerMonster = useCallback(() => {
    setDailyTasks(currentTasks => {
      const anyCompleted = currentTasks.some(t => t.completed);
      if (anyCompleted) return currentTasks;

      const hour = new Date().getHours();
      if (hour < 20) return currentTasks;

      setMonster(currentMonster => {
        if (currentMonster.dismissed) return currentMonster;
        if (currentMonster.active) return currentMonster;

        const randomMsg = monsterMessages[Math.floor(Math.random() * monsterMessages.length)];
        console.log('[AppContext] Monster auto-triggered');
        return {
          active: true,
          level: 2,
          message: randomMsg,
          position: 60,
          dismissed: false
        };
      });

      return currentTasks;
    });
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
      completeTask,
      updateWork,
      updateWorkTarget,
      selectMakeUpTask,
      dismissMonster,
      checkAndTriggerMonster
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
