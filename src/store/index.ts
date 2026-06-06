import { create } from 'zustand';
import {
  mockVideos,
  mockDrafts,
  mockCreatorTasks,
  mockUsers,
  mockShops,
  mockComments,
} from '@/data/index';
import {
  Video,
  DraftVideo,
  CreatorTask,
  Subtitle,
  Sticker,
  Shop,
  User,
  Comment,
} from '@/types';

interface AppState {
  videos: Video[];
  drafts: DraftVideo[];
  tasks: CreatorTask[];
  currentUser: User;
  likedVideos: string[];
  collectedVideos: string[];
  likedShops: string[];
  collectedShops: string[];
  recentViewed: string[];
  videoComments: Record<string, Comment[]>;

  addVideo: (video: Video) => void;
  likeVideo: (videoId: string) => void;
  collectVideo: (videoId: string) => void;
  likeShop: (shopId: string) => void;
  collectShop: (shopId: string) => void;
  addRecentView: (videoId: string) => void;

  addDraft: (draft: DraftVideo) => void;
  updateDraft: (id: string, updates: Partial<DraftVideo>) => void;
  deleteDraft: (id: string) => void;

  claimTask: (taskId: string) => void;
  updateTaskProgress: (taskId: string, progress: number) => void;
  completeTask: (taskId: string) => void;
  getTasksByStatus: (status: 'pending' | 'ongoing' | 'completed') => CreatorTask[];

  addComment: (videoId: string, comment: Comment) => void;
  getComments: (videoId: string) => Comment[];
  likeComment: (videoId: string, commentId: string) => void;
  unlikeComment: (videoId: string, commentId: string) => void;

  getVideosByShop: (shopId: string) => Video[];
  getMyVideos: () => Video[];
  getLikedVideos: () => Video[];
  getCollectedVideos: () => Video[];
  getCollectedShops: () => Shop[];
  getRecentViewedVideos: () => Video[];
}

const initialDrafts: DraftVideo[] = mockDrafts.map((d, i) => ({
  id: d.id,
  coverUrl: d.coverUrl,
  title: d.title || '',
  segments: [d.duration],
  subtitles: [
    {
      id: `sub_${d.id}`,
      text: '点击编辑文字',
      startTime: 0,
      endTime: 5,
      x: 50,
      y: 70,
      fontSize: 32,
      color: '#ffffff',
    },
  ],
  stickers: [
    {
      id: `stk_${d.id}`,
      emoji: '🔥',
      x: 50 + i * 10,
      y: 50,
      scale: 1,
    },
  ],
  updatedAt: d.updatedAt,
  duration: d.duration,
  shopId: mockShops[i % mockShops.length]?.id,
  challengeIds: [],
  description: '',
}));

const initialVideoComments: Record<string, Comment[]> = {};
mockVideos.forEach((v, i) => {
  initialVideoComments[v.id] = mockComments.slice(0, 3 + i);
});

