import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Image, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { CreatorTask, Challenge, Video } from '@/types';
import { useAppStore } from '@/store';
import { mockChallenges } from '@/data/index';

const TaskDetailPage: React.FC = () => {
  const tasks = useAppStore(state => state.tasks);
  const videos = useAppStore(state => state.videos);
  const claimTask = useAppStore(state => state.claimTask);
  const currentUser = useAppStore(state => state.currentUser);

  const [task, setTask] = useState<CreatorTask | null>(null);
  const [taskChallenges, setTaskChallenges] = useState<Challenge[]>([]);

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
        const challenges = mockChallenges.filter(c => found.challengeIds?.includes(c.id));
        setTaskChallenges(challenges);
      } else {
        setTask(tasks[0]);
        const challenges = mockChallenges.filter(c => tasks[0].challengeIds?.includes(c.id));
        setTaskChallenges(challenges);
      }
    } else {
      setTask(tasks[0]);
      const challenges = mockChallenges.filter(c => tasks[0].challengeIds?.includes(c.id));
      setTaskChallenges(challenges);
    }
  }, [tasks]);

  const submittedVideos = useMemo(() => {
    if (!task || task.challengeIds?.length === 0) return [];
    return videos.filter(v => {
      if (v.author.id !== currentUser.id) return false;
      const videoChallengeIds = v.challenges?.map(c => c.id) || (v.challenge ? [v.challenge.id] : []);
      return task.challengeIds?.some(cid => videoChallengeIds.includes(cid));
    });
  }, [task, videos, currentUser.id]);

  const remainingCount = useMemo(() => {
    if (!task) return 0;
    const required = task.requiredCount || 2;
    const completed = Math.floor((task.progress / 100) * required);
    return Math.max(required - completed, 0);
  }, [task]);

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

  const handleVideoClick = (videoId: string) => {
    Taro.navigateTo({
      url: '/pages/video-detail/index?id=' + videoId,
    });
  };

  const handleGoPublish = () => {
    Taro.switchTab({ url: '/pages/shoot/index' });
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
                {isCompleted ? '已完成' : (isOngoing ? '进行中' : '可领取')}
              </Text>
            </View>
          </View>

          {!canClaim && (
            <View className={styles.progressRow}>
              <Text className={styles.progressLabel}>完成进度</Text>
              <Text className={styles.progressValue}>{task.progress}%</Text>
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

          {isOngoing && (
            <Text className={styles.remainingText}>
              还差 {remainingCount} 条视频即可完成任务
            </Text>
          )}

          <View className={styles.deadlineRow}>
            <Text className={styles.deadlineLabel}>截止时间</Text>
            <Text className={styles.deadlineValue}>📅 {task.deadline}</Text>
          </View>
        </View>

        {taskChallenges.length > 0 && (
          <View className={styles.sectionCard}>
            <Text className={styles.sectionTitle}>关联话题</Text>
            <View className={styles.challengeList}>
              {taskChallenges.map(c => (
                <View key={c.id} className={styles.challengeTag}>
                  <Text>{c.tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View className={styles.sectionCard}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>已投稿视频</Text>
            <Text className={styles.sectionCount}>{submittedVideos.length} 条</Text>
          </View>
          {submittedVideos.length === 0 ? (
            <View className={styles.emptyVideos}>
              <Text className={styles.emptyIcon}>🎬</Text>
              <Text className={styles.emptyText}>还没有投稿视频</Text>
            </View>
          ) : (
            <View className={styles.videoRow}>
              {submittedVideos.map(video => (
                <View
                  key={video.id}
                  className={styles.videoItem}
                  onClick={() => handleVideoClick(video.id)}
                >
                  <Image
                    className={styles.videoCover}
                    src={video.coverUrl}
                    mode="aspectFill"
                  />
                  <Text className={styles.videoTitle} numberOfLines={2}>
                    {video.title}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View className={styles.sectionCard}>
          <Text className={styles.sectionTitle}>任务描述</Text>
          <Text className={styles.descText}>{task.description}</Text>
        </View>

        <View className={styles.sectionCard}>
          <Text className={styles.sectionTitle}>任务规则</Text>
          <View className={styles.ruleList}>
            <View className={styles.ruleItem}>
              <Text className={styles.ruleDot}>•</Text>
              <Text className={styles.ruleText}>
                发布视频需带有指定话题标签
                {taskChallenges.length > 0 && `（${taskChallenges.map(c => c.tag).join('、')}）`}
              </Text>
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
              <Text className={styles.ruleText}>共需发布 {task.requiredCount || 2} 条视频完成任务</Text>
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
          <View className={styles.goShootBtn} onClick={handleGoPublish}>
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
