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
  placed: boolean;
  position: { x: number; y: number };
  isStreakReward?: boolean;
  streakDaysRequired?: number;
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
  dismissedForDate: string | null;
  dismissedLevel: number;
}

// 连更奖励
export interface StreakReward {
  days: number;
  type: 'item' | 'title';
  id: string;
  name: string;
  description: string;
}

// 统计数据
export interface StatsData {
  totalDays: number;
  completedTasks: number;
  currentStreak: number;
  longestStreak: number;
  unlockedItems: number;
  currentTitle: string;
}

// 历史记录
export interface HistoryRecord {
  date: string;
  tasksCompleted: number;
  wordsWritten: number;
  hadMakeUp: boolean;
  makeUpType?: string;
  makeUpLabel?: string;
  rewards?: string[];
}

// 日历日期数据
export interface CalendarDay {
  date: string;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasksCompleted: number;
  hadMakeUp: boolean;
  makeUpLabel?: string;
  rewards?: string[];
}

// 持久化存档
export interface GameSave {
  version: number;
  lastActiveDate: string;
  work: Work;
  dailyTasks: DailyTask[];
  cabinItems: CabinItem[];
  monster: MonsterState;
  stats: StatsData;
  history: HistoryRecord[];
  selectedMakeUpTask: string | null;
}
