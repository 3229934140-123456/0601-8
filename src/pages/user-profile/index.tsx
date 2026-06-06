import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockUsers, mockVideos } from '@/data/index';
import { User, Video } from '@/types';

const tabs = ['作品', '喜欢', '收藏'];

const UserProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userVideos, setUserVideos] = useState<Video[]>([]);
  const [activeTab, setActiveTab] = useState('作品');
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const userId = (currentPage as any)?.options?.id || 'u1';

    const foundUser = mockUsers.find(u => u.id === userId) || mockUsers[0];
    setUser(foundUser);
    setIsFollowed(foundUser.id === 'u2' || foundUser.id === 'u3');

    const userVideos = mockVideos.filter(v => v.author.id === userId);
    setUserVideos(userVideos.length > 0 ? userVideos : mockVideos.slice(0, 6));

    console.log('[UserProfilePage] userId:', userId);
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'w';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const handleBack = () => {
    Taro.navigateBack();
  };

  const handleFollow = () => {
    setIsFollowed(!isFollowed);
    console.log('[UserProfilePage] follow toggled:', !isFollowed);
    Taro.showToast({
      title: isFollowed ? '已取消关注' : '关注成功',
      icon: 'none',
    });
  };

  const handleMessage = () => {
    Taro.showToast({
      title: '私信功能开发中',
      icon: 'none',
    });
  };

  const handleVideoClick = (videoId: string) => {
    Taro.navigateTo({
      url: '/pages/video-detail/index?id=' + videoId,
    });
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  if (!user) {
    return (
      <View className={styles.userProfilePage}>
        <Text>加载中...</Text>
      </View>
    );
  }

  const renderContent = () => {
    if (activeTab === '作品') {
      if (userVideos.length === 0) {
        return (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🎬</Text>
            <Text className={styles.emptyText}>暂无作品</Text>
          </View>
        );
      }
      return (
        <View className={styles.contentGrid}>
          {userVideos.map((video) => (
            <View
              key={video.id}
              className={styles.gridItem}
              onClick={() => handleVideoClick(video.id)}
            >
              <Image
                className={styles.gridCover}
                src={video.coverUrl}
                mode="aspectFill"
                onError={(e) => console.error('[UserProfilePage] video cover error:', e)}
              />
              <View className={styles.gridInfo}>
                <Text className={styles.gridViews}>▶ {formatNumber(video.viewsCount)}</Text>
              </View>
            </View>
          ))}
        </View>
      );
    }

    if (activeTab === '喜欢') {
      return (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>❤️</Text>
          <Text className={styles.emptyText}>暂无喜欢的作品</Text>
        </View>
      );
    }

    return (
      <View className={styles.emptyState}>
        <Text className={styles.emptyIcon}>⭐</Text>
        <Text className={styles.emptyText}>暂无收藏的作品</Text>
      </View>
    );
  };

  return (
    <ScrollView scrollY className={styles.userProfilePage} enhanced showScrollbar={false}>
      <Button className={styles.backBtn} onClick={handleBack}>
        <Text>←</Text>
      </Button>

      <View className={styles.header}>
        <View className={styles.userRow}>
          <Image
            className={styles.avatar}
            src={user.avatar}
            mode="aspectFill"
            onError={(e) => console.error('[UserProfilePage] avatar error:', e)}
          />
          <View className={styles.userInfo}>
            <View className={styles.userName}>
              <Text>{user.nickname}</Text>
              {user.isVerified && (
                <Text className={styles.verifiedBadge}>✓ {user.verifiedInfo}</Text>
              )}
            </View>
            {user.bio && <Text className={styles.userBio}>{user.bio}</Text>}
            {user.location && (
              <Text className={styles.userLocation}>📍 {user.location}</Text>
            )}
          </View>
        </View>

        <View className={styles.actionRow}>
          <Button
            className={classnames(styles.actionBtn, styles.followBtn, isFollowed && styles.followed)}
            onClick={handleFollow}
          >
            <Text>{isFollowed ? '已关注' : '+ 关注'}</Text>
          </Button>
          <Button
            className={classnames(styles.actionBtn, styles.messageBtn)}
            onClick={handleMessage}
          >
            <Text>💬 私信</Text>
          </Button>
        </View>

        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{formatNumber(user.followingCount)}</Text>
            <Text className={styles.statLabel}>关注</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{formatNumber(user.followersCount)}</Text>
            <Text className={styles.statLabel}>粉丝</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{formatNumber(user.worksCount)}</Text>
            <Text className={styles.statLabel}>作品</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>15.6w</Text>
            <Text className={styles.statLabel}>获赞</Text>
          </View>
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

export default UserProfilePage;
