import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { MonsterState } from '@/types';

interface MonsterHintProps {
  monster: MonsterState;
  onDismiss?: () => void;
}

const MonsterHint: React.FC<MonsterHintProps> = ({ monster, onDismiss }) => {
  if (!monster.active) return null;

  const isGentle = monster.level === 1;
  const titleText = isGentle ? '断更小怪 在门口探头...' : '断更小怪 靠近书架了！';
  const footprintText = isGentle ? '它正在远处观望...' : '它正在靠近你的书架...';
  const footCount = isGentle ? 1 : 3;

  return (
    <View className={classnames(styles.monsterWrap, isGentle ? styles.gentle : styles.urgent)}>
      <View className={styles.monsterBox}>
        <View className={classnames(styles.monsterAvatar, isGentle ? styles.avatarGentle : styles.avatarUrgent)}>
          <Text className={styles.monsterFace}>{isGentle ? '👻' : '👾'}</Text>
        </View>
        <View className={styles.monsterContent}>
          <Text className={styles.monsterTitle}>{titleText}</Text>
          <Text className={styles.monsterMsg}>{monster.message}</Text>
        </View>
        <Button className={styles.closeBtn} onClick={onDismiss}>
          <Text className={styles.closeText}>×</Text>
        </Button>
      </View>
      <View className={styles.monsterFootprint}>
        {Array.from({ length: footCount }).map((_, i) => (
          <Text key={i} className={styles.footprint}>👣</Text>
        ))}
        <Text className={styles.footprintTip}>{footprintText}</Text>
      </View>
    </View>
  );
};

export default MonsterHint;
