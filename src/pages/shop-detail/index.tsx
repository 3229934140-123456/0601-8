import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockShops, mockVideos } from '@/data/index';
import { Shop, Video } from '@/types';

const ShopDetailPage: React.FC = () => {
  const [shop, setShop] = useState<Shop | null>(null);
  const [shopVideos, setShopVideos] = useState<Video[]>([]);
  const [isCollected, setIsCollected] = useState(false);

  useEffect(() => {
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const shopId = (currentPage as any)?.options?.id || 's1';

    const foundShop = mockShops.find(s => s.id === shopId) || mockShops[0];
    setShop(foundShop);
    setIsCollected(foundShop.isCollected || false);

    const relatedVideos = mockVideos.filter(v => v.shop?.id === shopId || v.shop?.id === 's1');
    setShopVideos(relatedVideos.length > 0 ? relatedVideos : mockVideos.slice(0, 6));

    console.log('[ShopDetailPage] shopId:', shopId);
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

  const handleCollect = () => {
    setIsCollected(!isCollected);
    console.log('[ShopDetailPage] collect toggled:', !isCollected);
    Taro.showToast({
      title: isCollected ? '已取消收藏' : '收藏成功',
      icon: 'none',
    });
  };

  const handleNavigate = () => {
    Taro.showToast({
      title: '导航功能开发中',
      icon: 'none',
    });
  };

  const handleVideoClick = (videoId: string) => {
    Taro.navigateTo({
      url: '/pages/video-detail/index?id=' + videoId,
    });
  };

  const handleShootHere = () => {
    Taro.switchTab({
      url: '/pages/shoot/index',
    });
  };

  const handleReport = () => {
    Taro.showActionSheet({
      itemList: ['举报不实信息', '投诉商家'],
      success: (res) => {
        Taro.showToast({
          title: '已提交举报',
          icon: 'none',
        });
        console.log('[ShopDetailPage] report type:', res.tapIndex);
      },
    });
  };

  if (!shop) {
    return (
      <View className={styles.shopDetailPage}>
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <ScrollView scrollY className={styles.shopDetailPage} enhanced showScrollbar={false}>
      <View className={styles.shopHeader}>
        <Image
          className={styles.shopCover}
          src={shop.coverUrl}
          mode="aspectFill"
          onError={(e) => console.error('[ShopDetailPage] cover error:', e)}
        />
        <Button className={styles.backBtn} onClick={handleBack}>
          <Text>←</Text>
        </Button>
        <Button
          className={classnames(styles.collectBtn, isCollected && styles.active)}
          onClick={handleCollect}
        >
          <Text>{isCollected ? '⭐' : '☆'}</Text>
        </Button>
      </View>

      <View className={styles.shopInfo}>
        <Text className={styles.shopName}>{shop.name}</Text>
        <View className={styles.shopMeta}>
          <Text className={styles.rating}>★ {shop.rating}</Text>
          <Text className={styles.priceRange}>{shop.priceRange}</Text>
          <Text className={styles.category}>· {shop.category}</Text>
          <Text className={styles.distance}>{shop.distance}km</Text>
        </View>
        <View className={styles.shopTags}>
          {shop.tags.map((tag, index) => (
            <Text key={index} className={styles.tag}>{tag}</Text>
          ))}
        </View>
        <View className={styles.shopAddress}>
          <Text className={styles.addressIcon}>📍</Text>
          <View className={styles.addressInfo}>
            <Text className={styles.addressText}>{shop.address}</Text>
            <Text className={styles.businessHours}>营业时间：{shop.businessHours}</Text>
            {shop.phone && (
              <Text className={styles.businessHours}>电话：{shop.phone}</Text>
            )}
          </View>
          <Button className={styles.navigateBtn} onClick={handleNavigate}>
            导航
          </Button>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionTitle}>
          <Text>探店视频</Text>
          <Text className={styles.moreLink}>{shop.videosCount}个视频 ›</Text>
        </View>
        <View className={styles.videoList}>
          {shopVideos.map((video) => (
            <View
              key={video.id}
              className={styles.videoItem}
              onClick={() => handleVideoClick(video.id)}
            >
              <Image
                className={styles.videoCover}
                src={video.coverUrl}
                mode="aspectFill"
                onError={(e) => console.error('[ShopDetailPage] video cover error:', e)}
              />
              <View className={styles.videoInfo}>
                <Text className={styles.videoViews}>▶ {formatNumber(video.viewsCount)}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionTitle}>
          <Text>店铺简介</Text>
        </View>
        <View style={{
          padding: '24rpx',
          background: '#fff',
          borderRadius: '16rpx',
          boxShadow: '0 2rpx 12rpx rgba(0,0,0,0.08)',
        }}>
          <Text style={{ fontSize: '28rpx', color: '#4E5969', lineHeight: 1.6 }}>
            {shop.description}
          </Text>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <Button className={classnames(styles.actionBtn, styles.secondaryBtn)} onClick={handleReport}>
          <Text>🚩</Text>
          <Text>举报</Text>
        </Button>
        <Button className={classnames(styles.actionBtn, styles.primaryBtn)} onClick={handleShootHere}>
          <Text>📹</Text>
          <Text>来这拍视频</Text>
        </Button>
      </View>
    </ScrollView>
  );
};

export default ShopDetailPage;
