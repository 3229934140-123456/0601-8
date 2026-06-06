import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockDrafts } from '@/data/index';
import { Draft } from '@/types';

const DraftBoxPage: React.FC = () => {
  const [drafts, setDrafts] = useState<Draft[]>(mockDrafts);
  const [editingId, setEditingId] = useState<string | null>(null);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEdit = (draft: Draft) => {
    console.log('[DraftBox] edit draft:', draft.id);
    Taro.showToast({
      title: '继续编辑',
      icon: 'none',
    });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    Taro.showModal({
      title: '删除草稿',
      content: '确定要删除这个草稿吗？',
      confirmColor: '#FF2E63',
      success: (res) => {
        if (res.confirm) {
          setDrafts(drafts.filter(d => d.id !== id));
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

  const handleItemClick = (draft: Draft) => {
    if (editingId) {
      setEditingId(null);
    } else {
      handleEdit(draft);
    }
  };

  return (
    <View className={styles.draftBoxPage}>
      <View className={styles.header}>
        <Button className={styles.backBtn} onClick={handleBack}>
          <Text>←</Text>
        </Button>
        <Text className={styles.title}>草稿箱</Text>
        <Text
          className={styles.editBtn}
          onClick={() => setEditingId(editingId ? null : 'all')}
        >
          {editingId ? '完成' : '管理'}
        </Text>
      </View>

      {drafts.length === 0 ? (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📝</Text>
          <Text className={styles.emptyText}>暂无草稿</Text>
        </View>
      ) : (
        <ScrollView className={styles.draftList} scrollY enhanced showScrollbar={false}>
          {drafts.map((draft) => (
            <View
              key={draft.id}
              className={classnames(styles.draftItem, editingId && styles.editing)}
              onClick={() => handleItemClick(draft)}
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
              </View>
              <View className={styles.draftInfo}>
                <Text className={styles.draftTitle}>
                  {draft.title || '未命名草稿'}
                </Text>
                <Text className={styles.draftTime}>
                  {draft.updatedAt}
                </Text>
              </View>
              {editingId && (
                <View
                  className={styles.deleteBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(draft.id);
                  }}
                >
                  <Text>删除</Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default DraftBoxPage;
