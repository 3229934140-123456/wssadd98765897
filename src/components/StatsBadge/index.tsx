import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface StatsBadgeProps {
  icon: string;
  value: string | number;
  label: string;
  color?: string;
}

const StatsBadge: React.FC<StatsBadgeProps> = ({ icon, value, label, color }) => {
  return (
    <View className={styles.badge}>
      <View
        className={styles.iconWrap}
        style={color ? { background: color } : undefined}
      >
        <Text className={styles.icon}>{icon}</Text>
      </View>
      <Text className={styles.value}>{value}</Text>
      <Text className={styles.label}>{label}</Text>
    </View>
  );
};

export default StatsBadge;
