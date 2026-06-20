import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { CabinItem as CabinItemType } from '@/types';

interface CabinItemProps {
  item: CabinItemType;
}

const CabinItemComponent: React.FC<CabinItemProps> = ({ item }) => {
  return (
    <View
      className={classnames(styles.cabinItem, item.unlocked && styles.unlocked)}
      style={{ left: `${item.position.x}%`, top: `${item.position.y}%` }}
    >
      <View className={styles.itemInner}>
        <Text className={styles.icon}>{item.icon}</Text>
      </View>
      {item.unlocked && (
        <Text className={styles.name}>{item.name}</Text>
      )}
      {!item.unlocked && (
        <View className={styles.lockOverlay}>
          <Text className={styles.lockIcon}>🔒</Text>
        </View>
      )}
    </View>
  );
};

export default CabinItemComponent;
