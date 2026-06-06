import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockChallenges } from '@/data/index';
import { Challenge } from '@/types';

const ChallengePage: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);
  const [searchKeyword, setSearchKeyword] = useState('');

  const hotChallenge = challenges.find(c => c.isHot);
  const otherChallenges = challenges.filter(c => !c.isHot);

  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'w';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const handleJoin = (e, challenge: Challenge) => {
    e.stopPropagation();
    const updated = challenges.map(c =>
      c.id === challenge.id ? { ...c, isJoined: !c.isJoined } : c
    );
    setChallenges(updated);
    console.log('[ChallengePage] join toggled:', challenge.id, !challenge.isJoined);
    Taro.showToast({
      title: challenge.isJoined ? '已取消参与' : '参与成功',
      icon: 'none',
    });
  };

  const handleChallengeClick = (challenge: Challenge) => {
    console.log('[ChallengePage] challenge clicked:', challenge.id);
    Taro.showToast({
      title: `进入${challenge.title}`,
      icon: 'none',
    });
  };

  return (
    <ScrollView scrollY className={styles.challengePage} enhanced showScrollbar={false}>
      <View className={styles.header}>
        <Text className={styles.title}>话题挑战</Text>
        <Text className={styles.subtitle}>参与挑战，赢取奖励</Text>

        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索挑战话题"
            placeholderClass="input-placeholder"
            value={searchKeyword}
            onInput={(e) => setSearchKeyword(e.detail.value)}
          />
        </View>
      </View>

      {hotChallenge && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>🔥 热门挑战</Text>

          <View
            className={styles.hotChallenge}
            onClick={() => handleChallengeClick(hotChallenge)}
          >
            <Image
              className={styles.hotCover}
              src={hotChallenge.coverUrl}
              mode="aspectFill"
              onError={(e) => console.error('[ChallengePage] hot cover error:', e)}
            />
            <View className={styles.hotTag}>
              <Text>热门</Text>
            </View>
            <View className={styles.hotOverlay}>
              <Text className={styles.hotTitle}>{hotChallenge.title}</Text>
              <View className={styles.hotMeta}>
                <Text>{formatNumber(hotChallenge.participantsCount)}人参与</Text>
                <Text>{formatNumber(hotChallenge.viewsCount)}次播放</Text>
                {hotChallenge.reward && (
                  <Text className={styles.rewardBadge}>🏆 {hotChallenge.reward}</Text>
                )}
              </View>
            </View>
          </View>
        </View>
      )}

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          更多挑战
          <Text className={styles.moreLink}>查看全部 ›</Text>
        </Text>

        <View className={styles.challengeList}>
          {otherChallenges.map((challenge) => (
            <View
              key={challenge.id}
              className={styles.challengeCard}
              onClick={() => handleChallengeClick(challenge)}
            >
              <Image
                className={styles.challengeCover}
                src={challenge.coverUrl}
                mode="aspectFill"
                onError={(e) => console.error('[ChallengePage] cover error:', e)}
              />
              <View className={styles.challengeContent}>
                <View>
                  <Text className={styles.challengeName}>{challenge.title}</Text>
                  <Text className={styles.challengeDesc}>{challenge.description}</Text>
                </View>
                <View className={styles.challengeFooter}>
                  <View className={styles.challengeStats}>
                    <Text>{formatNumber(challenge.participantsCount)}人参与</Text>
                    {challenge.reward && (
                      <Text className={styles.rewardBadge}>🏆 {challenge.reward}</Text>
                    )}
                  </View>
                  <View
                    className={classnames(styles.joinBtn, challenge.isJoined && styles.joined)}
                    onClick={(e) => handleJoin(e, challenge)}
                  >
                    <Text>{challenge.isJoined ? '已参与' : '参与'}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default ChallengePage;
