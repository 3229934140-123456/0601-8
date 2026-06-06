import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, Button, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { Subtitle, Sticker } from '@/types';
import { useAppStore } from '@/store';

const shootModes = ['拍视频', '模板', '直播'];
const tools = [
  { id: 'template', icon: '🎨', name: '模板' },
  { id: 'sticker', icon: '🧩', name: '贴纸' },
  { id: 'text', icon: '📝', name: '字幕' },
  { id: 'music', icon: '🎵', name: '音乐' },
  { id: 'speed', icon: '⚡', name: '变速' },
  { id: 'filter', icon: '✨', name: '滤镜' },
];

const templates = [
  { id: 1, name: '美食探店', cover: 'https://picsum.photos/id/292/200/240' },
  { id: 2, name: '咖啡店打卡', cover: 'https://picsum.photos/id/312/200/240' },
  { id: 3, name: '周末vlog', cover: 'https://picsum.photos/id/1036/200/240' },
  { id: 4, name: '夜景街拍', cover: 'https://picsum.photos/id/431/200/240' },
];

const stickerOptions = [
  { id: 's1', emoji: '🔥', name: '火' },
  { id: 's2', emoji: '💖', name: '爱心' },
  { id: 's3', emoji: '⭐', name: '星星' },
  { id: 's4', emoji: '🎉', name: '庆祝' },
  { id: 's5', emoji: '🍜', name: '美食' },
  { id: 's6', emoji: '☕', name: '咖啡' },
  { id: 's7', emoji: '📍', name: '定位' },
  { id: 's8', emoji: '🏆', name: '奖杯' },
];

