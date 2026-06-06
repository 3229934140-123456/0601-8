import React, { useState } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockBookingDetail } from '@/data/index';
import { BookingDetail } from '@/types';

const BookingDetailPage: React.FC = () => {
  const [booking, setBooking] = useState<BookingDetail>(mockBookingDetail);
  const [status, setStatus] = useState(booking.status);

  const handleAccept = () => {
    setStatus('accepted');
    Taro.showToast({
      title: '已接受约拍',
      icon: 'success',
    });
    console.log('[BookingDetail] booking accepted');
  };

  const handleReject = () => {
    setStatus('rejected');
    Taro.showToast({
      title: '已拒绝约拍',
      icon: 'none',
    });
    console.log('[BookingDetail] booking rejected');
  };

  const handleChat = () => {
    Taro.navigateTo({
      url: '/pages/chat/index?type=booking&userId=u1',
    });
  };

  const handleBack = () => {
    Taro.navigateBack();
  };

  return (
    <View className={styles.bookingPage}>
      <View className={styles.header}>
        <Button className={styles.backBtn} onClick={handleBack}>
          <Text>←</Text>
        </Button>
        <Text className={styles.title}>约拍详情</Text>
        <View className={styles.placeholder} />
      </View>

      <View className={styles.content}>
        <View className={styles.shopCard}>
          <View className={styles.shopIcon}>
            <Text>🏪</Text>
          </View>
          <View className={styles.shopInfo}>
            <Text className={styles.shopName}>{booking.shopName}</Text>
            <Text className={styles.shopAddr}>📍 {booking.shopAddress}</Text>
          </View>
        </View>

        <View className={styles.infoSection}>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>约拍时间</Text>
            <Text className={styles.infoValue}>📅 {booking.date} {booking.time}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>预算范围</Text>
            <Text className={styles.infoValue}>💰 {booking.budget}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>联系人</Text>
            <View className={styles.contactRow}>
              <Image className={styles.contactAvatar} src={booking.contactAvatar} mode="aspectFill" />
              <Text className={styles.contactName}>{booking.contact}</Text>
            </View>
          </View>
        </View>

        <View className={styles.remarkSection}>
          <Text className={styles.sectionTitle}>约拍备注</Text>
          <Text className={styles.remarkText}>{booking.remark}</Text>
        </View>

        {status === 'pending' && (
          <View className={styles.statusBanner}>
            <Text>⏳ 等待处理</Text>
          </View>
        )}
        {status === 'accepted' && (
          <View className={classnames(styles.statusBanner, styles.accepted)}>
            <Text>✓ 已接受约拍</Text>
          </View>
        )}
        {status === 'rejected' && (
          <View className={classnames(styles.statusBanner, styles.rejected)}>
            <Text>✕ 已拒绝约拍</Text>
          </View>
        )}
      </View>

      <View className={styles.footer}>
        {status === 'pending' ? (
          <>
            <View className={classnames(styles.footerBtn, styles.reject)} onClick={handleReject}>
              <Text>拒绝</Text>
            </View>
            <View className={classnames(styles.footerBtn, styles.accept)} onClick={handleAccept}>
              <Text>接受约拍</Text>
            </View>
          </>
        ) : (
          <View className={classnames(styles.footerBtn, styles.chat)} onClick={handleChat}>
            <Text>去聊聊</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default BookingDetailPage;
