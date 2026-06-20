import { Work, DailyTask, CabinItem, MakeUpTask, MonsterState, StatsData, HistoryRecord, WorkTarget, StreakReward } from '@/types';

// 可选目标列表
export const targetOptions: WorkTarget[] = [
  {
    type: 'daily3000',
    label: '日更三千',
    description: '每天写3000字，养成稳定输出习惯'
  },
  {
    type: 'weekly5ep',
    label: '每周五话',
    description: '漫画脚本作者每周完成5话剧本'
  },
  {
    type: 'monthlyRank',
    label: '月末冲榜',
    description: '冲刺月票榜/收藏榜，月末全力爆发'
  }
];

// 连更奖励配置
export const streakRewards: StreakReward[] = [
  {
    days: 3,
    type: 'item',
    id: 'plant',
    name: '小盆栽',
    description: '连续更新3天，获得元气小盆栽'
  },
  {
    days: 7,
    type: 'item',
    id: 'star',
    name: '许愿星',
    description: '连续更新7天，闪亮许愿星登场'
  },
  {
    days: 14,
    type: 'item',
    id: 'cat',
    name: '猫咪',
    description: '连续更新14天，小屋迎来猫咪伙伴'
  },
  {
    days: 21,
    type: 'title',
    id: 'beginner',
    name: '初心作者',
    description: '坚持21天，养成创作好习惯'
  },
  {
    days: 30,
    type: 'title',
    id: 'stable',
    name: '稳定更新者',
    description: '满月成就，稳定更新的实力派'
  }
];

// 称号列表（按获得顺序）
export const titleList: { id: string; name: string; days: number }[] = [
  { id: 'newbie', name: '新手作者', days: 0 },
  { id: 'beginner', name: '初心作者', days: 21 },
  { id: 'stable', name: '稳定更新者', days: 30 },
  { id: 'veteran', name: '码字老兵', days: 60 },
  { id: 'master', name: '大神级作者', days: 100 }
];

// 当前作品
export const mockWork: Work = {
  id: '1',
  title: '星之彼岸',
  type: 'novel',
  description: '一部关于星辰与旅人幻想冒险的轻小说',
  target: targetOptions[0],
  createdAt: '2026-05-15',
  totalWords: 128000,
  streakDays: 7
};

// 今日三个任务
export const mockDailyTasks: DailyTask[] = [
  {
    id: 't1',
    title: '写开头 500 字',
    description: '今日章节的开篇段落，抓住读者视线',
    icon: '✍️',
    rewardItem: 'inkBottle',
    completed: false
  },
  {
    id: 't2',
    title: '补完对话',
    description: '完善场景中人物的互动对话，让角色鲜活',
    icon: '💬',
    rewardItem: 'coffeeCup',
    completed: false
  },
  {
    id: 't3',
    title: '检查章节钩子',
    description: '末尾留个小悬念，读者才会追更呀～',
    icon: '🪝',
    rewardItem: 'magicBook',
    completed: false
  }
];

// 小屋道具
export const mockCabinItems: CabinItem[] = [
  { id: 'inkBottle', name: '墨水瓶', icon: '🖋️', unlocked: false, placed: true, position: { x: 15, y: 55 } },
  { id: 'coffeeCup', name: '咖啡杯', icon: '☕', unlocked: false, placed: true, position: { x: 35, y: 60 } },
  { id: 'magicBook', name: '魔法书', icon: '📖', unlocked: false, placed: true, position: { x: 55, y: 45 } },
  { id: 'candle', name: '小蜡烛', icon: '🕯️', unlocked: true, placed: true, position: { x: 75, y: 50 } },
  { id: 'plant', name: '小盆栽', icon: '🪴', unlocked: false, placed: true, position: { x: 25, y: 30 }, isStreakReward: true, streakDaysRequired: 3 },
  { id: 'cat', name: '猫咪', icon: '🐱', unlocked: false, placed: true, position: { x: 65, y: 70 }, isStreakReward: true, streakDaysRequired: 14 },
  { id: 'lamp', name: '台灯', icon: '💡', unlocked: true, placed: true, position: { x: 85, y: 35 } },
  { id: 'star', name: '许愿星', icon: '⭐', unlocked: false, placed: true, position: { x: 45, y: 20 }, isStreakReward: true, streakDaysRequired: 7 }
];

// 补更任务卡
export const mockMakeUpTasks: MakeUpTask[] = [
  {
    id: 'm1',
    type: 'extra1000',
    title: '明天多写 1000 字',
    description: '明天的目标+1000字，把今天的份补回来',
    icon: '📝'
  },
  {
    id: 'm2',
    type: 'weekendExtra',
    title: '周末加更一章',
    description: '周末休息时额外写一章，轻松无压力',
    icon: '📅'
  },
  {
    id: 'm3',
    type: 'leaveNote',
    title: '发布请假说明',
    description: '告诉读者今日请假，明日加倍奉还',
    icon: '📢'
  }
];

// 断更怪物
export const mockMonster: MonsterState = {
  active: false,
  level: 1,
  message: '',
  position: 0,
  dismissedForDate: null,
  dismissedLevel: 0
};

// 统计数据
export const mockStats: StatsData = {
  totalDays: 23,
  completedTasks: 58,
  currentStreak: 7,
  longestStreak: 14,
  unlockedItems: 2,
  currentTitle: '初心作者'
};

// 历史记录
export const mockHistory: HistoryRecord[] = [
  { date: '2026-06-20', tasksCompleted: 3, wordsWritten: 3200, hadMakeUp: false },
  { date: '2026-06-19', tasksCompleted: 2, wordsWritten: 2100, hadMakeUp: false },
  { date: '2026-06-18', tasksCompleted: 3, wordsWritten: 3500, hadMakeUp: false },
  { date: '2026-06-17', tasksCompleted: 1, wordsWritten: 800, hadMakeUp: true, makeUpType: 'extra1000', makeUpLabel: '明天多写 1000 字' },
  { date: '2026-06-16', tasksCompleted: 3, wordsWritten: 3000, hadMakeUp: false },
  { date: '2026-06-15', tasksCompleted: 3, wordsWritten: 3100, hadMakeUp: false },
  { date: '2026-06-14', tasksCompleted: 2, wordsWritten: 2500, hadMakeUp: false }
];

// 怪物语录 - 轻度提醒 (20:00-22:59)
export const monsterMessagesGentle = [
  '嘿～今天还没动笔呢，趁晚上灵感来了写两句吧？',
  '夜幕降临，码字的好时光到啦～',
  '小屋里的灯为你亮着，来写几段吧！',
  '读者的期待还在哦，今晚稍微写一点？'
];

// 怪物语录 - 临近深夜 (23:00+)
export const monsterMessagesUrgent = [
  '怪物我呀，闻到了断更的味道...你不想让读者失望吧？',
  '再不来码字，榜单热度就要溜走啦！',
  '咕噜咕噜～你的小读者正在刷新页面哦',
  '只差一步就断更啦，快动起来吧！',
  '深夜了怪物在靠近书架...抓紧码字赶走它！'
];

// 获取今日日期字符串
export const getTodayStr = (): string => {
  return new Date().toISOString().split('T')[0];
};
