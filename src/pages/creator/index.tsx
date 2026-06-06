import React, { useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { mockCreatorData, mockCollections } from '@/data/index';
import { useAppStore } from '@/store';

const quickActions = [
  { id: 'data', icon: '📊', name: '数据中心' },
  { id: 'draft', icon: '📝', name: '草稿箱' },
  { id: 'collection', icon: '📁', name: '合集管理' },
  { id: 'task', icon: '🎯', name: '创作任务' },
  { id: 'shop', icon: '🏪', name: '营业信息' },
  { id: 'service', icon: '💬', name: '创作服务' },
  { id: 'school', icon: '📚', name: '创作者学院' },
  { id: 'more', icon: '⋯', name: '更多' },
];

const CreatorPage: React.FC = () => {
  const drafts = useAppStore(state => state.drafts);
  const tasks = useAppStore(state => state.tasks);

  const data = mockCreatorData;
  const collections = mockCollections;

  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'w';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const handleQuickAction = (actionId: string) => {
    console.log('[CreatorPage] quick action:', actionId);
    const routeMap: Record<string, string> = {
      draft: '/pages/draft-box/index',
      collection: '/pages/collection-manage/index',
      shop: '/pages/business-info/index',
      task: '/pages/task-list/index',
      data: '/pages/task-list/index',
    };
    if (routeMap[actionId]) {
      Taro.navigateTo({ url: routeMap[actionId] });
    } else {
      Taro.showToast({
        title: `${actionId}功能开发中`,
        icon: 'none',
      });
    }
  };

  const handleTaskClick = (taskId: string) => {
    console.log('[CreatorPage] task clicked:', taskId);
    Taro.navigateTo({
      url: `/pages/task-detail/index?id=${taskId}`,
    });
  };

  const handleAllTasks = () => {
    Taro.navigateTo({
      url: '/pages/task-list/index',
    });
  };

  const handleDraftClick = (draftId: string) => {
    console.log('[CreatorPage] draft clicked:', draftId);
    Taro.navigateTo({
      url: `/pages/draft-box/index?id=${draftId}`,
    });
  };

  const handleAllDrafts = () => {
    Taro.navigateTo({
      url: '/pages/draft-box/index',
    });
  };

  const handleCollectionClick = (collectionId: string) => {
    console.log('[CreatorPage] collection clicked:', collectionId);
    Taro.navigateTo({
      url: `/pages/collection-manage/index?id=${collectionId}`,
    });
  };

  const handleManageCollections = () => {
    Taro.navigateTo({
      url: '/pages/collection-manage/index',
    });
  };

  const getTaskStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '可领取';
      case 'ongoing': return '进行中';
      case 'completed': return '已完成';
      default: return '';
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const displayTasks = useMemo(() => tasks.slice(0, 3), [tasks]);
  const displayDrafts = useMemo(() => drafts.slice(0, 3), [drafts]);

  return (
    <ScrollView scrollY className={styles.creatorPage} enhanced showScrollbar={false}>
      <View className={styles.header}>
        <Text className={styles.title}>创作者中心</Text>
        <Text className={styles.subtitle}>查看数据，管理作品</Text>
      </View>

      <View className={styles.statsCard}>
        <View className={styles.statsTitle}>
          <Text>数据概览</Text>
          <Text className={styles.statsDate}>今日</Text>
        </View>

        <View className={styles.statsGrid}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{formatNumber(data.totalViews)}</Text>
            <Text className={styles.statLabel}>总播放</Text>
            <Text className={styles.statChange}>+{formatNumber(data.todayViews)}</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{formatNumber(data.totalLikes)}</Text>
            <Text className={styles.statLabel}>总获赞</Text>
            <Text className={styles.statChange}>+{formatNumber(data.todayLikes)}</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{formatNumber(data.totalFans)}</Text>
            <Text className={styles.statLabel}>粉丝数</Text>
            <Text className={styles.statChange}>+{data.todayFans}</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{data.conversionRate}%</Text>
            <Text className={styles.statLabel}>转化率</Text>
            <Text className={styles.statChange}>↑ 2.3%</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>常用功能</Text>
        <View className={styles.quickGrid}>
          {quickActions.map((action) => (
            <View
              key={action.id}
              className={styles.quickItem}
              onClick={() => handleQuickAction(action.id)}
            >
              <View className={styles.quickIcon}>
                <Text>{action.icon}</Text>
              </View>
              <Text className={styles.quickText}>{action.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>创作任务</Text>
          <Text className={styles.moreLink} onClick={handleAllTasks}>全部 ›</Text>
        </View>

        <View className={styles.taskList}>
          {displayTasks.map((task) => (
            <View
              key={task.id}
              className={styles.taskCard}
              onClick={() => handleTaskClick(task.id)}
            >
              <Image
                className={styles.taskCover}
                src={task.coverUrl}
                mode="aspectFill"
              />
              <View className={styles.taskInfo}>
                <View className={styles.taskRow}>
                  <Text className={styles.taskTitle}>{task.title}</Text>
                  <View className={styles.taskBadge}>
                    <Text>{getTaskStatusText(task.status)}</Text>
                  </View>
                </View>
                <Text className={styles.taskReward}>🎁 {task.reward}</Text>
                {task.status === 'ongoing' && (
                  <View className={styles.taskProgress}>
                    <View className={styles.progressBar}>
                      <View
                        className={styles.progressFill}
                        style={{ width: `${task.progress}%` }}
                      />
                    </View>
                    <Text className={styles.progressText}>{task.progress}%</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>草稿箱</Text>
          <Text className={styles.moreLink} onClick={handleAllDrafts}>
            全部 {drafts.length} ›
          </Text>
        </View>

        {displayDrafts.length === 0 ? (
          <View className={styles.emptyMini}>
            <Text className={styles.emptyMiniText}>暂无草稿</Text>
          </View>
        ) : (
          <ScrollView scrollX className={styles.draftRow} enhanced showScrollbar={false}>
            {displayDrafts.map((draft) => (
              <View
                key={draft.id}
                className={styles.draftCard}
                onClick={() => handleDraftClick(draft.id)}
              >
                <Image
                  className={styles.draftCover}
                  src={draft.coverUrl}
                  mode="aspectFill"
                />
                <View className={styles.draftInfo}>
                  <Text className={styles.draftTitle}>
                    {draft.title || '未命名草稿'}
                  </Text>
                  <Text className={styles.draftTime}>
                    ⏱ {formatDuration(draft.duration)}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>合集管理</Text>
          <Text className={styles.moreLink} onClick={handleManageCollections}>管理 ›</Text>
        </View>

        <View className={styles.collectionGrid}>
          {collections.slice(0, 4).map((col) => (
            <View
              key={col.id}
              className={styles.collectionItem}
              onClick={() => handleCollectionClick(col.id)}
            >
              <Image
                className={styles.collectionCover}
                src={col.coverUrl}
                mode="aspectFill"
              />
              <View className={styles.collectionInfo}>
                <Text className={styles.collectionTitle} numberOfLines={1}>
                  {col.title}
                </Text>
                <Text className={styles.collectionCount}>
                  {col.videosCount}个视频
                </Text>
              </View>
              {col.isTop && (
                <View className={styles.topBadge}>
                  <Text>置顶</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default CreatorPage;
