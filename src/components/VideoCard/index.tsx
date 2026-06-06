import React, { useState } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { Video } from '@/types';

interface VideoCardProps {
  video: Video;
  showTopBar?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, showTopBar = true }) => {
  const [isLiked, setIsLiked] = useState(video.isLiked);
  const [isCollected, setIsCollected] = useState(video.isCollected);
  const [isFollowed, setIsFollowed] = useState(video.isFollowed);
  const [likesCount, setLikesCount] = useState(video.likesCount);
  const [collectCount, setCollectCount] = useState(video.collectCount);

  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'w';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    console.log('[VideoCard] like toggled:', !isLiked);
  };

  const handleCollect = () => {
    setIsCollected(!isCollected);
    setCollectCount(isCollected ? collectCount - 1 : collectCount + 1);
    console.log('[VideoCard] collect toggled:', !isCollected);
  };

  const handleFollow = () => {
    setIsFollowed(!isFollowed);
    console.log('[VideoCard] follow toggled:', !isFollowed);
  };

  const handleShopClick = () => {
    if (video.shop) {
      Taro.navigateTo({
        url: '/pages/shop-detail/index?id=' + video.shop.id,
      });
    }
  };

  const handleComment = () => {
    Taro.showToast({
      title: '评论功能开发中',
      icon: 'none',
    });
  };

  const handleShare = () => {
    Taro.showToast({
      title: '分享功能开发中',
      icon: 'none',
    });
  };

  const handleUserClick = () => {
    Taro.navigateTo({
      url: '/pages/user-profile/index?id=' + video.author.id,
    });
  };

  return (
    <View className={styles.videoCard}>
      {showTopBar && (
        <View className={styles.topBar}>
          <Button className={styles.cityBtn} onClick={() => Taro.showToast({ title: '城市选择', icon: 'none' })}>
            <Text>北京</Text>
            <Text>▼</Text>
          </Button>
          <View className={styles.searchBox} onClick={() => Taro.navigateTo({ url: '/pages/search/index' })}>
            <Text className={styles.searchIcon}>🔍</Text>
            <Text className={styles.searchText}>搜索店铺、视频、创作者</Text>
          </View>
        </View>
      )}

      <Image
        className={styles.coverImage}
        src={video.coverUrl}
        mode="aspectFill"
        onError={(e) => console.error('[VideoCard] image error:', e)}
      />

      <View className={styles.durationTag}>{formatDuration(video.duration)}</View>

      <View className={styles.sideActions}>
        <View className={styles.actionItem} onClick={handleUserClick}>
          <Image className={styles.authorAvatar} src={video.author.avatar} mode="aspectFill" />
        </View>

        <View className={styles.actionItem} onClick={handleLike}>
          <View className={classnames(styles.actionIcon, isLiked && styles.active)}>
            <Text>{isLiked ? '❤️' : '🤍'}</Text>
          </View>
          <Text className={styles.actionCount}>{formatNumber(likesCount)}</Text>
        </View>

        <View className={styles.actionItem} onClick={handleComment}>
          <View className={styles.actionIcon}>
            <Text>💬</Text>
          </View>
          <Text className={styles.actionCount}>{formatNumber(video.commentsCount)}</Text>
        </View>

        <View className={styles.actionItem} onClick={handleCollect}>
          <View className={classnames(styles.actionIcon, isCollected && styles.active)}>
            <Text>{isCollected ? '⭐' : '☆'}</Text>
          </View>
          <Text className={styles.actionCount}>{formatNumber(collectCount)}</Text>
        </View>

        <View className={styles.actionItem} onClick={handleShare}>
          <View className={styles.actionIcon}>
            <Text>↗️</Text>
          </View>
          <Text className={styles.actionCount}>{formatNumber(video.sharesCount)}</Text>
        </View>
      </View>

      {video.shop && (
        <View className={styles.shopCard} onClick={handleShopClick}>
          <Image className={styles.shopCover} src={video.shop.coverUrl} mode="aspectFill" />
          <View className={styles.shopInfo}>
            <Text className={styles.shopName}>{video.shop.name}</Text>
            <View className={styles.shopMeta}>
              <Text className={styles.shopRating}>★ {video.shop.rating}</Text>
              <Text>{video.shop.priceRange}</Text>
              <Text>{video.shop.distance}km</Text>
            </View>
          </View>
        </View>
      )}

      <View className={styles.videoInfo}>
        <View className={styles.authorRow}>
          <Image
            className={styles.authorAvatar}
            src={video.author.avatar}
            mode="aspectFill"
            onClick={handleUserClick}
          />
          <Text className={styles.authorName} onClick={handleUserClick}>@{video.author.nickname}</Text>
          {!isFollowed ? (
            <Button className={styles.followBtn} onClick={handleFollow}>
              关注
            </Button>
          ) : (
            <Button className={classnames(styles.followBtn, styles.followed)} onClick={handleFollow}>
              已关注
            </Button>
          )}
        </View>

        <Text className={styles.videoTitle}>{video.title}</Text>
        {video.description && (
          <Text className={styles.videoDesc}>{video.description}</Text>
        )}

        <View className={styles.tagsRow}>
          {video.tags.map((tag, index) => (
            <Text key={index} className={styles.tagItem}>#{tag}</Text>
          ))}
          {video.challenge && (
            <Text className={styles.tagItem}>{video.challenge.tag}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default VideoCard;
