import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store';
import { mockShops } from '@/data/index';

const DraftBoxPage: React.FC = () => {
  const drafts = useAppStore(state => state.drafts);
  const deleteDraft = useAppStore(state => state.deleteDraft);
  const [isManaging, setIsManaging] = useState(false);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEdit = (draftId: string) => {
    if (isManaging) {
      setIsManaging(false);
      return;
    }
    console.log('[DraftBox] edit draft:', draftId);
    Taro.navigateTo({
      url: `/pages/publish-setting/index?fromDraft=1&draftId=${draftId}`,
    });
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation?.();
    Taro.showModal({
      title: '删除草稿',
      content: '确定要删除这个草稿吗？',
      confirmColor: '#FF2E63',
      success: (res) => {
        if (res.confirm) {
          deleteDraft(id);
          Taro.showToast({
            title: '已删除',
            icon: 'success',
          });
          console.log('[DraftBox] draft deleted:', id);
        }
      },
    });
  };

  const handleBack = () => {
    Taro.navigateBack();
  };

  return (
    <View className={styles.draftBoxPage}>
      <View className={styles.header}>
        <Button className={styles.backBtn} onClick={handleBack}>
          <Text>←</Text>
        </Button>
        <Text className={styles.title}>草稿箱</Text>
        <Text
          className={styles.manageBtn}
          onClick={() => setIsManaging(!isManaging)}
        >
          {isManaging ? '完成' : '管理'}
        </Text>
      </View>

      {drafts.length === 0 ? (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📝</Text>
          <Text className={styles.emptyText}>暂无草稿</Text>
          <Text className={styles.emptyDesc}>去拍摄一段视频吧～</Text>
        </View>
      ) : (
        <ScrollView className={styles.draftList} scrollY enhanced showScrollbar={false}>
          {drafts.map((draft) => {
            const shop = draft.shopId ? mockShops.find(s => s.id === draft.shopId) : null;
            return (
              <View
                key={draft.id}
                className={classnames(styles.draftItem, isManaging && styles.editing)}
                onClick={() => handleEdit(draft.id)}
              >
                <View className={styles.draftCover}>
                  <Image
                    className={styles.coverImage}
                    src={draft.coverUrl}
                    mode="aspectFill"
                  />
                  <View className={styles.durationTag}>
                    <Text>{formatDuration(draft.duration)}</Text>
                  </View>
                  {draft.subtitles.length > 0 && (
                    <View className={styles.subtitleTag}>
                      <Text>📝</Text>
                    </View>
                  )}
                </View>
                <View className={styles.draftInfo}>
                  <Text className={styles.draftTitle}>
                    {draft.title || '未命名草稿'}
                  </Text>
                  {shop && (
                    <Text className={styles.draftShop}>📍 {shop.name}</Text>
                  )}
                  <Text className={styles.draftTime}>
                    {draft.updatedAt}
                  </Text>
                </View>
                {isManaging && (
                  <View
                    className={styles.deleteBtn}
                    onClick={(e) => handleDelete(draft.id, e as any)}
                  >
                    <Text>删除</Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

export default DraftBoxPage;
