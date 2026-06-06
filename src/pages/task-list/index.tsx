import React, { useState, useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useAppStore } from '@/store';
import { mockChallenges } from '@/data/index';

const tabs = [
  { key: 'pending', label: '可领取' },
  { key: 'ongoing', label: '进行中' },
  { key: 'completed', label: '已完成' },
];

const TaskListPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('pending');
  const tasks = useAppStore(state => state.tasks);
  const claimTask = useAppStore(state => state.claimTask);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => t.status === activeTab);
  }, [tasks, activeTab]);

  const getRemainingCount = (task: typeof tasks[0]) => {
    const required = task.requiredCount || 2;
    const completed = Math.floor((task.progress / 100) * required);
    return Math.max(required - completed, 0);
  };

  const getTaskChallenges = (task: typeof tasks[0]) => {
    return mockChallenges.filter(c => task.challengeIds?.includes(c.id));
  };

  const handleTaskClick = (taskId: string) => {
    Taro.navigateTo({
      url: `/pages/task-detail/index?id=${taskId}`,
    });
  };

  const handleClaim = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    claimTask(taskId);
    Taro.showToast({
      title: '领取成功',
      icon: 'success',
    });
    setActiveTab('ongoing');
  };

  const handleGoPublish = (e: React.MouseEvent) => {
    e.stopPropagation();
    Taro.switchTab({
      url: '/pages/shoot/index',
    });
  };

  return (
    <View className={styles.taskListPage}>
      <View className={styles.tabs}>
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={`${styles.tabItem} ${activeTab === tab.key ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text className={styles.tabText}>{tab.label}</Text>
            {activeTab === tab.key && <View className={styles.tabLine} />}
          </View>
        ))}
      </View>

      <ScrollView scrollY className={styles.taskList} enhanced showScrollbar={false}>
        {filteredTasks.length === 0 ? (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📋</Text>
            <Text className={styles.emptyText}>
              {activeTab === 'pending' ? '暂无可领取任务' :
               activeTab === 'ongoing' ? '暂无进行中任务' :
               '暂无已完成任务'}
            </Text>
          </View>
        ) : (
          <View className={styles.tasksContainer}>
            {filteredTasks.map(task => (
              <View
                key={task.id}
                className={styles.taskCard}
                onClick={() => handleTaskClick(task.id)}
              >
                <Image
                  className={styles.taskCover}
                  src={task.coverUrl}
                  mode="aspectFill"
                />
                <View className={styles.taskContent}>
                  <Text className={styles.taskTitle} numberOfLines={2}>
                    {task.title}
                  </Text>
                  <Text className={styles.taskDesc} numberOfLines={2}>
                    {task.description}
                  </Text>
                  <View className={styles.taskMeta}>
                    <View className={styles.rewardTag}>
                      <Text>🎁 {task.reward}</Text>
                    </View>
                    <Text className={styles.deadline}>
                      截止 {task.deadline}
                    </Text>
                  </View>

                  {activeTab === 'ongoing' && (
                    <View className={styles.progressSection}>
                      <View className={styles.progressInfo}>
                        <Text className={styles.progressLabel}>任务进度</Text>
                        <Text className={styles.progressNum}>{task.progress}%</Text>
                      </View>
                      <View className={styles.progressBar}>
                        <View
                          className={styles.progressFill}
                          style={{ width: `${task.progress}%` }}
                        />
                      </View>
                      <Text className={styles.progressHint}>
                        还差 {getRemainingCount(task)} 条视频完成
                      </Text>
                    </View>
                  )}

                  <View className={styles.taskChallengeTags}>
                    {getTaskChallenges(task).slice(0, 2).map(c => (
                      <Text key={c.id} className={styles.challengeTag}>{c.tag}</Text>
                    ))}
                  </View>

                  <View className={styles.taskAction}>
                    {activeTab === 'pending' && (
                      <View
                        className={styles.primaryBtn}
                        onClick={(e) => handleClaim(e, task.id)}
                      >
                        <Text>立即领取</Text>
                      </View>
                    )}
                    {activeTab === 'ongoing' && (
                      <View
                        className={styles.primaryBtn}
                        onClick={handleGoPublish}
                      >
                        <Text>去发布</Text>
                      </View>
                    )}
                    {activeTab === 'completed' && (
                      <View className={styles.completedBtn}>
                        <Text>已完成 ✓</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default TaskListPage;