export const useAppStore = create<AppState>((set, get) => ({
  videos: mockVideos,
  drafts: initialDrafts,
  tasks: mockCreatorTasks,
  currentUser: mockUsers[0],
  likedVideos: mockVideos.filter(v => v.isLiked).map(v => v.id),
  collectedVideos: mockVideos.filter(v => v.isCollected).map(v => v.id),
  likedShops: [],
  collectedShops: mockShops.slice(0, 2).map(s => s.id),
  recentViewed: [],
  videoComments: initialVideoComments,

  addVideo: (video) => {
    set(state => ({
      videos: [video, ...state.videos],
    }));
    console.log('[Store] video added:', video.id);
  },

  likeVideo: (videoId) => {
    set(state => {
      const isLiked = state.likedVideos.includes(videoId);
      return {
        likedVideos: isLiked
          ? state.likedVideos.filter(id => id !== videoId)
          : [...state.likedVideos, videoId],
        videos: state.videos.map(v =>
          v.id === videoId
            ? {
                ...v,
                isLiked: !v.isLiked,
                likesCount: v.isLiked ? v.likesCount - 1 : v.likesCount + 1,
              }
            : v
        ),
      };
    });
  },

  collectVideo: (videoId) => {
    set(state => {
      const isCollected = state.collectedVideos.includes(videoId);
      return {
        collectedVideos: isCollected
          ? state.collectedVideos.filter(id => id !== videoId)
          : [...state.collectedVideos, videoId],
        videos: state.videos.map(v =>
          v.id === videoId
            ? {
                ...v,
                isCollected: !v.isCollected,
                collectCount: v.isCollected ? v.collectCount - 1 : v.collectCount + 1,
              }
            : v
        ),
      };
    });
  },

  likeShop: (shopId) => {
    set(state => ({
      likedShops: state.likedShops.includes(shopId)
        ? state.likedShops.filter(id => id !== shopId)
        : [...state.likedShops, shopId],
    }));
  },

  collectShop: (shopId) => {
    set(state => ({
      collectedShops: state.collectedShops.includes(shopId)
        ? state.collectedShops.filter(id => id !== shopId)
        : [...state.collectedShops, shopId],
    }));
  },

  addRecentView: (videoId) => {
    set(state => {
      const filtered = state.recentViewed.filter(id => id !== videoId);
      return {
        recentViewed: [videoId, ...filtered].slice(0, 20),
      };
    });
    console.log('[Store] recent view added:', videoId);
  },

  addDraft: (draft) => {
    set(state => ({
      drafts: [draft, ...state.drafts],
    }));
    console.log('[Store] draft added:', draft.id);
  },

  updateDraft: (id, updates) => {
    set(state => ({
      drafts: state.drafts.map(d =>
        d.id === id
          ? { ...d, ...updates, updatedAt: new Date().toLocaleString('zh-CN') }
          : d
      ),
    }));
    console.log('[Store] draft updated:', id);
  },

  deleteDraft: (id) => {
    set(state => ({
      drafts: state.drafts.filter(d => d.id !== id),
    }));
    console.log('[Store] draft deleted:', id);
  },

  claimTask: (taskId) => {
    set(state => ({
      tasks: state.tasks.map(t =>
        t.id === taskId
          ? { ...t, status: 'ongoing' as const, progress: 0 }
          : t
      ),
    }));
    console.log('[Store] task claimed:', taskId);
  },

  updateTaskProgress: (taskId, progress) => {
    set(state => ({
      tasks: state.tasks.map(t =>
        t.id === taskId
          ? {
              ...t,
              progress: Math.min(progress, 100),
              status: progress >= 100 ? ('completed' as const) : t.status,
            }
          : t
      ),
    }));
  },

  completeTask: (taskId) => {
    set(state => ({
      tasks: state.tasks.map(t =>
        t.id === taskId
          ? { ...t, status: 'completed' as const, progress: 100 }
          : t
      ),
    }));
    console.log('[Store] task completed:', taskId);
  },

  getTasksByStatus: (status) => {
    return get().tasks.filter(t => t.status === status);
  },

  addComment: (videoId, comment) => {
    set(state => {
      const existing = state.videoComments[videoId] || [];
      return {
        videoComments: {
          ...state.videoComments,
          [videoId]: [comment, ...existing],
        },
        videos: state.videos.map(v =>
          v.id === videoId
            ? { ...v, commentsCount: v.commentsCount + 1 }
            : v
        ),
      };
    });
    console.log('[Store] comment added to:', videoId);
  },

  getComments: (videoId) => {
    return get().videoComments[videoId] || [];
  },

  likeComment: (videoId, commentId) => {
    set(state => {
      const comments = state.videoComments[videoId] || [];
      const updated = comments.map(c =>
        c.id === commentId
          ? { ...c, likesCount: c.likesCount + 1, isLiked: true }
          : c
      );
      return {
        videoComments: {
          ...state.videoComments,
          [videoId]: updated,
        },
      };
    });
  },

  unlikeComment: (videoId, commentId) => {
    set(state => {
      const comments = state.videoComments[videoId] || [];
      const updated = comments.map(c =>
        c.id === commentId
          ? { ...c, likesCount: Math.max(c.likesCount - 1, 0), isLiked: false }
          : c
      );
      return {
        videoComments: {
          ...state.videoComments,
          [videoId]: updated,
        },
      };
    });
  },

  getVideosByShop: (shopId) => {
    return get().videos.filter(v => v.shop?.id === shopId);
  },

  getMyVideos: () => {
    return get().videos.filter(v => v.author.id === get().currentUser.id);
  },

  getLikedVideos: () => {
    const { likedVideos, videos } = get();
    return videos.filter(v => likedVideos.includes(v.id));
  },

  getCollectedVideos: () => {
    const { collectedVideos, videos } = get();
    return videos.filter(v => collectedVideos.includes(v.id));
  },

  getCollectedShops: () => {
    const { collectedShops } = get();
    return mockShops.filter(s => collectedShops.includes(s.id));
  },

  getRecentViewedVideos: () => {
    const { recentViewed, videos } = get();
    return recentViewed
      .map(id => videos.find(v => v.id === id))
      .filter(Boolean) as Video[];
  },
}));
