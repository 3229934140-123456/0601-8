import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockVideos, mockComments } from '@/data/index';
import { Video, Comment } from '@/types';

const VideoDetailPage: React.FC = () => {
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isCollected, setIsCollected] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [collectCount, setCollectCount] = useState(0);

  useEffect(() => {
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const videoId = (currentPage as any)?.options?.id || 'v1';

    const foundVideo = mockVideos.find(v => v.id === videoId) || mockVideos[0];
    setVideo(foundVideo);
    setIsLiked(foundVideo.isLiked || false);
    setIsCollected(foundVideo.isCollected || false);
    setIsFollowed(foundVideo.isFollowed || false);
    setLikesCount(foundVideo.likesCount);
    setCollectCount(foundVideo.collectCount);

    setComments(mockComments);

    console.log('[VideoDetailPage] videoId:', videoId);
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

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    console.log('[VideoDetailPage] like toggled:', !isLiked);
  };

  const handleCollect = () => {
    setIsCollected(!isCollected);
    setCollectCount(isCollected ? collectCount - 1 : collectCount + 1);
    console.log('[VideoDetailPage] collect toggled:', !isCollected);
    Taro.showToast({
      title: isCollected ? '已取消收藏' : '收藏成功',
      icon: 'none',
    });
  };

  const handleFollow = () => {
    setIsFollowed(!isFollowed);
    console.log('[VideoDetailPage] follow toggled:', !isFollowed);
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
    if (!commentText.trim()) {
      Taro.showToast({
        title: '请输入评论内容',
        icon: 'none',
      });
      return;
    }
    Taro.showToast({
      title: '评论成功',
      icon: 'success',
    });
    setCommentText('');
    console.log('[VideoDetailPage] comment sent:', commentText);
  };

  const handleCommentLike = (commentId: string) => {
    const updated = comments.map(c =>
      c.id === commentId ? { ...c, isLiked: !c.isLiked, likesCount: c.isLiked ? c.likesCount - 1 : c.likesCount + 1 } : c
    );
    setComments(updated);
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
        <Image
          className={styles.coverImage}
          src={video.coverUrl}
          mode="aspectFill"
          onError={(e) => console.error('[VideoDetailPage] cover error:', e)}
        />

        <Button className={styles.backBtn} onClick={handleBack}>
          <Text>←</Text>
        </Button>
        <Button className={styles.shareBtn} onClick={handleShare}>
          <Text>↗️</Text>
        </Button>

        <View className={styles.sideActions}>
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
