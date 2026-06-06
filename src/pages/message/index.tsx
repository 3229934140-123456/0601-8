import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import MessageItem from '@/components/MessageItem';
import { mockMessages } from '@/data/index';
import { Message } from '@/types';

const tabs = ['全部', '私信', '互动', '系统', '约拍'];

const MessagePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('全部');
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const filteredMessages = useMemo(() => {
    if (activeTab === '全部') return messages;
    const typeMap: Record<string, string> = {
      '私信': 'chat',
      '互动': 'interaction',
      '系统': 'system',
      '约拍': 'booking',
    };
    return messages.filter(m => m.type === typeMap[activeTab]);
  }, [messages, activeTab]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    console.log('[MessagePage] tab changed:', tab);
  };

  const handleMessageClick = (message: Message) => {
    console.log('[MessagePage] message clicked:', message.id);
    if (message.type === 'chat' && message.targetId) {
      Taro.showToast({
        title: '聊天功能开发中',
        icon: 'none',
      });
    } else {
      Taro.showToast({
        title: '查看详情',
        icon: 'none',
      });
    }
  };

  const getUnreadCount = (type: string): number => {
    if (type === '全部') {
      return messages.reduce((sum, m) => sum + m.unreadCount, 0);
    }
    const typeMap: Record<string, string> = {
      '私信': 'chat',
      '互动': 'interaction',
      '系统': 'system',
      '约拍': 'booking',
    };
    return messages
      .filter(m => m.type === typeMap[type])
      .reduce((sum, m) => sum + m.unreadCount, 0);
  };

  return (
    <View className={styles.messagePage}>
      <View className={styles.header}>
        <Text className={styles.title}>消息</Text>
      </View>

      <View className={styles.tabs}>
        {tabs.map((tab) => (
          <View
            key={tab}
            className={classnames(styles.tab, activeTab === tab && styles.active)}
            onClick={() => handleTabClick(tab)}
          >
            <Text>{tab}</Text>
            {getUnreadCount(tab) > 0 && (
              <View className={styles.tabBadge}>
                <Text>{getUnreadCount(tab) > 99 ? '99+' : getUnreadCount(tab)}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <ScrollView scrollY className={styles.messageList} enhanced showScrollbar={false}>
        {activeTab === '全部' ? (
          <>
            <View className={styles.sectionTitle}>
              <Text>最近消息</Text>
            </View>
            {filteredMessages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                onClick={() => handleMessageClick(message)}
              />
            ))}
          </>
        ) : (
          filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                onClick={() => handleMessageClick(message)}
              />
            ))
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📭</Text>
              <Text className={styles.emptyText}>暂无消息</Text>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
};

export default MessagePage;
