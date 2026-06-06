import React, { useState } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockVideos, mockUsers } from '@/data/index';

const tabs = ['作品', '收藏', '喜欢'];

const MinePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('作品');
  const currentUser = mockUsers[0];
  const myVideos = mockVideos.slice(0, 6);

  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'w';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    console.log('[MinePage] tab changed:', tab);
  };

  const handleEditProfile = () => {
    Taro.showToast({
      title: '编辑资料',
      icon: 'none',
    });
  };

  const handleVideoClick = (videoId: string) => {
    Taro.navigateTo({
      url: '/pages/video-detail/index?id=' + videoId,
    });
  };

  const handleCreatorCenter = () => {
    Taro.navigateTo({
      url: '/pages/creator/index',
    });
  };

  const handleDraft = () => {
    Taro.showToast({
      title: '草稿箱',
      icon: 'none',
    });
  };

  const handleSetting = () => {
    Taro.showToast({
      title: '设置',
      icon: 'none',
    });
  };

  const handleChallenge = () => {
    Taro.navigateTo({
      url: '/pages/challenge/index',
    });
  };

  const handleMyCollections = () => {
    Taro.showToast({
      title: '我的收藏',
      icon: 'none',
    });
  };

  const renderContent = () => {
    if (activeTab === '作品') {
      if (myVideos.length === 0) {
        return (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🎬</Text>
            <Text className={styles.emptyText}>还没有发布作品</Text>
          </View>
        );
      }
      return (
        <View className={styles.contentGrid}>
          {myVideos.map((video) => (
            <View
              key={video.id}
              className={styles.gridItem}
              onClick={() => handleVideoClick(video.id)}
            >
              <Image
                className={styles.gridCover}
                src={video.coverUrl}
                mode="aspectFill"
                onError={(e) => console.error('[MinePage] image error:', e)}
              />
              <View className={styles.gridInfo}>
                <Text className={styles.gridViews}>▶ {formatNumber(video.viewsCount)}</Text>
              </View>
            </View>
          ))}
        </View>
      );
    }

    if (activeTab === '收藏') {
      return (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>⭐</Text>
          <Text className={styles.emptyText}>收藏的作品</Text>
        </View>
      );
    }

    return (
      <View className={styles.emptyState}>
        <Text className={styles.emptyIcon}>❤️</Text>
        <Text className={styles.emptyText}>喜欢的作品</Text>
      </View>
    );
  };

  return (
    <ScrollView scrollY className={styles.minePage} enhanced showScrollbar={false}>
      <View className={styles.header}>
        <View className={styles.headerActions}>
          <Button className={styles.headerAction} onClick={handleChallenge}>
            <Text>🏆</Text>
          </Button>
          <Button className={styles.headerAction} onClick={handleSetting}>
            <Text>⚙️</Text>
          </Button>
        </View>

        <View className={styles.userRow}>
          <Image
            className={styles.avatar}
            src={currentUser.avatar}
            mode="aspectFill"
            onError={(e) => console.error('[MinePage] avatar error:', e)}
          />
          <View className={styles.userInfo}>
            <View className={styles.userName}>
              <Text>{currentUser.nickname}</Text>
              {currentUser.isVerified && (
                <Text className={styles.verifiedBadge}>✓ {currentUser.verifiedInfo}</Text>
              )}
            </View>
            <Text className={styles.userBio}>{currentUser.bio}</Text>
          </View>
          <Button className={styles.editProfile} onClick={handleEditProfile}>
            <Text>编辑资料</Text>
          </Button>
        </View>

        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{formatNumber(currentUser.followingCount)}</Text>
            <Text className={styles.statLabel}>关注</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{formatNumber(currentUser.followersCount)}</Text>
            <Text className={styles.statLabel}>粉丝</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{formatNumber(currentUser.worksCount)}</Text>
            <Text className={styles.statLabel}>作品</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>15.6w</Text>
            <Text className={styles.statLabel}>获赞</Text>
          </View>
        </View>
      </View>

      <View className={styles.quickActions}>
        <View className={styles.quickAction} onClick={handleCreatorCenter}>
          <View className={styles.quickActionIcon}>
            <Text>📊</Text>
          </View>
          <Text className={styles.quickActionText}>创作者中心</Text>
        </View>
        <View className={styles.quickAction} onClick={handleDraft}>
          <View className={styles.quickActionIcon}>
            <Text>📝</Text>
          </View>
          <Text className={styles.quickActionText}>草稿箱</Text>
        </View>
        <View className={styles.quickAction} onClick={handleMyCollections}>
          <View className={styles.quickActionIcon}>
            <Text>⭐</Text>
          </View>
          <Text className={styles.quickActionText}>我的收藏</Text>
        </View>
        <View className={styles.quickAction} onClick={handleChallenge}>
          <View className={styles.quickActionIcon}>
            <Text>🏆</Text>
          </View>
          <Text className={styles.quickActionText}>话题挑战</Text>
        </View>
      </View>

      <View className={styles.creatorBanner} onClick={handleCreatorCenter}>
        <View className={styles.creatorInfo}>
          <Text className={styles.creatorTitle}>创作者中心</Text>
          <Text className={styles.creatorDesc}>查看数据、领取任务、管理作品</Text>
        </View>
        <View className={styles.creatorBtn}>
          <Text>去看看 →</Text>
        </View>
      </View>

      <View className={styles.tabs}>
        {tabs.map((tab) => (
          <View
            key={tab}
            className={classnames(styles.tab, activeTab === tab && styles.active)}
            onClick={() => handleTabClick(tab)}
          >
            <Text>{tab}</Text>
          </View>
        ))}
      </View>

      {renderContent()}
    </ScrollView>
  );
};

export default MinePage;
