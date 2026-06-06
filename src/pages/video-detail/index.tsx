import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, Image, Button, Input, ScrollView, Video as VideoComp } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { Video, Comment } from '@/types';
import { useAppStore } from '@/store';

const VideoDetailPage: React.FC = () => {
  const videos = useAppStore(state => state.videos);
  const videoComments = useAppStore(state => state.videoComments);
  const likeVideo = useAppStore(state => state.likeVideo);
  const collectVideo = useAppStore(state => state.collectVideo);
  const addComment = useAppStore(state => state.addComment);
  const likeComment = useAppStore(state => state.likeComment);
  const unlikeComment = useAppStore(state => state.unlikeComment);
  const addRecentView = useAppStore(state => state.addRecentView);
  const currentUser = useAppStore(state => state.currentUser);

  const [video, setVideo] = useState<Video | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isFollowed, setIsFollowed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayBtn, setShowPlayBtn] = useState(true);
  const videoRef = useRef<any>(null);

  const comments = useMemo(() => {
    if (video) {
      return videoComments[video.id] || [];
    }
    return [];
  }, [video?.id, videoComments]);

  const challengeTags = useMemo(() => {
    if (!video) return [];
    if (video.challenges?.length) {
      return video.challenges.map(c => c.tag);
    }
    if (video.challenge) {
      return [video.challenge.tag];
    }
    return [];
  }, [video]);

  useEffect(() => {
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const videoId = (currentPage as any)?.options?.id || 'v1';

    const foundVideo = videos.find(v => v.id === videoId) || videos[0];
    setVideo(foundVideo);
    setIsFollowed(foundVideo.isFollowed || false);

    if (foundVideo) {
      addRecentView(foundVideo.id);
    }

    console.log('[VideoDetailPage] videoId:', videoId);
  }, [videos, addRecentView]);

  useEffect(() => {
    if (video && videoRef.current) {
      videoRef.current.play?.();
    }
  }, [video?.id]);

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
    if (videoRef.current) {
      videoRef.current.pause?.();
    }
    Taro.navigateBack();
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
    setShowPlayBtn(false);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
    setShowPlayBtn(true);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause?.();
      } else {
        videoRef.current.play?.();
      }
    }
  };

  const handleLike = () => {
    if (video) {
      likeVideo(video.id);
      const updated = useAppStore.getState().videos.find(v => v.id === video.id);
      if (updated) setVideo(updated);
    }
  };

  const handleCollect = () => {
    if (video) {
      collectVideo(video.id);
      const updated = useAppStore.getState().videos.find(v => v.id === video.id);
      if (updated) setVideo(updated);
      Taro.showToast({
        title: video.isCollected ? '已取消收藏' : '收藏成功',
        icon: 'none',
      });
    }
  };

  const handleFollow = () => {
    setIsFollowed(!isFollowed);
  };

  const handleComment = () => {
    setShowComments(true);
  };

  const handleShare = () => {
    Taro.showToast({
      title: '分享功能开发中',
      icon: 'none',
    });
  };

  const handleShopClick = () => {
    if (video?.shop) {
      Taro.navigateTo({
        url: '/pages/shop-detail/index?id=' + video.shop.id,
      });
    }
  };

  const handleUserClick = () => {
    if (video?.author) {
      Taro.navigateTo({
        url: '/pages/user-profile/index?id=' + video.author.id,
      });
    }
  };

  const handleSendComment = () => {
    if (!commentText.trim() || !video) {
      Taro.showToast({
        title: '请输入评论内容',
        icon: 'none',
      });
      return;
    }

    const newComment: Comment = {
      id: 'cmt_' + Date.now(),
      user: currentUser,
      content: commentText.trim(),
      likesCount: 0,
      createdAt: '刚刚',
      isLiked: false,
    };

    addComment(video.id, newComment);

    const updatedVideo = useAppStore.getState().videos.find(v => v.id === video.id);
    if (updatedVideo) {
      setVideo(updatedVideo);
    }

    setCommentText('');
    Taro.showToast({
      title: '评论成功',
      icon: 'success',
    });
    console.log('[VideoDetailPage] comment sent:', newComment.id);
  };

  const handleCommentLike = (commentId: string) => {
    if (!video) return;
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;

    if (comment.isLiked) {
      unlikeComment(video.id, commentId);
    } else {
      likeComment(video.id, commentId);
    }
  };

  if (!video) {
    return (
      <View className={styles.videoDetailPage}>
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <View className={styles.videoDetailPage}>
      <View className={styles.videoContainer}>
        <View className={styles.videoWrapper} onClick={togglePlay}>
          <VideoComp
            ref={videoRef}
            className={styles.videoPlayer}
            src={video.videoUrl}
            poster={video.coverUrl}
            controls={false}
            autoplay
            loop
            showCenterPlayBtn={false}
            showFullscreenBtn={false}
            showPlayBtn={false}
            showProgress={false}
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
            onEnded={handleVideoPause}
          />
          {showPlayBtn && (
            <View className={styles.playBtnOverlay}>
              <View className={styles.playBtn}>
                <Text>▶</Text>
              </View>
            </View>
          )}
        </View>

        <Button className={styles.backBtn} onClick={handleBack}>
          <Text>←</Text>
        </Button>
        <Button className={styles.shareBtn} onClick={handleShare}>
          <Text>↗️</Text>
        </Button>

        <View className={styles.sideActions}>
          <View className={styles.actionItem} onClick={handleLike}>
            <View className={classnames(styles.actionIcon, video.isLiked && styles.active)}>
              <Text>{video.isLiked ? '❤️' : '🤍'}</Text>
            </View>
            <Text className={styles.actionCount}>{formatNumber(video.likesCount)}</Text>
          </View>

          <View className={styles.actionItem} onClick={handleComment}>
            <View className={styles.actionIcon}>
              <Text>💬</Text>
            </View>
            <Text className={styles.actionCount}>{formatNumber(video.commentsCount)}</Text>
          </View>

          <View className={styles.actionItem} onClick={handleCollect}>
            <View className={classnames(styles.actionIcon, video.isCollected && styles.active)}>
              <Text>{video.isCollected ? '⭐' : '☆'}</Text>
            </View>
            <Text className={styles.actionCount}>{formatNumber(video.collectCount)}</Text>
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
            <Text className={styles.authorName} onClick={handleUserClick}>
              @{video.author.nickname}
            </Text>
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
            {challengeTags.slice(0, 3).map((tag, index) => (
              <Text key={index} className={styles.tagItem}>{tag}</Text>
            ))}
            {video.tags && video.tags.slice(0, 2).map((tag, index) => (
              <Text key={`tag_${index}`} className={styles.tagItem}>#{tag}</Text>
            ))}
          </View>
        </View>
      </View>

      {showComments && (
        <View className={styles.commentsPanel}>
          <View className={styles.panelHeader}>
            <Text>评论 {formatNumber(video.commentsCount)}</Text>
            <Text className={styles.closePanel} onClick={() => setShowComments(false)}>✕</Text>
          </View>

          <ScrollView scrollY className={styles.commentList} enhanced showScrollbar={false}>
            {comments.map((comment) => (
              <View key={comment.id} className={styles.commentItem}>
                <Image
                  className={styles.commentAvatar}
                  src={comment.user.avatar}
                  mode="aspectFill"
                />
                <View className={styles.commentContent}>
                  <Text className={styles.commentUser}>{comment.user.nickname}</Text>
                  <Text className={styles.commentText}>{comment.content}</Text>
                  <View className={styles.commentFooter}>
                    <Text className={styles.commentTime}>{comment.createdAt}</Text>
                    <View
                      className={classnames(styles.commentLike, comment.isLiked && styles.active)}
                      onClick={() => handleCommentLike(comment.id)}
                    >
                      <Text>{comment.isLiked ? '❤️' : '🤍'}</Text>
                      <Text>{comment.likesCount}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View className={styles.commentInput}>
            <Input
              className={styles.commentInputField}
              placeholder="说点什么..."
              placeholderClass="input-placeholder"
              value={commentText}
              onInput={(e) => setCommentText(e.detail.value)}
              onConfirm={handleSendComment}
            />
            <Button className={styles.sendBtn} onClick={handleSendComment}>
              发送
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

export default VideoDetailPage;