const ShootPage: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [activeMode, setActiveMode] = useState('拍视频');
  const [recordingTime, setRecordingTime] = useState(0);
  const [segments, setSegments] = useState<number[]>([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showStickerPanel, setShowStickerPanel] = useState(false);
  const [showSubtitlePanel, setShowSubtitlePanel] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [editingSubtitle, setEditingSubtitle] = useState<string | null>(null);
  const [subtitleText, setSubtitleText] = useState('');
  const [draftId, setDraftId] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const params = (currentPage as any)?.options || {};
    const fromDraft = params.fromDraft;
    const draftIdParam = params.draftId;

    console.log('[ShootPage] params:', params);

    if (fromDraft && draftIdParam) {
      const drafts = useAppStore.getState().drafts;
      const draft = drafts.find(d => d.id === draftIdParam);
      if (draft) {
        setDraftId(draft.id);
        setSegments(draft.segments);
        setSubtitles(draft.subtitles);
        setStickers(draft.stickers);
        console.log('[ShootPage] draft loaded:', draft.id, 'segments:', draft.segments.length);
      }
    }
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShootClick = () => {
    if (!isRecording) {
      setIsRecording(true);
      console.log('[ShootPage] start recording');
      let time = 0;
      timerRef.current = setInterval(() => {
        time += 1;
        setRecordingTime(time);
      }, 1000) as unknown as number;
    } else {
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (recordingTime > 0) {
        setSegments([...segments, recordingTime]);
      }
      setRecordingTime(0);
      console.log('[ShootPage] stop recording, segments:', segments.length + 1);
    }
  };

  const handleModeChange = (mode: string) => {
    setActiveMode(mode);
    console.log('[ShootPage] mode changed:', mode);
    if (mode === '模板') {
      setShowTemplateModal(true);
    }
  };

  const handleToolClick = (toolId: string) => {
    console.log('[ShootPage] tool clicked:', toolId);
    if (toolId === 'template') {
      setShowTemplateModal(true);
    } else if (toolId === 'text') {
      setShowSubtitlePanel(true);
      setShowStickerPanel(false);
    } else if (toolId === 'sticker') {
      setShowStickerPanel(true);
      setShowSubtitlePanel(false);
    } else {
      Taro.showToast({
        title: `${toolId}功能开发中`,
        icon: 'none',
      });
    }
  };

  const handleImportFromAlbum = () => {
    Taro.showToast({
      title: '从相册选择',
      icon: 'none',
    });
    console.log('[ShootPage] import from album');
  };

  const handleFlipCamera = () => {
    Taro.showToast({
      title: '切换摄像头',
      icon: 'none',
    });
    console.log('[ShootPage] flip camera');
  };

  const handleDeleteSegment = (index: number) => {
    const newSegments = segments.filter((_, i) => i !== index);
    setSegments(newSegments);
    console.log('[ShootPage] segment deleted:', index);
    Taro.showToast({
      title: '已删除分段',
      icon: 'none',
    });
  };

  const handleNextStep = () => {
    if (segments.length === 0 && !isRecording) {
      Taro.showToast({
        title: '请先拍摄视频',
        icon: 'none',
      });
      return;
    }

    if (draftId) {
      useAppStore.getState().updateDraft(draftId, {
        segments,
        subtitles,
        stickers,
      });
    }

    console.log('[ShootPage] go to publish setting, draftId:', draftId);
    const url = draftId
      ? `/pages/publish-setting/index?fromDraft=1&draftId=${draftId}`
      : '/pages/publish-setting/index';
    Taro.navigateTo({ url });
  };

  const handleSaveDraft = () => {
    if (segments.length === 0) {
      Taro.showToast({
        title: '请先拍摄视频',
        icon: 'none',
      });
      return;
    }

    const { addDraft, updateDraft } = useAppStore.getState();
    const draftData = {
      id: draftId || 'draft_' + Date.now(),
      coverUrl: 'https://picsum.photos/id/237/400/700',
      title: '',
      segments,
      subtitles,
      stickers,
      updatedAt: new Date().toLocaleString('zh-CN'),
      duration: segments.reduce((a, b) => a + b, 0),
    } as any;

    if (draftId) {
      updateDraft(draftId, draftData);
    } else {
      addDraft(draftData);
      setDraftId(draftData.id);
    }

    Taro.showToast({
      title: '已保存到草稿箱',
      icon: 'success',
    });
    console.log('[ShootPage] saved to draft:', draftData.id);
  };

  const handleSelectTemplate = (id: number) => {
    setSelectedTemplate(id);
  };

  const handleConfirmTemplate = () => {
    if (selectedTemplate) {
      Taro.showToast({
        title: '模板套用成功',
        icon: 'success',
      });
      console.log('[ShootPage] template applied:', selectedTemplate);
    }
    setShowTemplateModal(false);
    setActiveMode('拍视频');
  };

  const handleAddSubtitle = () => {
    const newSubtitle: Subtitle = {
      id: 'sub_' + Date.now(),
      text: subtitleText || '点击编辑文字',
      startTime: 0,
      endTime: 5,
      x: 50,
      y: 70,
      fontSize: 32,
      color: '#ffffff',
    };
    setSubtitles([...subtitles, newSubtitle]);
    setSubtitleText('');
    setShowSubtitlePanel(false);
    console.log('[ShootPage] subtitle added:', newSubtitle);
  };

  const handleSubtitleInput = (e) => {
    setSubtitleText(e.detail.value);
  };

  const handleDeleteSubtitle = (id: string) => {
    setSubtitles(subtitles.filter(s => s.id !== id));
    console.log('[ShootPage] subtitle deleted:', id);
  };

  const handleEditSubtitle = (id: string, text: string) => {
    setSubtitles(subtitles.map(s =>
      s.id === id ? { ...s, text } : s
    ));
  };

  const handleAddSticker = (stickerOpt: typeof stickerOptions[0]) => {
    const newSticker: Sticker = {
      id: 'stk_' + Date.now(),
      emoji: stickerOpt.emoji,
      x: 50,
      y: 50,
      scale: 1,
    };
    setStickers([...stickers, newSticker]);
    setShowStickerPanel(false);
    console.log('[ShootPage] sticker added:', newSticker);
  };

  const handleDeleteSticker = (id: string) => {
    setStickers(stickers.filter(s => s.id !== id));
    console.log('[ShootPage] sticker deleted:', id);
  };

  const closePanels = () => {
    setShowSubtitlePanel(false);
    setShowStickerPanel(false);
  };

  return (
    <View className={styles.shootPage}>
      <View className={styles.previewArea} onClick={closePanels}>
        <View className={styles.topBar}>
          <Button
            className={styles.closeBtn}
            onClick={() => Taro.switchTab({ url: '/pages/home/index' })}
          >
            <Text>×</Text>
          </Button>
          <View className={styles.topActions}>
            <Button className={styles.topAction} onClick={handleSaveDraft}>
              <Text>📄</Text>
            </Button>
          </View>
        </View>

        {isRecording && (
          <View className={styles.timer}>
            <Text>● {formatTime(recordingTime)}</Text>
          </View>
        )}

        <View className={styles.modeTabs}>
          {shootModes.map((mode) => (
            <View
              key={mode}
              className={classnames(styles.modeTab, activeMode === mode && styles.active)}
              onClick={() => handleModeChange(mode)}
            >
              <Text>{mode}</Text>
            </View>
          ))}
        </View>

        <View className={styles.previewPlaceholder}>
          <Text className={styles.previewIcon}>📹</Text>
          <Text className={styles.previewText}>点击拍摄按钮开始录制</Text>

          {subtitles.map((sub) => (
            <View
              key={sub.id}
              className={styles.subtitleItem}
              style={{
                top: `${sub.y}%`,
                left: `${sub.x}%`,
                fontSize: `${sub.fontSize}rpx`,
                color: sub.color,
              }}
              onClick={(e) => {
                e.stopPropagation();
                setEditingSubtitle(sub.id);
              }}
            >
              {editingSubtitle === sub.id ? (
                <Input
                  className={styles.subtitleInput}
                  value={sub.text}
                  onInput={(e) => handleEditSubtitle(sub.id, e.detail.value)}
                  onBlur={() => setEditingSubtitle(null)}
                  autoFocus
                />
              ) : (
                <Text>{sub.text}</Text>
              )}
              <View
                className={styles.deleteSubBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSubtitle(sub.id);
                }}
              >
                <Text>×</Text>
              </View>
            </View>
          ))}

          {stickers.map((stk) => (
            <View
              key={stk.id}
              className={styles.stickerItem}
              style={{
                top: `${stk.y}%`,
                left: `${stk.x}%`,
                transform: `scale(${stk.scale})`,
              }}
            >
              <Text className={styles.stickerEmoji}>{stk.emoji}</Text>
              <View
                className={styles.deleteSubBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSticker(stk.id);
                }}
              >
                <Text>×</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.bottomArea}>
        {segments.length > 0 && (
          <ScrollView scrollX className={styles.segmentsBar} enhanced showScrollbar={false}>
            {segments.map((duration, index) => (
              <View
                key={index}
                className={classnames(styles.segmentItem, styles.active)}
                style={{ background: `linear-gradient(135deg, #FF2E63 ${duration * 2}%, #FF6B9D 100%)` }}
              >
                <Text className={styles.segmentNum}>{index + 1}</Text>
                <View className={styles.segmentDelete} onClick={() => handleDeleteSegment(index)}>
                  <Text>×</Text>
                </View>
              </View>
            ))}
            <View
              className={classnames(styles.segmentItem, styles.add)}
              onClick={handleShootClick}
            >
              <Text>+</Text>
            </View>
          </ScrollView>
        )}

        {showSubtitlePanel && (
          <View className={styles.toolPanel}>
            <Text className={styles.panelTitle}>添加字幕</Text>
            <Input
              className={styles.subtitleInputBox}
              placeholder="输入字幕文字..."
              value={subtitleText}
              onInput={handleSubtitleInput}
              maxlength={30}
            />
            <View className={styles.panelActions}>
              <View
                className={classnames(styles.panelBtn, styles.cancel)}
                onClick={() => setShowSubtitlePanel(false)}
              >
                <Text>取消</Text>
              </View>
              <View
                className={classnames(styles.panelBtn, styles.confirm)}
                onClick={handleAddSubtitle}
              >
                <Text>添加</Text>
              </View>
            </View>
          </View>
        )}

        {showStickerPanel && (
          <View className={styles.toolPanel}>
            <Text className={styles.panelTitle}>选择贴纸</Text>
            <View className={styles.stickerGrid}>
              {stickerOptions.map((opt) => (
                <View
                  key={opt.id}
                  className={styles.stickerOption}
                  onClick={() => handleAddSticker(opt)}
                >
                  <Text className={styles.stickerOptionEmoji}>{opt.emoji}</Text>
                  <Text className={styles.stickerOptionName}>{opt.name}</Text>
                </View>
              ))}
            </View>
            <View className={styles.panelActions}>
              <View
                className={classnames(styles.panelBtn, styles.cancel)}
                onClick={() => setShowStickerPanel(false)}
              >
                <Text>关闭</Text>
              </View>
            </View>
          </View>
        )}

        <View className={styles.toolsRow}>
          {tools.map((tool) => (
            <View key={tool.id} className={styles.toolItem} onClick={() => handleToolClick(tool.id)}>
              <View className={styles.toolIcon}>
                <Text>{tool.icon}</Text>
              </View>
              <Text className={styles.toolText}>{tool.name}</Text>
            </View>
          ))}
        </View>

        <View className={styles.shootActions}>
          <Button className={styles.sideAction} onClick={handleImportFromAlbum}>
            <Text>🖼️</Text>
          </Button>

          <View
            className={classnames(styles.shootBtn, isRecording && styles.recording)}
            onClick={handleShootClick}
          >
            {!isRecording && <Text>●</Text>}
          </View>

          <Button className={styles.sideAction} onClick={handleFlipCamera}>
            <Text>🔄</Text>
          </Button>
        </View>

        <View
          className={classnames(styles.nextStep, segments.length === 0 && styles.disabled)}
          onClick={handleNextStep}
        >
          <Text>下一步</Text>
        </View>
      </View>

      {showTemplateModal && (
        <View className={styles.templateModal} onClick={() => setShowTemplateModal(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.modalTitle}>选择探店模板</Text>

            <ScrollView scrollY style={{ maxHeight: '500rpx' }} enhanced showScrollbar={false}>
              <View className={styles.templateGrid}>
                {templates.map((template) => (
                  <View
                    key={template.id}
                    className={classnames(
                      styles.templateItem,
                      selectedTemplate === template.id && styles.selected
                    )}
                    onClick={() => handleSelectTemplate(template.id)}
                  >
                    <Image
                      className={styles.templateCover}
                      src={template.cover}
                      mode="aspectFill"
                      onError={(e) => console.error('[ShootPage] template image error:', e)}
                    />
                    <Text className={styles.templateName}>{template.name}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            <View className={styles.modalActions}>
              <View
                className={classnames(styles.modalBtn, styles.cancel)}
                onClick={() => setShowTemplateModal(false)}
              >
                <Text>取消</Text>
              </View>
              <View
                className={classnames(styles.modalBtn, styles.confirm)}
                onClick={handleConfirmTemplate}
              >
                <Text>确定</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ShootPage;
