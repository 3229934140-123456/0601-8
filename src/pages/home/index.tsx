import React, { useState } from 'react';
import { View, Text, Swiper, SwiperItem } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import VideoCard from '@/components/VideoCard';
import { mockChallenges } from '@/data/index';
import { useAppStore } from '@/store';

const HomePage: React.FC = () => {
  const videos = useAppStore(state => state.videos);
  const [currentIndex, setCurrentIndex] = useState(0);
  const hotChallenge = mockChallenges.find(c => c.isHot);
  const [showChallenge, setShowChallenge] = useState(true);

  const handleSwiperChange = (e) => {
    const index = e.detail.current;
    setCurrentIndex(index);
    setShowChallenge(index === 0);
    console.log('[HomePage] swiper changed to index:', index, 'videos count:', videos.length);
  };

  const handleChallengeClick = () => {
    Taro.navigateTo({
      url: '/pages/challenge/index',
    });
  };

  const handleReachBottom = () => {
    console.log('[HomePage] reach bottom, loading more...');
    Taro.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 500,
    });
  };

  return (
    <View className={styles.homePage}>
      {showChallenge && hotChallenge && (
        <View className={styles.challengeBanner} onClick={handleChallengeClick}>
          <View className={styles.challengeIcon}>
            <Text>🏆</Text>
          </View>
          <View className={styles.challengeInfo}>
            <Text className={styles.challengeTitle}>{hotChallenge.title}</Text>
            <Text className={styles.challengeDesc}>
              {hotChallenge.participantsCount.toLocaleString()}人参与 · 赢{hotChallenge.reward}
            </Text>
          </View>
          <View className={styles.challengeJoin}>
            <Text>参与</Text>
          </View>
        </View>
      )}

      <Swiper
        className={styles.swiper}
        vertical
        circular
        current={currentIndex}
        onChange={handleSwiperChange}
        onAnimationFinish={handleReachBottom}
        indicatorDots={false}
        duration={300}
      >
        {videos.map((video, index) => (
          <SwiperItem key={video.id} className={styles.swiperItem}>
            <VideoCard video={video} showTopBar={index === currentIndex} isActive={index === currentIndex} />
          </SwiperItem>
        ))}
      </Swiper>
    </View>
  );
};

export default HomePage;
