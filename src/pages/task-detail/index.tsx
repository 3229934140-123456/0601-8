import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Button, Progress } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { CreatorTask } from '@/types';
import { useAppStore } from '@/store';

const TaskDetailPage: React.FC = () => {
  const tasks = useAppStore(state => state.tasks);
  const claimTask = useAppStore(state => state.claimTask);
  const [task, setTask] = useState<CreatorTask | null>(null);

  useEffect(() => {
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const params = (currentPage as any)?.options || {};
    const taskId = params.id;

    console.log('[TaskDetail] params:', params);

    if (taskId) {
      const found = tasks.find(t => t.id === taskId);
      if (found) {
        setTask(found);
      } else {
        setTask(tasks[0]);
      }
    } else {
      setTask(tasks[0]);
    }
  }, [tasks]);

  const handleClaim = () => {
    if (!task) return;
    claimTask(task.id);
    const updated = useAppStore.getState().tasks.find(t => t.id === task.id);
    if (updated) setTask(updated);
    console.log('[TaskDetail] task claimed:', task.id);
  };

  const handleBack = () => {
    Taro.navigateBack();
  };

  if (!task) {
    return (
      <View className={styles.taskPage}>
        <Text>加载中...</Text>
      </View>
    );
  }

  const canClaim = task.status === 'pending';
  const isOngoing = task.status === 'ongoing';
  const isCompleted = task.status === 'completed';

  return (
    <View className={styles.taskPage}>
      <View className={styles.header}>
        <Button className={styles.backBtn} onClick={handleBack}>
          <Text>←</Text>
        </Button>
        <Text className={styles.title}>任务详情</Text>
        <View className={styles.placeholder} />
      </View>

      <ScrollView className={styles.content} scrollY enhanced showScrollbar={false}>
        <View className={styles.taskHeader}>
          <Image className={styles.taskCover} src={task.coverUrl} mode="aspectFill" />
          <View className={styles.taskInfo}>
            <Text className={styles.taskTitle}>{task.title}</Text>
            <View className={styles.rewardBadge}>
              <Text>🎁 {task.reward}</Text>
            </View>
          </View>
        </View>

        <View className={styles.statusCard}>
          <View className={styles.statusRow}>
            <Text className={styles.statusLabel}>任务状态</Text>
            <View
              className={classnames(
                styles.statusBadge,
                isOngoing && styles.ongoing,
                isCompleted && styles.completed,
                canClaim && styles.pending
              )}
            >
              <Text>
                {isCompleted ? '已完成' : (isOngoing ? '进行中' : '待领取')}
              </Text>
            </View>
          </View>

          {!canClaim && (
            <View className={styles.progressRow}>
              <Text className={styles.progressLabel}>完成进度</Text>
              <View className={styles.progressValue}>
                <Text>{task.progress}%</Text>
              </View>
            </View>
          )}

          {!canClaim && (
            <View className={styles.progressBar}>
              <View
                className={styles.progressFill}
                style={{ width: `${task.progress}%` }}
              />
            </View>
          )}

          <View className={styles.deadlineRow}>
            <Text className={styles.deadlineLabel}>截止时间</Text>
            <Text className={styles.deadlineValue}>📅 {task.deadline}</Text>
          </View>
        </View>

        <View className={styles.descCard}>
          <Text className={styles.sectionTitle}>任务描述</Text>
          <Text className={styles.descText}>{task.description}</Text>
        </View>

        <View className={styles.ruleCard}>
          <Text className={styles.sectionTitle}>任务规则</Text>
          <View className={styles.ruleList}>
            <View className={styles.ruleItem}>
              <Text className={styles.ruleDot}>•</Text>
              <Text className={styles.ruleText}>发布视频需带有指定话题标签</Text>
            </View>
            <View className={styles.ruleItem}>
              <Text className={styles.ruleDot}>•</Text>
              <Text className={styles.ruleText}>视频时长不少于15秒</Text>
            </View>
            <View className={styles.ruleItem}>
              <Text className={styles.ruleDot}>•</Text>
              <Text className={styles.ruleText}>内容需原创且符合平台规范</Text>
            </View>
            <View className={styles.ruleItem}>
              <Text className={styles.ruleDot}>•</Text>
              <Text className={styles.ruleText}>完成后7个工作日内发放奖励</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className={styles.footer}>
        {canClaim && (
          <View className={styles.claimBtn} onClick={handleClaim}>
            <Text>立即领取任务</Text>
          </View>
        )}
        {isOngoing && (
          <View className={styles.goShootBtn} onClick={() => Taro.switchTab({ url: '/pages/shoot/index' })}>
            <Text>去发布视频</Text>
          </View>
        )}
        {isCompleted && (
          <View className={classnames(styles.claimBtn, styles.completedBtn)}>
            <Text>✓ 任务已完成</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default TaskDetailPage;
