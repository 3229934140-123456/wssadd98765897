import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { DailyTask } from '@/types';

interface TaskCardProps {
  task: DailyTask;
  onComplete?: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete }) => {
  const handleClick = () => {
    if (!task.completed && onComplete) {
      onComplete(task.id);
    }
  };

  return (
    <View className={classnames(styles.taskCard, task.completed && styles.completed)}>
      <View className={styles.cardInner}>
        <View className={styles.iconWrap}>
          <Text className={styles.icon}>{task.icon}</Text>
        </View>
        <View className={styles.content}>
          <Text className={styles.title}>{task.title}</Text>
          <Text className={styles.desc}>{task.description}</Text>
        </View>
        <View className={styles.action}>
          {task.completed ? (
            <View className={styles.doneBadge}>
              <Text className={styles.doneText}>✓ 完成</Text>
            </View>
          ) : (
            <Button
              className={styles.btn}
              onClick={handleClick}
            >
              <Text className={styles.btnText}>去完成</Text>
            </Button>
          )}
        </View>
      </View>
      {task.completed && <View className={styles.glow} />}
    </View>
  );
};

export default TaskCard;
