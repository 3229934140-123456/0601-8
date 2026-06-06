import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { Shop } from '@/types';
import { useAppStore } from '@/store';

interface ShopCardProps {
  shop: Shop;
  onClick?: () => void;
}

const ShopCard: React.FC<ShopCardProps> = ({ shop, onClick }) => {
  const collectedShops = useAppStore(state => state.collectedShops);
  const collectShop = useAppStore(state => state.collectShop);

  const isCollected = collectedShops.includes(shop.id);

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: '/pages/shop-detail/index?id=' + shop.id,
      });
    }
  };

  const handleCollect = (e) => {
    e.stopPropagation();
    collectShop(shop.id);
    Taro.showToast({
      title: isCollected ? '已取消收藏' : '收藏成功',
      icon: 'none',
    });
  };

  return (
    <View className={styles.shopCard} onClick={handleCardClick}>
      <Image
        className={styles.shopCover}
        src={shop.coverUrl}
        mode="aspectFill"
        onError={(e) => console.error('[ShopCard] image error:', e)}
      />

      <View className={styles.shopContent}>
        <View>
          <View className={styles.shopHeader}>
            <Text className={styles.shopName}>{shop.name}</Text>
            <Button
              className={classnames(styles.collectBtn, isCollected && styles.active)}
              onClick={handleCollect}
            >
              <Text>{isCollected ? '⭐' : '☆'}</Text>
            </Button>
          </View>

          <View className={styles.shopMeta}>
            <Text className={styles.rating}>★ {shop.rating}</Text>
            <Text className={styles.priceRange}>{shop.priceRange}</Text>
            <Text className={styles.category}>· {shop.category}</Text>
            <Text className={styles.distance}>{shop.distance}km</Text>
          </View>
        </View>

        <View className={styles.shopTags}>
          {shop.tags.slice(0, 3).map((tag, index) => (
            <Text key={index} className={styles.tag}>{tag}</Text>
          ))}
        </View>

        <View className={styles.shopAddress}>
          <Text>📍</Text>
          <Text>{shop.address}</Text>
        </View>
      </View>
    </View>
  );
};

export default ShopCard;
