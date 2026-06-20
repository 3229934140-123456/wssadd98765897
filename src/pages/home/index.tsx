import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { useApp } from '@/store/AppContext';
import TaskCard from '@/components/TaskCard';
import CabinItemComponent from '@/components/CabinItem';
import MonsterHint from '@/components/MonsterHint';
import StatsBadge from '@/components/StatsBadge';
import styles from './index.module.scss';

const HomePage: React.FC = () => {
  const {
    work,
    dailyTasks,
    cabinItems,
    monster,
    stats,
    completeTask,
    triggerMonster
  } = useApp();

  const completedCount = useMemo(
    () => dailyTasks.filter(t => t.completed).length,
    [dailyTasks]
  );

  const formatWords = (words: number): string => {
    if (words >= 10000) {
      return `${(words / 10000).toFixed(1)}万`;
    }
    return words.toLocaleString();
  };

  const handleDismissMonster = () => {
    console.log('[HomePage] Monster dismissed');
  };

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.workCard}>
        <View className={styles.workTop}>
          <View>
            <Text className={styles.workTitle}>{work.title}</Text>
            <Text className={styles.workType}>
              {work.type === 'novel' ? '📖 轻小说' : '🎨 漫画脚本'}
            </Text>
          </View>
          <View className={styles.workTarget}>
            <Text className={styles.workTargetLabel}>当前目标</Text>
            <Text>{work.target.label}</Text>
          </View>
        </View>
        <View className={styles.workStats}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{work.streakDays}天</Text>
            <Text className={styles.statLabel}>连续更新</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{formatWords(work.totalWords)}</Text>
            <Text className={styles.statLabel}>累计字数</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.unlockedItems}件</Text>
            <Text className={styles.statLabel}>小屋道具</Text>
          </View>
        </View>
      </View>

      <View className={styles.cabinSection}>
        <View className={styles.sectionTitle}>
          <Text className={styles.sectionTitleText}>🏠 我的连载小屋</Text>
          <Text className={styles.sectionSub}>完成任务点亮道具</Text>
        </View>
        <View className={styles.cabinScene}>
          <View className={styles.cabinBg}>
            <View className={styles.wall} />
            <View className={styles.floor} />
            <View className={styles.window}>
              <View className={styles.windowCross1} />
              <View className={styles.windowCross2} />
            </View>
            <View className={styles.bookshelf}>
              <View className={styles.shelf}>
                <View className={`${styles.book} ${styles.book1}`} />
                <View className={`${styles.book} ${styles.book2}`} />
                <View className={`${styles.book} ${styles.book3}`} />
              </View>
              <View className={styles.shelf}>
                <View className={`${styles.book} ${styles.book4}`} />
                <View className={`${styles.book} ${styles.book5}`} />
                <View className={`${styles.book} ${styles.book6}`} />
              </View>
              <View className={styles.shelf}>
                <View className={`${styles.book} ${styles.book2}`} />
                <View className={`${styles.book} ${styles.book1}`} />
                <View className={`${styles.book} ${styles.book4}`} />
              </View>
            </View>
            <View className={styles.desk}>
              <View className={styles.deskLeg1} />
              <View className={styles.deskLeg2} />
            </View>
            <View className={styles.carpet} />
          </View>
          {cabinItems.map(item => (
            <CabinItemComponent key={item.id} item={item} />
          ))}
        </View>
      </View>

      <View className={styles.tasksSection}>
        {monster.active && (
          <MonsterHint monster={monster} onDismiss={handleDismissMonster} />
        )}

        <View className={styles.tasksHeader}>
          <View className={styles.tasksTitle}>
            <Text className={styles.tasksTitleIcon}>📋</Text>
            <Text className={styles.tasksTitleText}>今日任务</Text>
          </View>
          <Text className={styles.tasksProgress}>
            {completedCount} / {dailyTasks.length} 已完成
          </Text>
        </View>

        {dailyTasks.map(task => (
          <TaskCard key={task.id} task={task} onComplete={completeTask} />
        ))}
      </View>

      <View className={styles.statsSection}>
        <StatsBadge icon="🔥" value={stats.currentStreak} label="连更天数" />
        <StatsBadge icon="✅" value={stats.completedTasks} label="完成任务" color="linear-gradient(135deg, #95DE64 0%, #52C41A 100%)" />
        <StatsBadge icon="🏆" value={stats.longestStreak} label="最长连更" color="linear-gradient(135deg, #FFD666 0%, #FAAD14 100%)" />
        <StatsBadge icon="✨" value={stats.unlockedItems} label="解锁道具" color="linear-gradient(135deg, #A394F5 0%, #7B68EE 100%)" />
      </View>
    </ScrollView>
  );
};

export default HomePage;
