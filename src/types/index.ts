// 作品类型
export interface Work {
  id: string;
  title: string;
  type: 'novel' | 'script';
  cover?: string;
  description: string;
  target: WorkTarget;
  createdAt: string;
  totalWords: number;
  streakDays: number;
}

// 创作目标类型
export type WorkTargetType = 'daily3000' | 'weekly5ep' | 'monthlyRank';

export interface WorkTarget {
  type: WorkTargetType;
  label: string;
  description: string;
}

// 每日任务类型
export interface DailyTask {
  id: string;
  title: string;
  description: string;
  icon: string;
  rewardItem: string;
  completed: boolean;
}

// 小屋道具
export interface CabinItem {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
  position: { x: number; y: number };
}

// 补更任务卡
export interface MakeUpTask {
  id: string;
  type: 'extra1000' | 'weekendExtra' | 'leaveNote';
  title: string;
  description: string;
  icon: string;
}

// 断更怪物状态
export interface MonsterState {
  active: boolean;
  level: number;
  message: string;
  position: number;
  dismissed: boolean;
}

// 统计数据
export interface StatsData {
  totalDays: number;
  completedTasks: number;
  currentStreak: number;
  longestStreak: number;
  unlockedItems: number;
}

// 历史记录
export interface HistoryRecord {
  date: string;
  tasksCompleted: number;
  wordsWritten: number;
  hadMakeUp: boolean;
  makeUpType?: string;
  makeUpLabel?: string;
}
