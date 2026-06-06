import React, { useState } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store';
import { Video, Shop } from '@/types';

const tabs = ['作品', '收藏', '喜欢', '最近'];

const MinePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('作品');
  const [showShops, setShowShops] = useState(false);
  const currentUser = useAppStore(state => state.currentUser);
  const videos = useAppStore(state => state.videos);
  const likedVideos = useAppStore(state => state.getLikedVideos());
  const collectedVideos = useAppStore(state => state.getCollectedVideos());
  const collectedShops = useAppStore(state => state.getCollectedShops());
  const recentViewed = useAppStore(state => state.getRecentViewedVideos());
  const drafts = useAppStore(state => state.drafts);

  const myVideos = videos.filter(v => v.author.id === currentUser.id);

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
    Taro.navigateTo({
      url: '/pages/draft-box/index',
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
    setActiveTab('收藏');
    setShowShops(false);
  };

  const handleShopCollections = () => {
    setShowShops(true);
    setActiveTab('收藏');
  };

  const handleRecentView = () => {
    setActiveTab('最近');
  };

  const handleShopClick = (shopId: string) => {
    Taro.navigateTo({
      url: '/pages/shop-detail/index?id=' + shopId,
    });
  };

  const renderVideoGrid = (videoList: Video[], emptyText: string) => {
    if (videoList.length === 0) {
      return (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>🎬</Text>
          <Text className={styles.emptyText}>{emptyText}</Text>
        </View>
      );
    }
    return (
      <View className={styles.contentGrid}>
        {videoList.map((video) => (
          <View
            key={video.id}
            className={styles.gridItem}
            onClick={() => handleVideoClick(video.id)}
          >
            <Image
              className={styles.gridCover}
              src={video.coverUrl}
              mode="aspectFill"
            />
            <View className={styles.gridInfo}>
              <Text className={styles.gridTag}>
                {video.challenges?.[0]?.tag ||
                  video.challenge?.tag ||
                  (video.tags?.[0] ? `#${video.tags[0]}` : '')}
              </Text>
              <Text className={styles.gridViews}>▶ {formatNumber(video.viewsCount)}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderShopGrid = (shopList: Shop[], emptyText: string) => {
    if (shopList.length === 0) {
      return (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>🏪</Text>
          <Text className={styles.emptyText}>{emptyText}</Text>
        </View>
      );
    }
    return (
      <View className={styles.shopList}>
        {shopList.map((shop) => (
          <View
            key={shop.id}
            className={styles.shopItem}
            onClick={() => handleShopClick(shop.id)}
          >
            <Image
              className={styles.shopCover}
              src={shop.coverUrl}
              mode="aspectFill"
            />
            <View className={styles.shopInfo}>
              <Text className={styles.shopName}>{shop.name}</Text>
              <View className={styles.shopMeta}>
                <Text className={styles.shopRating}>★ {shop.rating}</Text>
                <Text className={styles.shopPrice}>{shop.priceRange}</Text>
              </View>
              <Text className={styles.shopAddr}>📍 {shop.address}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderContent = () => {
    if (activeTab === '收藏' && showShops) {
      return renderShopGrid(collectedShops, '还没有收藏的门店');
    }
    if (activeTab === '作品') {
      return renderVideoGrid(myVideos, '还没有发布作品，快去拍摄吧~');
    }
    if (activeTab === '收藏') {
      return renderVideoGrid(collectedVideos, '还没有收藏的作品');
    }
    if (activeTab === '喜欢') {
      return renderVideoGrid(likedVideos, '还没有喜欢的作品');
    }
    if (activeTab === '最近') {
      return renderVideoGrid(recentViewed, '还没有浏览记录');
    }
    return null;
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
            <Text className={styles.statValue}>{myVideos.length}</Text>
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
          {drafts.length > 0 && (
            <View className={styles.draftBadge}>
              <Text>{drafts.length}</Text>
            </View>
          )}
        </View>
        <View className={styles.quickAction} onClick={handleMyCollections}>
          <View className={styles.quickActionIcon}>
            <Text>⭐</Text>
          </View>
          <Text className={styles.quickActionText}>我的收藏</Text>
        </View>
        <View className={styles.quickAction} onClick={handleShopCollections}>
          <View className={styles.quickActionIcon}>
            <Text>🏪</Text>
          </View>
          <Text className={styles.quickActionText}>门店收藏</Text>
        </View>
        <View className={styles.quickAction} onClick={handleRecentView}>
          <View className={styles.quickActionIcon}>
            <Text>👁️</Text>
          </View>
          <Text className={styles.quickActionText}>最近浏览</Text>
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
