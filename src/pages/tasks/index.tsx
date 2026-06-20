import React from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useApp } from '@/store/AppContext';
import { mockMakeUpTasks } from '@/data/mockData';
import { MakeUpTask, HistoryRecord } from '@/types';
import styles from './index.module.scss';

const TasksPage: React.FC = () => {
  const { history, selectMakeUpTask } = useApp();

  const getWeekDay = (dateStr: string): string => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const date = new Date(dateStr);
    return days[date.getDay()];
  };

  const getDayMonth = (dateStr: string): string => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const handleSelectMakeUp = (task: MakeUpTask) => {
    selectMakeUpTask(task.type);
    Taro.showToast({
      title: `已选择:${task.title}`,
      icon: 'success',
      duration: 2000
    });
    console.log('[TasksPage] Make-up task selected:', task.type);
  };

  const getStatusBadge = (record: HistoryRecord) => {
    if (record.hadMakeUp) {
      return { text: '补更达标', className: styles.statusMakeup };
    }
    if (record.tasksCompleted === 3) {
      return { text: '完美', className: styles.statusGood };
    }
    if (record.tasksCompleted >= 1) {
      return { text: '进行中', className: styles.statusNormal };
    }
    return { text: '待开始', className: styles.statusNormal };
  };

  const iconWrapClass = (index: number) => {
    const classes = [styles.iconWrap1, styles.iconWrap2, styles.iconWrap3];
    return classes[index % 3];
  };

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
          选择一个补更方式，让故事继续下去吧！
        </Text>
      </View>

      <View className={styles.sectionTitle}>
        <Text className={styles.sectionIcon}>🎯</Text>
        <Text className={styles.sectionTitleText}>选择补更方式</Text>
      </View>

      <View className={styles.makeUpSection}>
        {mockMakeUpTasks.map((task, index) => (
          <Button
            key={task.id}
            className={styles.makeUpCard}
            onClick={() => handleSelectMakeUp(task)}
          >
            <View className={`${styles.makeUpIconWrap} ${iconWrapClass(index)}`}>
              <Text className={styles.makeUpIcon}>{task.icon}</Text>
            </View>
            <View className={styles.makeUpContent}>
              <Text className={styles.makeUpTitle}>{task.title}</Text>
              <Text className={styles.makeUpDesc}>{task.description}</Text>
            </View>
            <Text className={styles.makeUpArrow}>›</Text>
          </Button>
        ))}
      </View>

      <View className={styles.sectionTitle}>
        <Text className={styles.sectionIcon}>📜</Text>
        <Text className={styles.sectionTitleText}>最近记录</Text>
        <Text className={styles.sectionSub}>近7天</Text>
      </View>

      <View className={styles.historySection}>
        {history.length === 0 ? (
          <Text className={styles.emptyTip}>还没有记录，开始今天的创作吧！</Text>
        ) : (
          history.map((record, idx) => {
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
                    完成 {record.tasksCompleted}/3 任务 · {record.wordsWritten} 字
                    {record.hadMakeUp && ' · 含补更'}
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
