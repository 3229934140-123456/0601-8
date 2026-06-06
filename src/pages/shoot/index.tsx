import React, { useState, useRef } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';

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

const ShootPage: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [activeMode, setActiveMode] = useState('拍视频');
  const [recordingTime, setRecordingTime] = useState(0);
  const [segments, setSegments] = useState<number[]>([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);

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
  };

  const handleNextStep = () => {
    if (segments.length === 0 && !isRecording) {
      Taro.showToast({
        title: '请先拍摄视频',
        icon: 'none',
      });
      return;
    }
    console.log('[ShootPage] go to publish step');
    Taro.showModal({
      title: '发布设置',
      content: '请添加标题、定位和话题',
      confirmText: '去发布',
      confirmColor: '#FF2E63',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '发布功能开发中',
            icon: 'none',
          });
        }
      },
    });
  };

  const handleSaveDraft = () => {
    Taro.showToast({
      title: '已保存到草稿箱',
      icon: 'success',
    });
    console.log('[ShootPage] saved to draft');
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

  return (
    <View className={styles.shootPage}>
      <View className={styles.previewArea}>
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
                <View className={styles.segmentDelete} onClick={() => handleDeleteSegment(index)}>
                  <Text>×</Text>
                </View>
              </View>
            ))}
            <View className={classnames(styles.segmentItem, styles.add)}>
              <Text>+</Text>
            </View>
          </ScrollView>
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
