import React, { useState } from 'react';
import { View, Text, Image, Input, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockVideos, mockShops, mockUsers } from '@/data/index';
import { Video, Shop, User } from '@/types';

const searchTabs = ['综合', '视频', '用户', '店铺'];

const hotSearches = [
  { rank: 1, text: '老北京铜锅涮肉', isHot: true },
  { rank: 2, text: '周末好去处', isHot: true },
  { rank: 3, text: '星巴克臻选烘焙工坊', isNew: true },
  { rank: 4, text: '深夜食堂', isHot: false },
  { rank: 5, text: '胡同创意菜', isHot: false },
  { rank: 6, text: '咖啡探店日记', isNew: true },
  { rank: 7, text: '人均50吃到撑', isHot: false },
  { rank: 8, text: '约会餐厅推荐', isHot: false },
];

const historySearches = ['火锅', '咖啡店', '甜品店', '日料', '性价比餐厅'];

const SearchPage: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [activeTab, setActiveTab] = useState('综合');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(historySearches);
  const [searchResults, setSearchResults] = useState<{
    videos: Video[];
    shops: Shop[];
    users: User[];
  }>({
    videos: [],
    shops: [],
    users: [],
  });

  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'w';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const handleSearch = () => {
    if (!keyword.trim()) return;

    setHasSearched(true);
    if (!searchHistory.includes(keyword)) {
      setSearchHistory([keyword, ...searchHistory].slice(0, 10));
    }

    const videos = mockVideos.filter(
      v => v.title.includes(keyword) || v.tags.some(t => t.includes(keyword))
    );
    const shops = mockShops.filter(
      s => s.name.includes(keyword) || s.category.includes(keyword) || s.tags.some(t => t.includes(keyword))
    );
    const users = mockUsers.filter(
      u => u.nickname.includes(keyword) || (u.bio && u.bio.includes(keyword))
    );

    setSearchResults({ videos, shops, users });
    console.log('[SearchPage] search keyword:', keyword, 'results:', videos.length + shops.length + users.length);
  };

  const handleHotClick = (text: string) => {
    setKeyword(text);
    setHasSearched(true);
    const videos = mockVideos.filter(
      v => v.title.includes(text) || v.tags.some(t => t.includes(text))
    );
    setSearchResults(prev => ({ ...prev, videos }));
  };

  const handleHistoryClick = (text: string) => {
    setKeyword(text);
    handleSearch();
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
  };

  const handleClearKeyword = () => {
    setKeyword('');
    setHasSearched(false);
  };

  const handleCancel = () => {
    Taro.navigateBack();
  };

  const handleVideoClick = (videoId: string) => {
    Taro.navigateTo({
      url: '/pages/video-detail/index?id=' + videoId,
    });
  };

  const handleShopClick = (shopId: string) => {
    Taro.navigateTo({
      url: '/pages/shop-detail/index?id=' + shopId,
    });
  };

  const handleUserClick = (userId: string) => {
    Taro.navigateTo({
      url: '/pages/user-profile/index?id=' + userId,
    });
  };

  const renderSearchContent = () => {
    if (!hasSearched) {
      return (
        <View className={styles.content}>
          {searchHistory.length > 0 && (
            <>
              <View className={styles.sectionTitle}>
                <Text>搜索历史</Text>
                <Text className={styles.clearHistory} onClick={handleClearHistory}>清空</Text>
              </View>
              <View className={styles.historyTags}>
                {searchHistory.map((item, index) => (
                  <Text
                    key={index}
                    className={styles.historyTag}
                    onClick={() => handleHistoryClick(item)}
                  >
                    {item}
                  </Text>
                ))}
              </View>
            </>
          )}

          <View className={styles.hotSearch}>
            <Text className={styles.sectionTitle}>🔥 热门搜索</Text>
            <View className={styles.hotList}>
              {hotSearches.map((item) => (
                <View
                  key={item.rank}
                  className={styles.hotItem}
                  onClick={() => handleHotClick(item.text)}
                >
                  <Text
                    className={classnames(
                      styles.hotRank,
                      item.rank <= 3 && `top${item.rank}`
                    )}
                  >
                    {item.rank}
                  </Text>
                  <Text className={styles.hotText}>{item.text}</Text>
                  {item.isHot && <Text className={styles.hotTag}>热</Text>}
                  {item.isNew && (
                    <Text className={styles.hotTag} style={{ background: 'rgba(0, 180, 42, 0.1)', color: '#00B42A' }}>新</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
      );
    }

    if (activeTab === '综合' || activeTab === '视频') {
      if (searchResults.videos.length === 0) {
        return (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🔍</Text>
            <Text className={styles.emptyText}>未找到相关视频</Text>
          </View>
        );
      }
      return (
        <View className={styles.searchResults}>
          {searchResults.videos.map((video) => (
            <View
              key={video.id}
              className={styles.resultItem}
              onClick={() => handleVideoClick(video.id)}
            >
              <Image
                className={styles.resultCover}
                src={video.coverUrl}
                mode="aspectFill"
                onError={(e) => console.error('[SearchPage] video cover error:', e)}
              />
              <View className={styles.resultContent}>
                <Text className={styles.resultTitle}>{video.title}</Text>
                <View className={styles.resultMeta}>
                  <Image
                    className={styles.resultAuthor}
                    src={video.author.avatar}
                    mode="aspectFill"
                  />
                  <Text className={styles.resultAuthorName}>{video.author.nickname}</Text>
                  <Text className={styles.resultStats}>
                    ▶ {formatNumber(video.viewsCount)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      );
    }

    if (activeTab === '店铺') {
      if (searchResults.shops.length === 0) {
        return (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🏪</Text>
            <Text className={styles.emptyText}>未找到相关店铺</Text>
          </View>
        );
      }
      return (
        <View className={styles.searchResults}>
          {searchResults.shops.map((shop) => (
            <View
              key={shop.id}
              className={styles.resultItem}
              onClick={() => handleShopClick(shop.id)}
            >
              <Image
                className={styles.resultCover}
                src={shop.coverUrl}
                mode="aspectFill"
                onError={(e) => console.error('[SearchPage] shop cover error:', e)}
              />
              <View className={styles.resultContent}>
                <Text className={styles.resultTitle}>{shop.name}</Text>
                <View className={styles.resultMeta}>
                  <Text className={styles.resultAuthorName}>
                    ★ {shop.rating} · {shop.category}
                  </Text>
                  <Text className={styles.resultStats}>{shop.distance}km</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      );
    }

    if (activeTab === '用户') {
      if (searchResults.users.length === 0) {
        return (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>👤</Text>
            <Text className={styles.emptyText}>未找到相关用户</Text>
          </View>
        );
      }
      return (
        <View className={styles.searchResults}>
          {searchResults.users.map((user) => (
            <View
              key={user.id}
              className={styles.resultItem}
              onClick={() => handleUserClick(user.id)}
            >
              <Image
                className={styles.resultCover}
                style={{ width: '120rpx', height: '120rpx', borderRadius: '50%' }}
                src={user.avatar}
                mode="aspectFill"
                onError={(e) => console.error('[SearchPage] user avatar error:', e)}
              />
              <View className={styles.resultContent}>
                <Text className={styles.resultTitle}>{user.nickname}</Text>
                <Text className={styles.resultAuthorName}>{user.bio}</Text>
                <View className={styles.resultMeta}>
                  <Text className={styles.resultStats}>
                    {formatNumber(user.followersCount)}粉丝
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      );
    }

    return null;
  };

  return (
    <View className={styles.searchPage}>
      <View className={styles.header}>
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索视频、店铺、创作者"
            placeholderClass="input-placeholder"
            value={keyword}
            onInput={(e) => setKeyword(e.detail.value)}
            onConfirm={handleSearch}
            focus
          />
          {keyword && (
            <Button className={styles.clearBtn} onClick={handleClearKeyword}>
              <Text>×</Text>
            </Button>
          )}
        </View>
        <Button className={styles.cancelBtn} onClick={handleCancel}>
          取消
        </Button>
      </View>

      {hasSearched && (
        <View className={styles.tabs}>
          {searchTabs.map((tab) => (
            <View
              key={tab}
              className={classnames(styles.tab, activeTab === tab && styles.active)}
              onClick={() => setActiveTab(tab)}
            >
              <Text>{tab}</Text>
            </View>
          ))}
        </View>
      )}

      <ScrollView scrollY enhanced showScrollbar={false}>
        {renderSearchContent()}
      </ScrollView>
    </View>
  );
};

export default SearchPage;
