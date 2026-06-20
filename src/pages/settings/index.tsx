import React from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useApp } from '@/store/AppContext';
import { WorkTarget } from '@/types';
import classnames from 'classnames';
import styles from './index.module.scss';

const SettingsPage: React.FC = () => {
  const { work, stats, targetOptions, updateWork, updateWorkTarget } = useApp();

  const handleTypeChange = (type: 'novel' | 'script') => {
    updateWork({ type });
    Taro.showToast({
      title: type === 'novel' ? '已切换为轻小说' : '已切换为漫画脚本',
      icon: 'success'
    });
    console.log('[SettingsPage] Type changed:', type);
  };

  const handleTargetSelect = (target: WorkTarget) => {
    updateWorkTarget(target);
    Taro.showToast({
      title: `目标已切换:${target.label}`,
      icon: 'success'
    });
    console.log('[SettingsPage] Target selected:', target.type);
  };

  const formatWords = (words: number): string => {
    if (words >= 10000) {
      return `${(words / 10000).toFixed(1)}万`;
    }
    return words.toLocaleString();
  };

  const getIconClass = (type: string) => {
    switch (type) {
      case 'daily3000': return styles.iconDaily;
      case 'weekly5ep': return styles.iconWeekly;
      case 'monthlyRank': return styles.iconMonthly;
      default: return styles.iconDaily;
    }
  };

  const getIconEmoji = (type: string) => {
    switch (type) {
      case 'daily3000': return '📝';
      case 'weekly5ep': return '📚';
      case 'monthlyRank': return '🏆';
      default: return '📝';
    }
  };

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.section}>
        <View className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>📖</Text>
          <Text className={styles.sectionTitleText}>作品信息</Text>
        </View>
        <View className={styles.workInfoCard}>
          <View className={styles.workHeader}>
            <View>
              <Text className={styles.workName}>{work.title}</Text>
              <View className={styles.workTypeTag}>
                <Text className={styles.typeTagText}>
                  {work.type === 'novel' ? '📖 轻小说' : '🎨 漫画脚本'}
                </Text>
              </View>
            </View>
            <Text className={styles.workDate}>
              创建于 {work.createdAt}
            </Text>
          </View>
          <Text className={styles.workDesc}>{work.description}</Text>
          <View className={styles.typeSwitch}>
            <Button
              className={classnames(styles.typeBtn, work.type === 'novel' && styles.active)}
              onClick={() => handleTypeChange('novel')}
            >
              <Text className={styles.typeBtnText}>📖 轻小说</Text>
            </Button>
            <Button
              className={classnames(styles.typeBtn, work.type === 'script' && styles.active)}
              onClick={() => handleTypeChange('script')}
            >
              <Text className={styles.typeBtnText}>🎨 漫画脚本</Text>
            </Button>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>🎯</Text>
          <Text className={styles.sectionTitleText}>创作目标</Text>
        </View>
        <View className={styles.targetList}>
          {targetOptions.map(target => {
            const isActive = work.target.type === target.type;
            return (
              <Button
                key={target.type}
                className={classnames(styles.targetCard, isActive && styles.active)}
                onClick={() => handleTargetSelect(target)}
              >
                <View className={`${styles.targetIconWrap} ${getIconClass(target.type)}`}>
                  <Text className={styles.targetIcon}>{getIconEmoji(target.type)}</Text>
                </View>
                <View className={styles.targetContent}>
                  <Text className={styles.targetTitle}>{target.label}</Text>
                  <Text className={styles.targetDesc}>{target.description}</Text>
                </View>
                <View className={styles.targetCheck}>
                  <Text className={styles.checkIcon}>✓</Text>
                </View>
              </Button>
            );
          })}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>📊</Text>
          <Text className={styles.sectionTitleText}>创作概览</Text>
        </View>
        <View className={styles.statsOverview}>
          <View className={styles.statsItem}>
            <Text className={styles.statsValue}>{stats.totalDays}</Text>
            <Text className={styles.statsLabel}>创作天数</Text>
          </View>
          <View className={styles.statsItem}>
            <Text className={styles.statsValue}>{formatWords(work.totalWords)}</Text>
            <Text className={styles.statsLabel}>累计字数</Text>
          </View>
          <View className={styles.statsItem}>
            <Text className={styles.statsValue}>{stats.completedTasks}</Text>
            <Text className={styles.statsLabel}>完成任务</Text>
          </View>
          <View className={styles.statsItem}>
            <Text className={styles.statsValue}>{stats.unlockedItems}</Text>
            <Text className={styles.statsLabel}>解锁道具</Text>
          </View>
        </View>
      </View>

    </ScrollView>
  );
};

export default SettingsPage;
