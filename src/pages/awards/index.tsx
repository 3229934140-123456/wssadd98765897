import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { useApp } from '@/store/AppContext';
import { streakRewards, titleList } from '@/data/mockData';
import classnames from 'classnames';
import styles from './index.module.scss';

const AwardsPage: React.FC = () => {
  const { cabinItems, stats } = useApp();

  const itemRewards = streakRewards.filter(r => r.type === 'item');
  const titleRewards = streakRewards.filter(r => r.type === 'title');

  const isItemUnlocked = (rewardId: string): boolean => {
    return cabinItems.find(i => i.id === rewardId)?.unlocked ?? false;
  };

  const isTitleUnlocked = (requiredDays: number): boolean => {
    return stats.currentStreak >= requiredDays;
  };

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerIcon}>🏆</Text>
        <Text className={styles.headerTitle}>成就图鉴</Text>
        <Text className={styles.headerDesc}>
          连更解锁装饰和称号，让小屋越来越温馨！
        </Text>
      </View>

      <View className={styles.sectionTitle}>
        <Text className={styles.sectionIcon}>✨</Text>
        <Text className={styles.sectionTitleText}>装饰图鉴</Text>
        <Text className={styles.sectionSub}>
          {cabinItems.filter(i => i.unlocked).length}/{cabinItems.length}
        </Text>
      </View>

      <View className={styles.grid}>
        {cabinItems.map(item => {
          const streakReward = streakRewards.find(r => r.id === item.id);
          const daysRequired = item.streakDaysRequired;
          const daysRemaining = daysRequired ? Math.max(0, daysRequired - stats.currentStreak) : 0;
          return (
            <View
              key={item.id}
              className={classnames(
                styles.gridItem,
                item.unlocked && styles.gridItemUnlocked,
                !item.unlocked && styles.gridItemLocked
              )}
            >
              <View className={styles.gridItemIcon}>
                <Text className={styles.iconEmoji}>{item.icon}</Text>
              </View>
              <Text className={styles.gridItemName}>{item.name}</Text>
              {item.unlocked ? (
                <Text className={styles.gridItemStatus}>已解锁 ✅</Text>
              ) : daysRequired ? (
                <Text className={styles.gridItemStatus}>
                  还差{daysRemaining}天 🔒
                </Text>
              ) : (
                <Text className={styles.gridItemStatus}>完成任务 🔒</Text>
              )}
            </View>
          );
        })}
      </View>

      <View className={styles.sectionTitle}>
        <Text className={styles.sectionIcon}>👑</Text>
        <Text className={styles.sectionTitleText}>称号图鉴</Text>
        <Text className={styles.sectionSub}>
          {titleList.filter(t => stats.currentStreak >= t.days).length}/{titleList.length}
        </Text>
      </View>

      <View className={styles.titleList}>
        {titleList.map(title => {
          const unlocked = stats.currentStreak >= title.days;
          const isCurrent = stats.currentTitle === title.name;
          const daysRemaining = Math.max(0, title.days - stats.currentStreak);
          return (
            <View
              key={title.id}
              className={classnames(
                styles.titleItem,
                unlocked && styles.titleItemUnlocked,
                !unlocked && styles.titleItemLocked,
                isCurrent && styles.titleItemCurrent
              )}
            >
              <View className={styles.titleLeft}>
                <Text className={styles.titleIcon}>
                  {unlocked ? '👑' : '🔒'}
                </Text>
                <View className={styles.titleInfo}>
                  <Text className={classnames(
                    styles.titleName,
                    !unlocked && styles.titleNameLocked
                  )}>
                    {unlocked ? title.name : '???'}
                  </Text>
                  <Text className={styles.titleDesc}>
                    连更 {title.days} 天解锁
                  </Text>
                </View>
              </View>
              <View className={styles.titleRight}>
                {isCurrent && (
                  <View className={styles.currentBadge}>
                    <Text className={styles.currentBadgeText}>当前</Text>
                  </View>
                )}
                {!unlocked && (
                  <Text className={styles.titleRemaining}>
                    差{daysRemaining}天
                  </Text>
                )}
                {unlocked && !isCurrent && (
                  <Text className={styles.titleCheck}>✅</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>

      <View className={styles.sectionTitle}>
        <Text className={styles.sectionIcon}>🎁</Text>
        <Text className={styles.sectionTitleText}>连更里程碑</Text>
      </View>

      <View className={styles.milestoneList}>
        {streakRewards.map(reward => {
          const unlocked = reward.type === 'item'
            ? isItemUnlocked(reward.id)
            : isTitleUnlocked(reward.days);
          const daysRemaining = Math.max(0, reward.days - stats.currentStreak);
          return (
            <View
              key={reward.id}
              className={classnames(
                styles.milestoneItem,
                unlocked && styles.milestoneItemUnlocked
              )}
            >
              <View className={styles.milestoneLeft}>
                <View className={classnames(
                  styles.milestoneBadge,
                  unlocked ? styles.milestoneBadgeOn : styles.milestoneBadgeOff
                )}>
                  <Text className={styles.milestoneDays}>{reward.days}天</Text>
                </View>
                <View className={styles.milestoneLine} />
              </View>
              <View className={styles.milestoneContent}>
                <Text className={styles.milestoneName}>
                  {unlocked ? reward.name : '???'}
                </Text>
                <Text className={styles.milestoneDesc}>{reward.description}</Text>
                {!unlocked && (
                  <Text className={styles.milestoneRemaining}>
                    再坚持 {daysRemaining} 天即可解锁
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default AwardsPage;
