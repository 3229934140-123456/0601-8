import React from 'react';
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
      task: '/pages/task-detail/index',
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

  const handleDraftClick = (draftId: string) => {
    console.log('[CreatorPage] draft clicked:', draftId);
    Taro.navigateTo({
      url: `/pages/draft-box/index?id=${draftId}`,
    });
  };

  const handleCollectionClick = (collectionId: string) => {
    console.log('[CreatorPage] collection clicked:', collectionId);
    Taro.navigateTo({
      url: `/pages/collection-manage/index?id=${collectionId}`,
    });
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ScrollView scrollY className={styles.creatorPage} enhanced showScrollbar={false}>
      <View className={styles.header}>
        <Text className={styles.title}>创作者中心</Text>
        <Text className={styles.subtitle}>查看数据，管理作品</Text>
      </View>

      <View className={styles.statsCard}>
        <View className={styles.statsTitle}>
          数据概览
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
        <View className={styles.sectionTitle}>
          <Text>创作任务</Text>
          <Text className={styles.moreLink}>全部 ›</Text>
        </View>

        <View className={styles.taskList}>
          {tasks.map((task) => (
            <View
              key={task.id}
              className={styles.taskCard}
              onClick={() => handleTaskClick(task.id)}
            >
              <Image
                className={styles.taskCover}
                src={task.coverUrl}
                mode="aspectFill"
                onError={(e) => console.error('[CreatorPage] task image error:', e)}
              />
              <View className={styles.taskContent}>
                <View>
                  <Text className={styles.taskTitle}>{task.title}</Text>
                  <Text className={styles.taskDesc}>{task.description}</Text>
                </View>
                <View className={styles.taskFooter}>
                  <View className={styles.taskReward}>
                    <Text>🎁</Text>
                    <Text>{task.reward}</Text>
                  </View>
                  <View style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <View className={styles.taskProgress}>
                      <View
                        className={styles.taskProgressBar}
                        style={{ width: `${task.progress}%` }}
                      />
                    </View>
                    <Text className={styles.taskStatus}>{task.progress}%</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionTitle}>
          <Text>草稿箱</Text>
          <Text className={styles.moreLink}>全部草稿 ›</Text>
        </View>

        <View className={styles.draftList}>
          {drafts.map((draft) => (
            <View
              key={draft.id}
              className={styles.draftItem}
              onClick={() => handleDraftClick(draft.id)}
            >
              <Image
                className={styles.draftCover}
                src={draft.coverUrl}
                mode="aspectFill"
                onError={(e) => console.error('[CreatorPage] draft image error:', e)}
              />
              <View className={styles.draftDuration}>
                <Text>{formatDuration(draft.duration)}</Text>
              </View>
              <View className={styles.draftInfo}>
                <Text className={styles.draftTime}>{draft.title || '未命名'}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionTitle}>
          <Text>合集管理</Text>
          <Text className={styles.moreLink}>管理 ›</Text>
        </View>

        <View className={styles.taskList}>
          {collections.map((collection) => (
            <View
              key={collection.id}
              className={styles.taskCard}
              onClick={() => handleCollectionClick(collection.id)}
            >
              <Image
                className={styles.taskCover}
                src={collection.coverUrl}
                mode="aspectFill"
                onError={(e) => console.error('[CreatorPage] collection image error:', e)}
              />
              <View className={styles.taskContent}>
                <View>
                  <Text className={styles.taskTitle}>
                    {collection.title}
                    {collection.isTop && <Text style={{ color: '#FF2E63', marginLeft: '12rpx' }}> [置顶]</Text>}
                  </Text>
                  <Text className={styles.taskDesc}>
                    {collection.videosCount}个视频 · {formatNumber(collection.viewsCount)}次播放
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default CreatorPage;
