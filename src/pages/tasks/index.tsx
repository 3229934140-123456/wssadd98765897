import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useDidShow } from '@tarojs/taro';
import { useApp } from '@/store/AppContext';
import { mockMakeUpTasks, streakRewards, titleList } from '@/data/mockData';
import { MakeUpTask, HistoryRecord, CalendarDay } from '@/types';
import classnames from 'classnames';
import styles from './index.module.scss';

const WEEK_DAYS = ['日', '一', '二', '三', '四', '五', '六'];

const TasksPage: React.FC = () => {
  const { history, selectedMakeUpTask, nextReward, stats, cabinItems, selectMakeUpTask, checkDailyReset } = useApp();

  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const [historyMode, setHistoryMode] = useState<'week' | 'month'>('week');

  useDidShow(() => {
    checkDailyReset();
  });

  const getWeekRange = (): { start: Date; end: Date } => {
    const now = new Date();
    const day = now.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    return { start: monday, end: sunday };
  };

  const getMonthRange = (): { start: Date; end: Date } => {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    last.setHours(23, 59, 59, 999);
    return { start: first, end: last };
  };

  const isDateInRange = (dateStr: string, start: Date, end: Date): boolean => {
    const d = new Date(dateStr);
    return d >= start && d <= end;
  };

  const filteredHistory = useMemo(() => {
    const { start, end } = historyMode === 'week' ? getWeekRange() : getMonthRange();
    return history.filter(r => isDateInRange(r.date, start, end));
  }, [history, historyMode]);

  const periodStats = useMemo(() => {
    const records = filteredHistory;
    const completedDays = records.filter(r => r.tasksCompleted === 3).length;
    const makeUpCount = records.filter(r => r.hadMakeUp).length;
    const totalWords = records.reduce((sum, r) => sum + r.wordsWritten, 0);
    const rewardCount = records.reduce((sum, r) => sum + (r.rewards?.length ?? 0), 0);
    return { completedDays, makeUpCount, totalWords, rewardCount };
  }, [filteredHistory]);

  const calendarDays = useMemo((): CalendarDay[] => {
    const firstDay = new Date(calendarYear, calendarMonth, 1);
    const lastDay = new Date(calendarYear, calendarMonth + 1, 0);
    const startWeekday = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const historyMap = new Map<string, HistoryRecord>();
    history.forEach(r => historyMap.set(r.date, r));

    const days: CalendarDay[] = [];

    const prevMonthLastDay = new Date(calendarYear, calendarMonth, 0).getDate();
    for (let i = startWeekday - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const date = new Date(calendarYear, calendarMonth - 1, d);
      const dateStr = date.toISOString().split('T')[0];
      const rec = historyMap.get(dateStr);
      days.push({
        date: dateStr,
        day: d,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        tasksCompleted: rec?.tasksCompleted ?? 0,
        hadMakeUp: rec?.hadMakeUp ?? false,
        makeUpLabel: rec?.makeUpLabel,
        rewards: rec?.rewards
      });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(calendarYear, calendarMonth, d);
      const dateStr = date.toISOString().split('T')[0];
      const rec = historyMap.get(dateStr);
      days.push({
        date: dateStr,
        day: d,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        tasksCompleted: rec?.tasksCompleted ?? 0,
        hadMakeUp: rec?.hadMakeUp ?? false,
        makeUpLabel: rec?.makeUpLabel,
        rewards: rec?.rewards
      });
    }

    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const date = new Date(calendarYear, calendarMonth + 1, d);
      const dateStr = date.toISOString().split('T')[0];
      const rec = historyMap.get(dateStr);
      days.push({
        date: dateStr,
        day: d,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        tasksCompleted: rec?.tasksCompleted ?? 0,
        hadMakeUp: rec?.hadMakeUp ?? false,
        makeUpLabel: rec?.makeUpLabel,
        rewards: rec?.rewards
      });
    }

    return days;
  }, [calendarYear, calendarMonth, history]);

  const monthLabel = `${calendarYear}年${calendarMonth + 1}月`;

  const prevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarYear(y => y - 1);
      setCalendarMonth(11);
    } else {
      setCalendarMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarYear(y => y + 1);
      setCalendarMonth(0);
    } else {
      setCalendarMonth(m => m + 1);
    }
  };

  const toggleExpand = (date: string) => {
    setExpandedDate(prev => prev === date ? null : date);
  };

  const handleSelectMakeUp = (task: MakeUpTask) => {
    selectMakeUpTask(task.type);
    Taro.showToast({
      title: `已选择:${task.title}`,
      icon: 'success',
      duration: 2000
    });
  };

  const handleGoAwards = () => {
    Taro.navigateTo({ url: '/pages/awards/index' });
  };

  const iconWrapClass = (index: number) => {
    const classes = [styles.iconWrap1, styles.iconWrap2, styles.iconWrap3];
    return classes[index % 3];
  };

  const getStatusBadge = (record: HistoryRecord) => {
    if (record.hadMakeUp) return { text: '补更达标', className: styles.statusMakeup };
    if (record.tasksCompleted === 3) return { text: '完美', className: styles.statusGood };
    if (record.tasksCompleted >= 1) return { text: '进行中', className: styles.statusNormal };
    return { text: '待开始', className: styles.statusNormal };
  };

  const getWeekDay = (dateStr: string): string => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[new Date(dateStr).getDay()];
  };

  const getDayMonth = (dateStr: string): string => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  const expandedRecord = expandedDate ? history.find(r => r.date === expandedDate) : null;

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.headerCard}>
        <View className={styles.headerTitle}>
          <Text className={styles.headerIcon}>💪</Text>
          <Text className={styles.headerTitleText}>补更任务卡</Text>
        </View>
        <Text className={styles.headerDesc}>
          偶尔的断更不是失败，休息一下也没关系～
        </Text>
        <Text className={styles.headerHighlight}>
          {selectedMakeUpTask
            ? `今日已安排: ${mockMakeUpTasks.find(t => t.type === selectedMakeUpTask)?.title || selectedMakeUpTask}`
            : '选择一个补更方式，让故事继续下去吧！'
          }
        </Text>
      </View>

      {nextReward && (
        <View className={styles.streakProgress}>
          <View className={styles.streakLeft}>
            <Text className={styles.streakTitle}>🎁 养成进度</Text>
            <Text className={styles.streakText}>
              当前称号：<Text className={styles.streakHighlight}>🏆 {stats.currentTitle}</Text>
            </Text>
          </View>
          <View className={styles.streakInfo}>
            <Text className={styles.streakNext}>
              再连更 <Text className={styles.streakHighlight}>{nextReward.daysRemaining}天</Text> 解锁
              <Text className={styles.streakHighlight}>{nextReward.name}</Text>
              {nextReward.type === 'item' ? '✨' : '👑'}
            </Text>
            <View className={styles.streakBar}>
              <View
                className={styles.streakBarFill}
                style={{ width: `${((stats.currentStreak) / nextReward.days) * 100}%` }}
              />
            </View>
          </View>
        </View>
      )}

      <View className={styles.sectionTitle}>
        <Text className={styles.sectionIcon}>📅</Text>
        <Text className={styles.sectionTitleText}>创作日历</Text>
        <Button className={styles.awardsLink} onClick={handleGoAwards}>
          <Text className={styles.awardsLinkText}>图鉴 →</Text>
        </Button>
      </View>

      <View className={styles.calendarCard}>
        <View className={styles.calendarHeader}>
          <Button className={styles.calendarNav} onClick={prevMonth}>
            <Text className={styles.calendarNavText}>‹</Text>
          </Button>
          <Text className={styles.calendarMonth}>{monthLabel}</Text>
          <Button className={styles.calendarNav} onClick={nextMonth}>
            <Text className={styles.calendarNavText}>›</Text>
          </Button>
        </View>
        <View className={styles.calendarWeekRow}>
          {WEEK_DAYS.map(d => (
            <Text key={d} className={styles.calendarWeekDay}>{d}</Text>
          ))}
        </View>
        <View className={styles.calendarGrid}>
          {calendarDays.map((day, idx) => {
            const hasRecord = day.tasksCompleted > 0 || day.hadMakeUp;
            const isExpanded = expandedDate === day.date;
            return (
              <View key={idx} className={styles.calendarCellWrap}>
                <Button
                  className={classnames(
                    styles.calendarCell,
                    !day.isCurrentMonth && styles.cellOtherMonth,
                    day.isToday && styles.cellToday,
                    hasRecord && styles.cellHasRecord
                  )}
                  onClick={() => hasRecord ? toggleExpand(day.date) : undefined}
                >
                  <Text className={classnames(
                    styles.cellDay,
                    day.isToday && styles.cellDayToday
                  )}>{day.day}</Text>
                  {hasRecord && (
                    <View className={styles.cellDots}>
                      {[0, 1, 2].map(i => (
                        <View
                          key={i}
                          className={classnames(
                            styles.cellDot,
                            i < day.tasksCompleted && styles.cellDotDone,
                            day.hadMakeUp && i === 2 && styles.cellDotMakeup
                          )}
                        />
                      ))}
                    </View>
                  )}
                </Button>
                {isExpanded && expandedRecord && (
                  <View className={styles.cellExpanded}>
                    <Text className={styles.expandedDate}>
                      {getDayMonth(day.date)} {getWeekDay(day.date)}
                    </Text>
                    <Text className={styles.expandedInfo}>
                      完成 {expandedRecord.tasksCompleted}/3 · {expandedRecord.wordsWritten}字
                    </Text>
                    {expandedRecord.hadMakeUp && expandedRecord.makeUpLabel && (
                      <Text className={styles.expandedMakeUp}>
                        📋 {expandedRecord.makeUpLabel}
                      </Text>
                    )}
                    {expandedRecord.rewards && expandedRecord.rewards.length > 0 && (
                      <View className={styles.expandedRewards}>
                        <Text className={styles.expandedRewardsLabel}>🎁 解锁奖励：</Text>
                        <View className={styles.expandedRewardsList}>
                          {expandedRecord.rewards.map((reward, idx) => (
                            <Text key={idx} className={styles.expandedRewardTag}>
                              {reward}
                            </Text>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>

      <View className={styles.sectionTitle}>
        <Text className={styles.sectionIcon}>🎯</Text>
        <Text className={styles.sectionTitleText}>选择补更方式</Text>
      </View>

      <View className={styles.makeUpSection}>
        {mockMakeUpTasks.map((task, index) => {
          const isSelected = selectedMakeUpTask === task.type;
          return (
            <Button
              key={task.id}
              className={classnames(styles.makeUpCard, isSelected && styles.makeUpCardSelected)}
              onClick={() => handleSelectMakeUp(task)}
            >
              <View className={`${styles.makeUpIconWrap} ${iconWrapClass(index)}`}>
                <Text className={styles.makeUpIcon}>{task.icon}</Text>
              </View>
              <View className={styles.makeUpContent}>
                <Text className={styles.makeUpTitle}>{task.title}</Text>
                <Text className={styles.makeUpDesc}>{task.description}</Text>
              </View>
              {isSelected ? (
                <Text className={styles.makeUpCheck}>✓</Text>
              ) : (
                <Text className={styles.makeUpArrow}>›</Text>
              )}
            </Button>
          );
        })}
      </View>

      <View className={styles.sectionTitle}>
        <Text className={styles.sectionIcon}>📜</Text>
        <Text className={styles.sectionTitleText}>最近记录</Text>
        <View className={styles.modeToggle}>
          <Button
            className={classnames(styles.modeBtn, historyMode === 'week' && styles.modeBtnActive)}
            onClick={() => setHistoryMode('week')}
          >
            <Text className={styles.modeBtnText}>本周</Text>
          </Button>
          <Button
            className={classnames(styles.modeBtn, historyMode === 'month' && styles.modeBtnActive)}
            onClick={() => setHistoryMode('month')}
          >
            <Text className={styles.modeBtnText}>本月</Text>
          </Button>
        </View>
      </View>

      <View className={styles.statsRow}>
        <View className={styles.statsMiniCard}>
          <Text className={styles.statsMiniValue}>{periodStats.completedDays}</Text>
          <Text className={styles.statsMiniLabel}>完成天数</Text>
        </View>
        <View className={styles.statsMiniCard}>
          <Text className={styles.statsMiniValue}>{periodStats.makeUpCount}</Text>
          <Text className={styles.statsMiniLabel}>补更次数</Text>
        </View>
        <View className={styles.statsMiniCard}>
          <Text className={styles.statsMiniValue}>
            {periodStats.totalWords >= 10000
              ? `${(periodStats.totalWords / 10000).toFixed(1)}万`
              : periodStats.totalWords}
          </Text>
          <Text className={styles.statsMiniLabel}>总字数</Text>
        </View>
        <View className={styles.statsMiniCard}>
          <Text className={styles.statsMiniValue}>{periodStats.rewardCount}</Text>
          <Text className={styles.statsMiniLabel}>获得奖励</Text>
        </View>
      </View>

      <View className={styles.historySection}>
        {filteredHistory.length === 0 ? (
          <Text className={styles.emptyTip}>
            {historyMode === 'week' ? '本周还没有记录哦～' : '本月还没有记录哦～'}
          </Text>
        ) : (
          filteredHistory.map((record, idx) => {
            const status = getStatusBadge(record);
            return (
              <View key={idx} className={styles.historyItem}>
                <View className={styles.historyDate}>
                  <Text className={styles.dateDay}>{getDayMonth(record.date)}</Text>
                  <Text className={styles.dateWeek}>{getWeekDay(record.date)}</Text>
                </View>
                <View className={styles.historyInfo}>
                  <View className={styles.historyTasks}>
                    {[0, 1, 2].map(i => (
                      <View
                        key={i}
                        className={`${styles.taskDot} ${i < record.tasksCompleted ? styles.done : ''} ${record.hadMakeUp && i === 2 ? styles.makeup : ''}`}
                      />
                    ))}
                  </View>
                  <Text className={styles.historyWords}>
                    完成 {record.tasksCompleted}/3 · {record.wordsWritten}字
                    {record.makeUpLabel && ` · ${record.makeUpLabel}`}
                  </Text>
                </View>
                <View className={styles.historyStatus}>
                  <View className={`${styles.statusBadge} ${status.className}`}>
                    <Text>{status.text}</Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

export default TasksPage;
