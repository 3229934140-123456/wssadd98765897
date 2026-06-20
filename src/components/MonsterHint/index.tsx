import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import styles from './index.module.scss';
import { MonsterState } from '@/types';

interface MonsterHintProps {
  monster: MonsterState;
  onDismiss?: () => void;
}

const MonsterHint: React.FC<MonsterHintProps> = ({ monster, onDismiss }) => {
  if (!monster.active) return null;

  return (
    <View className={styles.monsterWrap}>
      <View className={styles.monsterBox}>
        <View className={styles.monsterAvatar}>
          <Text className={styles.monsterFace}>👾</Text>
        </View>
        <View className={styles.monsterContent}>
          <Text className={styles.monsterTitle}>断更小怪 出现了！</Text>
          <Text className={styles.monsterMsg}>{monster.message}</Text>
        </View>
        <Button className={styles.closeBtn} onClick={onDismiss}>
          <Text className={styles.closeText}>×</Text>
        </Button>
      </View>
      <View className={styles.monsterFootprint}>
        <Text className={styles.footprint}>👣</Text>
        <Text className={styles.footprint}>👣</Text>
        <Text className={styles.footprintTip}>它正在靠近你的书架...</Text>
      </View>
    </View>
  );
};

export default MonsterHint;
