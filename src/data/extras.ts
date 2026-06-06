import { Message, Comment, CreatorData, Draft, Collection, CreatorTask } from '@/types';
import { mockUsers } from './index';

export const mockMessages: Message[] = [
  {
    id: 'm1',
    type: 'chat',
    title: '美食探店达人',
    content: '你好，想约拍一组美食视频可以吗？',
    avatar: 'https://picsum.photos/id/64/200/200',
    time: '刚刚',
    unreadCount: 2,
    targetId: 'u1',
  },
  {
    id: 'm2',
    type: 'interaction',
    title: '互动消息',
    content: '咖啡研究 等32人赞了你的作品',
    time: '5分钟前',
    unreadCount: 12,
  },
  {
    id: 'm3',
    type: 'system',
    title: '系统通知',
    content: '恭喜你，作品《北京咖啡地图》已通过审核',
    time: '1小时前',
    unreadCount: 1,
  },
  {
    id: 'm4',
    type: 'booking',
    title: '约拍消息',
    content: '用户「城市漫游者」向你发起了约拍邀请',
    avatar: 'https://picsum.photos/id/91/200/200',
    time: '2小时前',
    unreadCount: 3,
    targetId: 'u2',
  },
  {
    id: 'm5',
    type: 'chat',
    title: '探店小能手',
    content: '那家店我也去过，确实不错！',
    avatar: 'https://picsum.photos/id/1027/200/200',
    time: '昨天',
    unreadCount: 0,
    targetId: 'u5',
  },
  {
    id: 'm6',
    type: 'interaction',
    title: '互动消息',
    content: '吃货小分队 关注了你',
    time: '昨天',
    unreadCount: 0,
  },
];

export const mockComments: Comment[] = [
  {
    id: 'c1',
    user: mockUsers[2],
    content: '这家店真的超好吃，上周刚去过！',
    likesCount: 128,
    createdAt: '2小时前',
    isLiked: false,
  },
  {
    id: 'c2',
    user: mockUsers[4],
    content: '收藏了，周末去打卡',
    likesCount: 56,
    createdAt: '5小时前',
    isLiked: true,
  },
  {
    id: 'c3',
    user: mockUsers[1],
    content: '人均多少呀？看起来好棒',
    likesCount: 32,
    createdAt: '8小时前',
    isLiked: false,
  },
  {
    id: 'c4',
    user: mockUsers[3],
    content: '已经加入我的探店清单了',
    likesCount: 24,
    createdAt: '1天前',
    isLiked: false,
  },
];

export const mockCreatorData: CreatorData = {
  totalViews: 2580000,
  totalLikes: 156000,
  totalFans: 125600,
  totalIncome: 8960,
  todayViews: 12800,
  todayLikes: 890,
  todayFans: 156,
  conversionRate: 12.5,
};

export const mockDrafts: Draft[] = [
  {
    id: 'd1',
    coverUrl: 'https://picsum.photos/id/292/400/300',
    title: '胡同里的宝藏餐厅',
    updatedAt: '2024-06-06 14:30',
    duration: 32,
  },
  {
    id: 'd2',
    coverUrl: 'https://picsum.photos/id/312/400/300',
    title: '',
    updatedAt: '2024-06-05 20:15',
    duration: 15,
  },
  {
    id: 'd3',
    coverUrl: 'https://picsum.photos/id/431/400/300',
    title: '深夜食堂系列',
    updatedAt: '2024-06-04 09:20',
    duration: 58,
  },
];

export const mockCollections: Collection[] = [
  {
    id: 'col1',
    title: '北京咖啡地图',
    coverUrl: 'https://picsum.photos/id/312/400/300',
    videosCount: 12,
    viewsCount: 256000,
    isTop: true,
  },
  {
    id: 'col2',
    title: '胡同美食探索',
    coverUrl: 'https://picsum.photos/id/292/400/300',
    videosCount: 18,
    viewsCount: 580000,
    isTop: false,
  },
  {
    id: 'col3',
    title: '周末好去处',
    coverUrl: 'https://picsum.photos/id/1036/400/300',
    videosCount: 8,
    viewsCount: 128000,
    isTop: false,
  },
];

export const mockCreatorTasks: CreatorTask[] = [
  {
    id: 't1',
    title: '夏日饮品探店',
    description: '发布3条夏日饮品相关探店视频，带话题#夏日饮品',
    reward: '¥800现金奖励',
    deadline: '2024-06-30',
    progress: 66,
    status: 'ongoing',
    coverUrl: 'https://picsum.photos/id/312/400/300',
  },
  {
    id: 't2',
    title: '城市美食发现计划',
    description: '发布5条城市美食探店视频，参与话题挑战',
    reward: '¥2000探店基金',
    deadline: '2024-07-15',
    progress: 20,
    status: 'ongoing',
    coverUrl: 'https://picsum.photos/id/292/400/300',
  },
  {
    id: 't3',
    title: '深夜食堂打卡',
    description: '发布2条深夜食堂主题视频',
    reward: '官方流量扶持',
    deadline: '2024-06-20',
    progress: 100,
    status: 'completed',
    coverUrl: 'https://picsum.photos/id/431/400/300',
  },
];
