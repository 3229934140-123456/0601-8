import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, Button, Video as VideoComp } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { Video } from '@/types';
import { useAppStore } from '@/store';

interface VideoCardProps {
  video: Video;
  showTopBar?: boolean;
  isActive?: boolean;
  onPlayStateChange?: (playing: boolean) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  showTopBar = true,
  isActive = false,
  onPlayStateChange,
}) => {
  const likeVideo = useAppStore(state => state.likeVideo);
  const collectVideo = useAppStore(state => state.collectVideo);
  const videos = useAppStore(state => state.videos);

  const currentVideo = videos.find(v => v.id === video.id) || video;

  const [isFollowed, setIsFollowed] = useState(video.isFollowed);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayBtn, setShowPlayBtn] = useState(true);
  const videoRef = useRef<any>(null);

  useEffect(() => {
    if (isActive && isPlaying && videoRef.current) {
      videoRef.current.play?.();
    }
    if (!isActive && isPlaying && videoRef.current) {
      videoRef.current.pause?.();
      setIsPlaying(false);
    }
  }, [isActive]);

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

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause?.();
        setIsPlaying(false);
        setShowPlayBtn(true);
        onPlayStateChange?.(false);
      } else {
        videoRef.current.play?.();
        setIsPlaying(true);
        setShowPlayBtn(false);
        onPlayStateChange?.(true);
      }
    }
    console.log('[VideoCard] toggle play:', !isPlaying);
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
    setShowPlayBtn(false);
    onPlayStateChange?.(true);
    console.log('[VideoCard] video play event');
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
    setShowPlayBtn(true);
    onPlayStateChange?.(false);
    console.log('[VideoCard] video pause event');
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setShowPlayBtn(true);
    onPlayStateChange?.(false);
    console.log('[VideoCard] video ended event');
  };

  const handleLike = () => {
    likeVideo(currentVideo.id);
    console.log('[VideoCard] like toggled:', !currentVideo.isLiked);
  };

  const handleCollect = () => {
    collectVideo(currentVideo.id);
    console.log('[VideoCard] collect toggled:', !currentVideo.isCollected);
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
    Taro.navigateTo({
      url: '/pages/video-detail/index?id=' + video.id,
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

  const handleVideoError = (e) => {
    console.error('[VideoCard] video error:', e);
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

      <View className={styles.videoWrapper} onClick={togglePlay}>
        <VideoComp
          ref={videoRef}
          className={styles.videoPlayer}
          src={video.videoUrl}
          poster={video.coverUrl}
          controls={false}
          autoplay={false}
          loop={false}
          showCenterPlayBtn={false}
          showFullscreenBtn={false}
          showPlayBtn={false}
          showProgress={false}
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          onEnded={handleVideoEnded}
          onError={handleVideoError}
        />

        {showPlayBtn && (
          <View className={styles.playBtnOverlay}>
            <View className={styles.playBtn}>
              <Text>▶</Text>
            </View>
          </View>
        )}
      </View>

      <View className={styles.durationTag}>{formatDuration(video.duration)}</View>

      <View className={styles.sideActions}>
        <View className={styles.actionItem} onClick={handleUserClick}>
          <Image className={styles.authorAvatar} src={video.author.avatar} mode="aspectFill" />
        </View>

        <View className={styles.actionItem} onClick={handleLike}>
          <View className={classnames(styles.actionIcon, currentVideo.isLiked && styles.active)}>
            <Text>{currentVideo.isLiked ? '❤️' : '🤍'}</Text>
          </View>
          <Text className={styles.actionCount}>{formatNumber(currentVideo.likesCount)}</Text>
        </View>

        <View className={styles.actionItem} onClick={handleComment}>
          <View className={styles.actionIcon}>
            <Text>💬</Text>
          </View>
          <Text className={styles.actionCount}>{formatNumber(currentVideo.commentsCount)}</Text>
        </View>

        <View className={styles.actionItem} onClick={handleCollect}>
          <View className={classnames(styles.actionIcon, currentVideo.isCollected && styles.active)}>
            <Text>{currentVideo.isCollected ? '⭐' : '☆'}</Text>
          </View>
          <Text className={styles.actionCount}>{formatNumber(currentVideo.collectCount)}</Text>
        </View>

        <View className={styles.actionItem} onClick={handleShare}>
          <View className={styles.actionIcon}>
            <Text>↗️</Text>
          </View>
          <Text className={styles.actionCount}>{formatNumber(currentVideo.sharesCount)}</Text>
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
