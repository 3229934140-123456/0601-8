import React, { useState } from 'react';
import { View, Text, Input, Textarea, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockBusinessInfo } from '@/data/index';
import { BusinessInfo } from '@/types';

const BusinessInfoPage: React.FC = () => {
  const [info, setInfo] = useState<BusinessInfo>(mockBusinessInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<BusinessInfo>(mockBusinessInfo);

  const handleEdit = () => {
    setEditData({ ...info });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editData.shopName.trim()) {
      Taro.showToast({
        title: '请填写店铺名称',
        icon: 'none',
      });
      return;
    }
    if (!editData.phone.trim()) {
      Taro.showToast({
        title: '请填写联系电话',
        icon: 'none',
      });
      return;
    }

    setInfo({ ...editData });
    setIsEditing(false);
    Taro.showToast({
      title: '保存成功',
      icon: 'success',
    });
    console.log('[BusinessInfo] saved:', editData);
  };

  const handleCancel = () => {
    setEditData({ ...info });
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof BusinessInfo, value: string) => {
    setEditData({
      ...editData,
      [field]: value,
    });
  };

  const handleBack = () => {
    Taro.navigateBack();
  };

  return (
    <View className={styles.businessPage}>
      <View className={styles.header}>
        <Button className={styles.backBtn} onClick={handleBack}>
          <Text>←</Text>
        </Button>
        <Text className={styles.title}>营业信息</Text>
        {!isEditing ? (
          <Text className={styles.editBtn} onClick={handleEdit}>编辑</Text>
        ) : (
          <Text className={styles.saveBtn} onClick={handleSave}>保存</Text>
        )}
      </View>

      <ScrollView className={styles.content} scrollY enhanced showScrollbar={false}>
        <View className={styles.infoCard}>
          <View className={styles.infoItem}>
            <Text className={styles.label}>店铺名称</Text>
            {isEditing ? (
              <Input
                className={styles.input}
                value={editData.shopName}
                onInput={(e) => handleInputChange('shopName', e.detail.value)}
                placeholder="请输入店铺名称"
              />
            ) : (
              <Text className={styles.value}>{info.shopName}</Text>
            )}
          </View>

          <View className={styles.infoItem}>
            <Text className={styles.label}>联系电话</Text>
            {isEditing ? (
              <Input
                className={styles.input}
                type="number"
                value={editData.phone}
                onInput={(e) => handleInputChange('phone', e.detail.value)}
                placeholder="请输入联系电话"
                maxlength={11}
              />
            ) : (
              <Text className={styles.value}>{info.phone}</Text>
            )}
          </View>

          <View className={styles.infoItem}>
            <Text className={styles.label}>营业时间</Text>
            {isEditing ? (
              <View className={styles.timeInputRow}>
                <Input
                  className={styles.timeInput}
                  value={editData.businessHours.split('-')[0] || '10:00'}
                  onInput={(e) => {
                    const parts = editData.businessHours.split('-');
                    handleInputChange('businessHours', `${e.detail.value}-${parts[1] || '22:00'}`);
                  }}
                  placeholder="开始时间"
                />
                <Text className={styles.timeDivider}>至</Text>
                <Input
                  className={styles.timeInput}
                  value={editData.businessHours.split('-')[1] || '22:00'}
                  onInput={(e) => {
                    const parts = editData.businessHours.split('-');
                    handleInputChange('businessHours', `${parts[0] || '10:00'}-${e.detail.value}`);
                  }}
                  placeholder="结束时间"
                />
              </View>
            ) : (
              <Text className={styles.value}>⏰ {info.businessHours}</Text>
            )}
          </View>

          <View className={styles.infoItem}>
            <Text className={styles.label}>店铺地址</Text>
            {isEditing ? (
              <Input
                className={styles.input}
                value={editData.address}
                onInput={(e) => handleInputChange('address', e.detail.value)}
                placeholder="请输入店铺地址"
              />
            ) : (
              <Text className={styles.value}>📍 {info.address}</Text>
            )}
          </View>

          <View className={styles.infoItem}>
            <Text className={styles.label}>店铺简介</Text>
            {isEditing ? (
              <Textarea
                className={styles.textarea}
                value={editData.description}
                onInput={(e) => handleInputChange('description', e.detail.value)}
                placeholder="介绍一下你的店铺..."
                maxlength={200}
                autoHeight
              />
            ) : (
              <Text className={styles.descText}>{info.description}</Text>
            )}
          </View>
        </View>

        {isEditing && (
          <View className={styles.actionRow}>
            <View className={classnames(styles.actionBtn, styles.cancel)} onClick={handleCancel}>
              <Text>取消</Text>
            </View>
            <View className={classnames(styles.actionBtn, styles.confirm)} onClick={handleSave}>
              <Text>保存</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default BusinessInfoPage;
