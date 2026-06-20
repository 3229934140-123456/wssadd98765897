import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
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
  targetOptions
} from '@/data/mockData';

interface AppContextType {
  work: Work;
  dailyTasks: DailyTask[];
  cabinItems: CabinItem[];
  monster: MonsterState;
  stats: StatsData;
  history: HistoryRecord[];
  targetOptions: WorkTarget[];
  completeTask: (taskId: string) => void;
  updateWork: (updates: Partial<Work>) => void;
  updateWorkTarget: (target: WorkTarget) => void;
  selectMakeUpTask: (type: string) => void;
  triggerMonster: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [work, setWork] = useState<Work>(mockWork);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(mockDailyTasks);
  const [cabinItems, setCabinItems] = useState<CabinItem[]>(mockCabinItems);
  const [monster, setMonster] = useState<MonsterState>(mockMonster);
  const [stats, setStats] = useState<StatsData>(mockStats);
  const [history] = useState<HistoryRecord[]>(mockHistory);

  const completeTask = useCallback((taskId: string) => {
    setDailyTasks(prev => prev.map(task => {
      if (task.id === taskId && !task.completed) {
        setCabinItems(items => items.map(item =>
          item.id === task.rewardItem ? { ...item, unlocked: true } : item
        ));
        setStats(s => ({
          ...s,
          completedTasks: s.completedTasks + 1,
          unlockedItems: s.unlockedItems + 1
        }));
        return { ...task, completed: true };
      }
      return task;
    }));
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
    const newRecord: HistoryRecord = {
      date: new Date().toISOString().split('T')[0],
      tasksCompleted: 1,
      wordsWritten: type === 'extra1000' ? 1000 : 0,
      hadMakeUp: true
    };
    console.log('[AppContext] Make-up task selected:', type, newRecord);
    setMonster({ active: false, level: 1, message: '', position: 0 });
  }, []);

  const triggerMonster = useCallback(() => {
    const randomMsg = monsterMessages[Math.floor(Math.random() * monsterMessages.length)];
    setMonster({
      active: true,
      level: 2,
      message: randomMsg,
      position: 60
    });
    console.log('[AppContext] Monster triggered');
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
      completeTask,
      updateWork,
      updateWorkTarget,
      selectMakeUpTask,
      triggerMonster
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
