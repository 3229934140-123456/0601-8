import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import styles from './index.module.scss';
import { Message } from '@/types';

interface MessageItemProps {
  message: Message;
  onClick?: () => void;
}

const iconMap: Record<string, string> = {
  system: '🔔',
  interaction: '💬',
  booking: '📸',
  chat: '👤',
};

const MessageItem: React.FC<MessageItemProps> = ({ message, onClick }) => {
  const renderAvatar = () => {
    if (message.avatar) {
      return (
        <Image
          className={styles.avatar}
          src={message.avatar}
          mode="aspectFill"
          onError={(e) => console.error('[MessageItem] image error:', e)}
        />
      );
    }
    return (
      <View className={styles.avatarIcon}>
        <Text>{iconMap[message.type] || '📨'}</Text>
      </View>
    );
  };

  return (
    <View className={styles.messageItem} onClick={onClick}>
      <View className={styles.avatarWrap}>
        {renderAvatar()}
        {message.unreadCount > 0 && (
          <View className={styles.unreadBadge}>
            <Text>{message.unreadCount > 99 ? '99+' : message.unreadCount}</Text>
          </View>
        )}
      </View>

      <View className={styles.messageContent}>
        <View className={styles.messageHeader}>
          <Text className={styles.messageTitle}>{message.title}</Text>
          <Text className={styles.messageTime}>{message.time}</Text>
        </View>
        <Text className={styles.messageDesc}>{message.content}</Text>
      </View>
    </View>
  );
};

export default MessageItem;
