import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import ShopCard from '@/components/ShopCard';
import { mockShops } from '@/data/index';
import { Shop } from '@/types';

const categories = ['全部', '美食', '咖啡', '甜品', '日料', '火锅', '酒吧', '创意菜'];
const distanceOptions = ['1km内', '3km内', '5km内', '全城'];

const CityPage: React.FC = () => {
  const [shops] = useState<Shop[]>(mockShops);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [activeDistance, setActiveDistance] = useState('3km内');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);

  const filteredShops = useMemo(() => {
    let result = [...shops];

    if (activeCategory !== '全部') {
      result = result.filter(shop => shop.category === activeCategory);
    }

    if (activeDistance === '1km内') {
      result = result.filter(shop => shop.distance <= 1);
    } else if (activeDistance === '3km内') {
      result = result.filter(shop => shop.distance <= 3);
    } else if (activeDistance === '5km内') {
      result = result.filter(shop => shop.distance <= 5);
    }

    if (searchKeyword) {
      result = result.filter(shop =>
        shop.name.includes(searchKeyword) || shop.address.includes(searchKeyword)
      );
    }

    return result.sort((a, b) => a.distance - b.distance);
  }, [shops, activeCategory, activeDistance, searchKeyword]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    console.log('[CityPage] category changed:', category);
  };

  const handleDistanceClick = (distance: string) => {
    setActiveDistance(distance);
    console.log('[CityPage] distance changed:', distance);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'map' ? 'list' : 'map');
    console.log('[CityPage] view mode:', viewMode === 'map' ? 'list' : 'map');
  };

  const handlePinClick = (shopId: string) => {
    setSelectedShopId(shopId === selectedShopId ? null : shopId);
  };

  const handleCollectRoute = () => {
    Taro.showToast({
      title: '已收藏路线',
      icon: 'success',
    });
    console.log('[CityPage] route collected');
  };

  const handleSearch = () => {
    console.log('[CityPage] search keyword:', searchKeyword);
  };

  const mapPins = [
    { id: 's1', top: '30%', left: '40%', name: '老北京铜锅' },
    { id: 's2', top: '45%', left: '60%', name: '星巴克臻选' },
    { id: 's3', top: '55%', left: '30%', name: '深夜食堂' },
    { id: 's4', top: '35%', left: '70%', name: '老式糖水铺' },
    { id: 's5', top: '60%', left: '50%', name: '胡同创意菜' },
  ];

  return (
    <View className={styles.cityPage}>
      <View className={styles.header}>
        <View className={styles.titleRow}>
          <Text className={styles.title}>同城探店</Text>
          <View className={styles.citySelect} onClick={() => Taro.showToast({ title: '选择城市', icon: 'none' })}>
            <Text>北京</Text>
            <Text>▼</Text>
          </View>
        </View>

        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索店铺、地址"
            placeholderClass="input-placeholder"
            value={searchKeyword}
            onInput={(e) => setSearchKeyword(e.detail.value)}
            onConfirm={handleSearch}
          />
        </View>
      </View>

      <ScrollView scrollX className={styles.filterRow} enhanced showScrollbar={false}>
        {categories.map((category) => (
          <View
            key={category}
            className={classnames(styles.filterChip, activeCategory === category && styles.active)}
            onClick={() => handleCategoryClick(category)}
          >
            <Text>{category}</Text>
          </View>
        ))}
      </ScrollView>

      <View className={styles.distanceTabs}>
        {distanceOptions.map((distance) => (
          <View
            key={distance}
            className={classnames(styles.distanceTab, activeDistance === distance && styles.active)}
            onClick={() => handleDistanceClick(distance)}
          >
            <Text>{distance}</Text>
          </View>
        ))}
      </View>

      <View className={styles.viewToggle} onClick={toggleViewMode}>
        <Text>{viewMode === 'map' ? '📋' : '🗺️'}</Text>
      </View>

      {viewMode === 'map' ? (
        <View className={styles.mapContainer}>
          <View className={styles.mapPlaceholder}>
            <Text style={{ fontSize: '80rpx', marginBottom: '24rpx' }}>🗺️</Text>
            <Text>地图模式</Text>
            <Text style={{ marginTop: '8rpx', fontSize: '24rpx' }}>点击标记查看店铺</Text>
          </View>
          <View className={styles.mapPins}>
            {mapPins.map((pin) => (
              <View
                key={pin.id}
                className={classnames(styles.mapPin, selectedShopId === pin.id && styles.active)}
                style={{ top: pin.top, left: pin.left }}
                onClick={() => handlePinClick(pin.id)}
              >
                {selectedShopId === pin.id && (
                  <View className={classnames(styles.pinBubble, styles.active)}>
                    <Text>{pin.name}</Text>
                  </View>
                )}
                <Text className={styles.pinIcon}>📍</Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <ScrollView scrollY className={styles.shopList} enhanced showScrollbar={false}>
          <View className={styles.shopListContent}>
            <View className={styles.sectionTitle}>
              <Text>附近推荐</Text>
              <Text className={styles.listCount}> · {filteredShops.length}家</Text>
            </View>

            {filteredShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}

            {filteredShops.length === 0 && (
              <View style={{ textAlign: 'center', padding: '80rpx 0', color: '#86909C' }}>
                <Text style={{ fontSize: '80rpx' }}>🔍</Text>
                <Text style={{ display: 'block', marginTop: '24rpx' }}>暂无符合条件的店铺</Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}

      {viewMode === 'list' && (
        <View className={styles.bottomBar}>
          <View className={styles.collectRouteBtn} onClick={handleCollectRoute}>
            <Text>⭐</Text>
            <Text>收藏路线</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default CityPage;
