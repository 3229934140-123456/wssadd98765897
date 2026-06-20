import { Work, DailyTask, CabinItem, MakeUpTask, MonsterState, StatsData, HistoryRecord, WorkTarget } from '@/types';

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
  { id: 'inkBottle', name: '墨水瓶', icon: '🖋️', unlocked: true, position: { x: 15, y: 55 } },
  { id: 'coffeeCup', name: '咖啡杯', icon: '☕', unlocked: true, position: { x: 35, y: 60 } },
  { id: 'magicBook', name: '魔法书', icon: '📖', unlocked: false, position: { x: 55, y: 45 } },
  { id: 'candle', name: '小蜡烛', icon: '🕯️', unlocked: true, position: { x: 75, y: 50 } },
  { id: 'plant', name: '小盆栽', icon: '🪴', unlocked: false, position: { x: 25, y: 30 } },
  { id: 'cat', name: '猫咪', icon: '🐱', unlocked: false, position: { x: 65, y: 70 } },
  { id: 'lamp', name: '台灯', icon: '💡', unlocked: true, position: { x: 85, y: 35 } },
  { id: 'star', name: '许愿星', icon: '⭐', unlocked: false, position: { x: 45, y: 20 } }
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
  position: 0
};

// 统计数据
export const mockStats: StatsData = {
  totalDays: 23,
  completedTasks: 58,
  currentStreak: 7,
  longestStreak: 14,
  unlockedItems: 4
};

// 历史记录
export const mockHistory: HistoryRecord[] = [
  { date: '2026-06-20', tasksCompleted: 3, wordsWritten: 3200, hadMakeUp: false },
  { date: '2026-06-19', tasksCompleted: 2, wordsWritten: 2100, hadMakeUp: false },
  { date: '2026-06-18', tasksCompleted: 3, wordsWritten: 3500, hadMakeUp: false },
  { date: '2026-06-17', tasksCompleted: 1, wordsWritten: 800, hadMakeUp: true },
  { date: '2026-06-16', tasksCompleted: 3, wordsWritten: 3000, hadMakeUp: false },
  { date: '2026-06-15', tasksCompleted: 3, wordsWritten: 3100, hadMakeUp: false },
  { date: '2026-06-14', tasksCompleted: 2, wordsWritten: 2500, hadMakeUp: false }
];

// 怪物语录
export const monsterMessages = [
  '嘿～书架在呼唤你，读者大大们正等更呢！',
  '怪物我呀，闻到了断更的味道...你不想让读者失望吧？',
  '再不来码字，榜单热度就要溜走啦！',
  '咕噜咕噜～你的小读者正在刷新页面哦',
  '只差一步就断更啦，快动起来吧！'
];
