import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Textarea, Input, Image, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockShops, mockChallenges, mockUsers } from '@/data/index';
import { Shop, Challenge, Video, Subtitle, Sticker, DraftVideo, CreatorTask } from '@/types';
import { useAppStore } from '@/store';

const PublishSettingPage: React.FC = () => {
  const addVideo = useAppStore(state => state.addVideo);
  const addDraft = useAppStore(state => state.addDraft);
  const updateDraft = useAppStore(state => state.updateDraft);
  const tasks = useAppStore(state => state.tasks);
  const currentUser = useAppStore(state => state.currentUser);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [selectedChallenges, setSelectedChallenges] = useState<Challenge[]>([]);
  const [showShopPicker, setShowShopPicker] = useState(false);
  const [showChallengePicker, setShowChallengePicker] = useState(false);
  const [saveDraft, setSaveDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [segments, setSegments] = useState<number[]>([]);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [stickers, setStickers] = useState<Sticker[]>([]);

  useEffect(() => {
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const params = (currentPage as any)?.options || {};
    const fromDraft = params.fromDraft;
    const draftIdParam = params.draftId;

    console.log('[PublishSetting] params:', params);

    if (fromDraft && draftIdParam) {
      const drafts = useAppStore.getState().drafts;
      const draft = drafts.find(d => d.id === draftIdParam);
      if (draft) {
        setDraftId(draft.id);
        setTitle(draft.title || '');
        setDescription(draft.description || '');
        setSegments(draft.segments);
        setSubtitles(draft.subtitles);
        setStickers(draft.stickers);
        if (draft.shopId) {
          const shop = mockShops.find(s => s.id === draft.shopId);
          if (shop) setSelectedShop(shop);
        }
        if (draft.challengeIds && draft.challengeIds.length > 0) {
          const challenges = mockChallenges.filter(c => draft.challengeIds?.includes(c.id));
          setSelectedChallenges(challenges);
        }
      }
    }
  }, []);

  const handleTitleInput = (e) => {
    setTitle(e.detail.value);
  };

  const handleDescInput = (e) => {
    setDescription(e.detail.value);
  };

  const handleShopSelect = (shop: Shop) => {
    setSelectedShop(shop);
    setShowShopPicker(false);
  };

  const toggleChallenge = (challenge: Challenge) => {
    const exists = selectedChallenges.find(c => c.id === challenge.id);
    if (exists) {
      setSelectedChallenges(selectedChallenges.filter(c => c.id !== challenge.id));
    } else {
      if (selectedChallenges.length < 3) {
        setSelectedChallenges([...selectedChallenges, challenge]);
      } else {
        Taro.showToast({
          title: '最多选择3个话题',
          icon: 'none',
        });
      }
    }
  };

  const matchedTasks = useMemo(() => {
    if (selectedChallenges.length === 0) return [];
    const selectedIds = selectedChallenges.map(c => c.id);
    return tasks.filter(t =>
      t.status === 'ongoing' &&
      t.challengeIds?.some(cid => selectedIds.includes(cid))
    );
  }, [selectedChallenges, tasks]);

  const getTaskRemaining = (task: CreatorTask) => {
    const required = task.requiredCount || 2;
    const completed = Math.floor((task.progress / 100) * required);
    return Math.max(required - completed, 0);
  };

  const handlePublish = () => {
    if (!title.trim()) {
      Taro.showToast({
        title: '请填写标题',
        icon: 'none',
      });
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);

    if (saveDraft) {
      const draftData: DraftVideo = {
        id: draftId || 'draft_' + Date.now(),
        coverUrl: 'https://picsum.photos/id/237/400/700',
        title: title,
        segments: segments.length > 0 ? segments : [15],
        subtitles: subtitles,
        stickers: stickers,
        updatedAt: new Date().toLocaleString('zh-CN'),
        duration: segments.reduce((a, b) => a + b, 0) || 15,
        shopId: selectedShop?.id,
        challengeIds: selectedChallenges.map(c => c.id),
        description: description,
      };

      if (draftId) {
        updateDraft(draftId, draftData);
      } else {
        addDraft(draftData);
      }

      Taro.showToast({
        title: '已保存到草稿箱',
        icon: 'success',
      });
      console.log('[PublishSetting] saved as draft:', draftData.id);

      setTimeout(() => {
        setIsSubmitting(false);
        Taro.navigateBack();
      }, 1500);
    } else {
      const newVideo: Video = {
        id: 'v_new_' + Date.now(),
        title: title,
        description: description,
        coverUrl: 'https://picsum.photos/id/237/400/700',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        author: currentUser,
        likesCount: 0,
        commentsCount: 0,
        sharesCount: 0,
        collectCount: 0,
        viewsCount: 0,
        duration: segments.reduce((a, b) => a + b, 0) || 15,
        shop: selectedShop,
        challenge: selectedChallenges[0] || null,
        challenges: selectedChallenges,
        tags: selectedChallenges.map(c => c.tag),
        createdAt: new Date().toISOString().split('T')[0],
        isLiked: false,
        isCollected: false,
        isFollowed: false,
      };

      addVideo(newVideo);
      console.log('[PublishSetting] video published:', newVideo.id, 'challenges:', selectedChallenges.map(c => c.id));

      if (draftId) {
        const { deleteDraft } = useAppStore.getState();
        deleteDraft(draftId);
      }

      const state = useAppStore.getState();
      const ongoingTasks = state.tasks.filter(t => t.status === 'ongoing');
      console.log('[PublishSetting] ongoing tasks:', ongoingTasks.map(t => ({ id: t.id, title: t.title, challengeIds: t.challengeIds })));

      if (ongoingTasks.length > 0 && selectedChallenges.length > 0) {
        const { updateTaskProgress } = state;
        const selectedChallengeIds = selectedChallenges.map(c => c.id);

        ongoingTasks.forEach(task => {
          if (task.challengeIds && task.challengeIds.length > 0) {
            const hasMatch = task.challengeIds.some(cid => selectedChallengeIds.includes(cid));
            console.log('[PublishSetting] task', task.id, 'match?', hasMatch, 'taskChallengeIds:', task.challengeIds);

            if (hasMatch) {
              const increment = task.requiredCount ? (100 / task.requiredCount) : 50;
              const newProgress = Math.min(task.progress + increment, 100);
              updateTaskProgress(task.id, newProgress);
              console.log('[PublishSetting] task progress updated:', task.id, 'from', task.progress, 'to', newProgress);
            }
          }
        });
      }

      Taro.showToast({
        title: '发布成功',
        icon: 'success',
      });

      setTimeout(() => {
        setIsSubmitting(false);
        Taro.switchTab({ url: '/pages/home/index' });
      }, 1500);
    }
  };

  const handleSaveDraftToggle = () => {
    setSaveDraft(!saveDraft);
  };

  return (
    <View className={styles.publishPage}>
      <View className={styles.header}>
        <Button className={styles.backBtn} onClick={() => Taro.navigateBack()}>
          <Text>←</Text>
        </Button>
        <Text className={styles.title}>发布设置</Text>
        <View className={styles.placeholder} />
      </View>

      <ScrollView className={styles.content} scrollY enhanced>
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>视频标题</Text>
          <Textarea
            className={styles.titleInput}
            placeholder="写个吸引人的标题吧～"
            value={title}
            onInput={handleTitleInput}
            maxlength={50}
            autoHeight
          />
          <Text className={styles.charCount}>{title.length}/50</Text>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>视频描述</Text>
          <Textarea
            className={styles.descInput}
            placeholder="介绍一下视频内容、店铺亮点..."
            value={description}
            onInput={handleDescInput}
            maxlength={300}
            autoHeight
          />
          <Text className={styles.charCount}>{description.length}/300</Text>
        </View>

        <View className={styles.section} onClick={() => setShowShopPicker(true)}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>门店定位</Text>
            <View className={styles.arrowIcon}><Text>›</Text></View>
          </View>
          {selectedShop ? (
            <View className={styles.selectedShop}>
              <Image className={styles.shopCover} src={selectedShop.coverUrl} mode="aspectFill" />
              <View className={styles.shopInfo}>
                <Text className={styles.shopName}>{selectedShop.name}</Text>
                <Text className={styles.shopAddr}>📍 {selectedShop.address}</Text>
              </View>
              <Text className={styles.changeBtn}>更换</Text>
            </View>
          ) : (
            <View className={styles.placeholderRow}>
              <Text className={styles.placeholderText}>选择门店位置，让附近用户看到你的视频</Text>
            </View>
          )}
        </View>

        <View className={styles.section} onClick={() => setShowChallengePicker(true)}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>话题挑战</Text>
            <View className={styles.arrowIcon}><Text>›</Text></View>
          </View>
          {selectedChallenges.length > 0 ? (
            <View className={styles.challengeList}>
              {selectedChallenges.map((c) => (
                <View key={c.id} className={styles.challengeTag}>
                  <Text>🏆 {c.tag}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View className={styles.placeholderRow}>
              <Text className={styles.placeholderText}>添加话题，获得更多曝光</Text>
            </View>
          )}
        </View>

        {matchedTasks.length > 0 && (
          <View className={styles.taskHintSection}>
            <View className={styles.taskHintHeader}>
              <Text className={styles.taskHintTitle}>📋 关联任务</Text>
            </View>
            {matchedTasks.map(task => (
              <View key={task.id} className={styles.taskHintItem}>
                <View className={styles.taskHintInfo}>
                  <Text className={styles.taskHintName}>{task.title}</Text>
                  <Text className={styles.taskHintProgress}>
                    还差 {getTaskRemaining(task)} 条完成
                  </Text>
                </View>
                <View className={styles.taskHintBar}>
                  <View
                    className={styles.taskHintFill}
                    style={{ width: `${task.progress}%` }}
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        <View className={styles.section}>
          <View className={styles.sectionHeader} onClick={handleSaveDraftToggle}>
            <Text className={styles.sectionTitle}>保存为草稿</Text>
            <View className={classnames(styles.toggleSwitch, saveDraft && styles.on)}>
              <View className={styles.toggleDot} />
            </View>
          </View>
        </View>
      </ScrollView>

      <View className={styles.footer}>
        <View
          className={classnames(styles.publishBtn, isSubmitting && styles.disabled)}
          onClick={handlePublish}
        >
          <Text>{isSubmitting ? '处理中...' : (saveDraft ? '保存草稿' : '发布')}</Text>
        </View>
      </View>

      {showShopPicker && (
        <View className={styles.pickerModal} onClick={() => setShowShopPicker(false)}>
          <View className={styles.pickerContent} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.pickerTitle}>选择门店</Text>
            <ScrollView scrollY style={{ maxHeight: '600rpx' }} enhanced showScrollbar={false}>
              {mockShops.map((shop) => (
                <View
                  key={shop.id}
                  className={classnames(
                    styles.shopPickerItem,
                    selectedShop?.id === shop.id && styles.selected
                  )}
                  onClick={() => handleShopSelect(shop)}
                >
                  <Image className={styles.shopPickerCover} src={shop.coverUrl} mode="aspectFill" />
                  <View className={styles.shopPickerInfo}>
                    <Text className={styles.shopPickerName}>{shop.name}</Text>
                    <Text className={styles.shopPickerAddr}>📍 {shop.address}</Text>
                    <Text className={styles.shopPickerDistance}>{shop.distance}km</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            <View className={styles.pickerCancel} onClick={() => setShowShopPicker(false)}>
              <Text>取消</Text>
            </View>
          </View>
        </View>
      )}

      {showChallengePicker && (
        <View className={styles.pickerModal} onClick={() => setShowChallengePicker(false)}>
          <View className={styles.pickerContent} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.pickerTitle}>选择话题挑战</Text>
            <ScrollView scrollY style={{ maxHeight: '600rpx' }} enhanced showScrollbar={false}>
              {mockChallenges.map((challenge) => (
                <View
                  key={challenge.id}
                  className={classnames(
                    styles.challengePickerItem,
                    selectedChallenges.find(c => c.id === challenge.id) && styles.selected
                  )}
                  onClick={() => toggleChallenge(challenge)}
                >
                  <View className={styles.challengePickerInfo}>
                    <Text className={styles.challengePickerName}>🏆 {challenge.tag}</Text>
                    <Text className={styles.challengePickerDesc}>{challenge.participantsCount.toLocaleString()}人参与</Text>
                  </View>
                  {selectedChallenges.find(c => c.id === challenge.id) && (
                    <Text className={styles.checkIcon}>✓</Text>
                  )}
                </View>
              ))}
            </ScrollView>
            <View className={styles.pickerCancel} onClick={() => setShowChallengePicker(false)}>
              <Text>确定</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default PublishSettingPage;
