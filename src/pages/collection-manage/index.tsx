import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockCollections } from '@/data/index';
import { Collection } from '@/types';

const CollectionManagePage: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>(mockCollections);
  const [isManaging, setIsManaging] = useState(false);

  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'w';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const handleToggleTop = (id: string) => {
    setCollections(collections.map(c =>
      c.id === id ? { ...c, isTop: !c.isTop } : c
    ));
    const col = collections.find(c => c.id === id);
    if (col) {
      Taro.showToast({
        title: col.isTop ? '已取消置顶' : '已置顶',
        icon: 'none',
      });
      console.log('[Collection] toggle top:', id, !col.isTop);
    }
  };

  const handleDelete = (id: string) => {
    Taro.showModal({
      title: '删除合集',
      content: '确定要删除这个合集吗？',
      confirmColor: '#FF2E63',
      success: (res) => {
        if (res.confirm) {
          setCollections(collections.filter(c => c.id !== id));
          Taro.showToast({
            title: '已删除',
            icon: 'success',
          });
          console.log('[Collection] deleted:', id);
        }
      },
    });
  };

  const handleBack = () => {
    Taro.navigateBack();
  };

  const handleCreate = () => {
    Taro.showToast({
      title: '新建合集功能开发中',
      icon: 'none',
    });
  };

  return (
    <View className={styles.collectionPage}>
      <View className={styles.header}>
        <Button className={styles.backBtn} onClick={handleBack}>
          <Text>←</Text>
        </Button>
        <Text className={styles.title}>合集管理</Text>
        <Text
          className={styles.manageBtn}
          onClick={() => setIsManaging(!isManaging)}
        >
          {isManaging ? '完成' : '管理'}
        </Text>
      </View>

      <ScrollView className={styles.content} scrollY enhanced showScrollbar={false}>
        {collections.map((col) => (
          <View
            key={col.id}
            className={classnames(styles.collectionItem, isManaging && styles.managing)}
          >
            <View className={styles.collectionCover}>
              <Image
                className={styles.coverImage}
                src={col.coverUrl}
                mode="aspectFill"
              />
              {col.isTop && (
                <View className={styles.topTag}>
                  <Text>置顶</Text>
                </View>
              )}
            </View>
            <View className={styles.collectionInfo}>
              <Text className={styles.collectionTitle}>{col.title}</Text>
              <View className={styles.collectionMeta}>
                <Text>{col.videosCount}个视频</Text>
                <Text>·</Text>
                <Text>{formatNumber(col.viewsCount)}次播放</Text>
              </View>
            </View>

            {isManaging ? (
              <View className={styles.manageActions}>
                <View
                  className={classnames(styles.actionBtn, col.isTop && styles.active)}
                  onClick={() => handleToggleTop(col.id)}
                >
                  <Text>{col.isTop ? '取消置顶' : '置顶'}</Text>
                </View>
                <View
                  className={classnames(styles.actionBtn, styles.delete)}
                  onClick={() => handleDelete(col.id)}
                >
                  <Text>删除</Text>
                </View>
              </View>
            ) : (
              <View className={styles.arrowIcon}>
                <Text>›</Text>
              </View>
            )}
          </View>
        ))}

        <View className={styles.createBtn} onClick={handleCreate}>
          <Text className={styles.createIcon}>+</Text>
          <Text className={styles.createText}>新建合集</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default CollectionManagePage;
