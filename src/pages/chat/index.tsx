import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, Input, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockChatMessages, mockBookingDetail, mockUsers } from '@/data/index';
import { ChatMessage, User } from '@/types';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [inputText, setInputText] = useState('');
  const [user, setUser] = useState<User>(mockUsers[1]);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(mockBookingDetail.status);
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const params = (currentPage as any)?.options || {};
    const userId = params.userId;
    const type = params.type;

    console.log('[ChatPage] params:', params);

    if (userId) {
      const foundUser = mockUsers.find(u => u.id === userId);
      if (foundUser) {
        setUser(foundUser);
      }
    }

    if (type === 'booking') {
      setIsBooking(true);
    }
  }, []);

  const handleInput = (e) => {
    setInputText(e.detail.value);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      senderId: 'me',
      content: inputText.trim(),
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
    };

    setMessages([...messages, newMsg]);
    setInputText('');

    setTimeout(() => {
      scrollRef.current?.scrollToBottom?.();
    }, 100);

    console.log('[ChatPage] message sent:', newMsg);

    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: 'msg_reply_' + Date.now(),
        senderId: user.id,
        content: '好的，收到~期待合作！',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        isMine: false,
      };
      setMessages(prev => [...prev, replyMsg]);
      console.log('[ChatPage] reply received:', replyMsg);
    }, 1000);
  };

  const handleAcceptBooking = () => {
    setBookingStatus('accepted');
    Taro.showToast({
      title: '已接受约拍',
      icon: 'success',
    });
    console.log('[ChatPage] booking accepted');
  };

  const handleRejectBooking = () => {
    setBookingStatus('rejected');
    Taro.showToast({
      title: '已拒绝约拍',
      icon: 'none',
    });
    console.log('[ChatPage] booking rejected');
  };

  const handleBack = () => {
    Taro.navigateBack();
  };

  return (
    <View className={styles.chatPage}>
      <View className={styles.header}>
        <Button className={styles.backBtn} onClick={handleBack}>
          <Text>←</Text>
        </Button>
        <View className={styles.userInfo}>
          <Image className={styles.avatar} src={user.avatar} mode="aspectFill" />
          <Text className={styles.nickname}>{user.nickname}</Text>
        </View>
        <Button className={styles.moreBtn} onClick={() => Taro.showToast({ title: '更多', icon: 'none' })}>
          <Text>⋯</Text>
        </Button>
      </View>

      <ScrollView
        ref={scrollRef}
        className={styles.messageList}
        scrollY
        enhanced
        showScrollbar={false}
        scrollWithAnimation
      >
        {isBooking && (
          <View className={styles.bookingCard}>
            <Text className={styles.bookingTitle}>📷 约拍邀请</Text>
            <View className={styles.bookingRow}>
              <Text className={styles.bookingLabel}>门店</Text>
              <Text className={styles.bookingValue}>{mockBookingDetail.shopName}</Text>
            </View>
            <View className={styles.bookingRow}>
              <Text className={styles.bookingLabel}>地址</Text>
              <Text className={styles.bookingValue}>{mockBookingDetail.shopAddress}</Text>
            </View>
            <View className={styles.bookingRow}>
              <Text className={styles.bookingLabel}>时间</Text>
              <Text className={styles.bookingValue}>{mockBookingDetail.date} {mockBookingDetail.time}</Text>
            </View>
            <View className={styles.bookingRow}>
              <Text className={styles.bookingLabel}>预算</Text>
              <Text className={styles.bookingValue}>{mockBookingDetail.budget}</Text>
            </View>
            <View className={styles.bookingRow}>
              <Text className={styles.bookingLabel}>备注</Text>
              <Text className={styles.bookingValue}>{mockBookingDetail.remark}</Text>
            </View>

            {bookingStatus === 'pending' && (
              <View className={styles.bookingActions}>
                <View className={classnames(styles.bookingBtn, styles.reject)} onClick={handleRejectBooking}>
                  <Text>拒绝</Text>
                </View>
                <View className={classnames(styles.bookingBtn, styles.accept)} onClick={handleAcceptBooking}>
                  <Text>接受</Text>
                </View>
              </View>
            )}

            {bookingStatus === 'accepted' && (
              <View className={classnames(styles.bookingStatus, styles.accepted)}>
                <Text>✓ 已接受约拍</Text>
              </View>
            )}

            {bookingStatus === 'rejected' && (
              <View className={classnames(styles.bookingStatus, styles.rejected)}>
                <Text>✕ 已拒绝约拍</Text>
              </View>
            )}
          </View>
        )}

        {messages.map((msg) => (
          <View
            key={msg.id}
            className={classnames(styles.messageItem, msg.isMine ? styles.mine : styles.other)}
          >
            {!msg.isMine && (
              <Image className={styles.msgAvatar} src={user.avatar} mode="aspectFill" />
            )}
            <View className={styles.msgBubble}>
              <Text className={styles.msgText}>{msg.content}</Text>
            </View>
            {msg.isMine && (
              <View className={styles.msgAvatarPlaceholder} />
            )}
          </View>
        ))}
      </ScrollView>

      <View className={styles.inputBar}>
        <Input
          className={styles.input}
          placeholder="说点什么..."
          value={inputText}
          onInput={handleInput}
          confirmType="send"
          onConfirm={handleSend}
        />
        <View
          className={classnames(styles.sendBtn, !inputText.trim() && styles.disabled)}
          onClick={handleSend}
        >
          <Text>发送</Text>
        </View>
      </View>
    </View>
  );
};

export default ChatPage;
