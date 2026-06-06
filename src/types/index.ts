// ============================================
// 通用类型定义
// ============================================

// 用户类型
export interface User {
  id: string;
  nickname: string;
  avatar: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  worksCount: number;
  isVerified?: boolean;
  verifiedInfo?: string;
  location?: string;
}

// 视频类型
export interface Video {
  id: string;
  title: string;
  description?: string;
  coverUrl: string;
  videoUrl: string;
  author: User;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  collectCount: number;
  viewsCount: number;
  duration: number;
  shop?: Shop;
  challenge?: Challenge;
  tags: string[];
  createdAt: string;
  isLiked?: boolean;
  isCollected?: boolean;
  isFollowed?: boolean;
}

// 门店类型
export interface Shop {
  id: string;
  name: string;
  coverUrl: string;
  category: string;
  rating: number;
  priceRange: string;
  address: string;
  distance: number;
  businessHours: string;
  phone?: string;
  description?: string;
  tags: string[];
  videosCount: number;
  latitude?: number;
  longitude?: number;
  isCollected?: boolean;
}

// 挑战话题类型
export interface Challenge {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  participantsCount: number;
  viewsCount: number;
  reward?: string;
  startDate: string;
  endDate: string;
  isHot?: boolean;
  isJoined?: boolean;
  tag: string;
}

// 消息类型
export interface Message {
  id: string;
  type: 'chat' | 'system' | 'interaction' | 'booking';
  title: string;
  content: string;
  avatar?: string;
  time: string;
  unreadCount: number;
  targetId?: string;
}

// 评论类型
export interface Comment {
  id: string;
  user: User;
  content: string;
  likesCount: number;
  createdAt: string;
  isLiked?: boolean;
  replies?: Comment[];
}

// 创作者数据类型
export interface CreatorData {
  totalViews: number;
  totalLikes: number;
  totalFans: number;
  totalIncome: number;
  todayViews: number;
  todayLikes: number;
  todayFans: number;
  conversionRate: number;
}

// 草稿类型
export interface Draft {
  id: string;
  coverUrl: string;
  title?: string;
  updatedAt: string;
  duration: number;
}

// 合集类型
export interface Collection {
  id: string;
  title: string;
  coverUrl: string;
  videosCount: number;
  viewsCount: number;
  isTop?: boolean;
}

// 创作任务类型
export interface CreatorTask {
  id: string;
  title: string;
  description: string;
  reward: string;
  deadline: string;
  progress: number;
  status: 'pending' | 'ongoing' | 'completed';
  coverUrl: string;
}

// 分类类型
export interface Category {
  id: string;
  name: string;
  icon?: string;
}

// 聊天消息类型
export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  time: string;
  isMine: boolean;
  type?: 'text' | 'image' | 'booking';
  bookingId?: string;
}

// 约拍详情类型
export interface BookingDetail {
  id: string;
  shopName: string;
  shopAddress: string;
  date: string;
  time: string;
  budget: string;
  remark: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  contact: string;
  contactAvatar: string;
}

// 营业信息类型
export interface BusinessInfo {
  shopName: string;
  phone: string;
  businessHours: string;
  address: string;
  description: string;
}

// 字幕类型
export interface Subtitle {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
}

// 贴纸类型
export interface Sticker {
  id: string;
  emoji: string;
  x: number;
  y: number;
  scale: number;
}

// 草稿视频类型
export interface DraftVideo {
  id: string;
  coverUrl: string;
  title?: string;
  segments: number[];
  subtitles: Subtitle[];
  stickers: Sticker[];
  updatedAt: string;
  duration: number;
}
