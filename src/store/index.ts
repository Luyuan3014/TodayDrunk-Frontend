import { create } from 'zustand';
import { DrinkRecord, DrinkType, Venue, Article, Achievement, FilterOptions, DailyRecommendation } from '../types';

interface AppState {
  // 饮酒记录相关
  drinkRecords: DrinkRecord[];
  addDrinkRecord: (record: Omit<DrinkRecord, 'id' | 'createdAt'>) => void;
  updateDrinkRecord: (id: string, record: Partial<DrinkRecord>) => void;
  deleteDrinkRecord: (id: string) => void;
  getFilteredRecords: (filters: FilterOptions) => DrinkRecord[];
  
  // 地图相关
  venues: Venue[];
  checkedInVenues: string[];
  checkInVenue: (venueId: string) => void;
  
  // 知识文章相关
  articles: Article[];
  readArticles: string[];
  markArticleAsRead: (articleId: string) => void;
  
  // 成就系统
  achievements: Achievement[];
  unlockAchievement: (achievementId: string) => void;
  
  // 今日推荐
  dailyRecommendation: DailyRecommendation | null;
  setDailyRecommendation: (recommendation: DailyRecommendation) => void;
  
  // UI状态
  currentView: 'calendar' | 'list';
  setCurrentView: (view: 'calendar' | 'list') => void;
}

// 生成唯一ID
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// 模拟数据
const mockVenues: Venue[] = [
  {
    id: '1',
    name: '醉仙楼',
    description: '传统中式酒楼，主营白酒和黄酒',
    latitude: 39.9042,
    longitude: 116.4074,
    address: '北京市东城区王府井大街1号',
    phone: '010-12345678',
    openHours: '18:00-02:00',
    rating: 4.5
  },
  {
    id: '2',
    name: 'Whiskey Bar',
    description: '专业威士忌酒吧，收藏各国精品威士忌',
    latitude: 39.9142,
    longitude: 116.4174,
    address: '北京市朝阳区三里屯酒吧街',
    phone: '010-87654321',
    openHours: '19:00-03:00',
    rating: 4.8
  }
];

const mockArticles: Article[] = [
  {
    id: '1',
    title: '威士忌入门指南',
    summary: '了解威士忌的基本知识，从苏格兰到日本威士忌的区别',
    content: '威士忌是一种蒸馏酒精饮料，主要由发酵的谷物制成...',
    category: DrinkType.WHISKEY,
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=whiskey%20bottles%20on%20wooden%20table%20vintage%20style&image_size=landscape_4_3',
    readCount: 1250,
    publishDate: '2024-01-15'
  },
  {
    id: '2',
    title: '中国白酒文化探秘',
    summary: '深入了解中国白酒的历史、工艺和品鉴方法',
    content: '中国白酒有着悠久的历史，是中华文化的重要组成部分...',
    category: DrinkType.BAIJIU,
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20baijiu%20traditional%20bottles%20elegant%20setup&image_size=landscape_4_3',
    readCount: 980,
    publishDate: '2024-01-10'
  }
];

const mockAchievements: Achievement[] = [
  {
    id: '1',
    name: '初次记录',
    description: '完成第一次饮酒记录',
    icon: '🍻',
    unlocked: false
  },
  {
    id: '2',
    name: '连续记录7天',
    description: '连续7天记录饮酒体验',
    icon: '📅',
    unlocked: false
  },
  {
    id: '3',
    name: '酒类探索者',
    description: '尝试5种不同类型的酒',
    icon: '🌟',
    unlocked: false
  }
];

export const useAppStore = create<AppState>((set, get) => ({
  // 初始状态
  drinkRecords: [],
  venues: mockVenues,
  checkedInVenues: [],
  articles: mockArticles,
  readArticles: [],
  achievements: mockAchievements,
  dailyRecommendation: {
    id: '1',
    drink: {
      name: '山崎12年',
      type: DrinkType.WHISKEY,
      description: '日本威士忌的经典之作，口感醇厚，回味悠长',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=japanese%20whiskey%20yamazaki%20bottle%20elegant%20lighting&image_size=square_hd',
      abv: 43
    },
    reason: '适合在寒冷的冬日品尝，温暖身心',
    date: new Date().toISOString().split('T')[0]
  },
  currentView: 'list',
  
  // 饮酒记录方法
  addDrinkRecord: (record) => {
    const newRecord: DrinkRecord = {
      ...record,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    
    set((state) => ({
      drinkRecords: [newRecord, ...state.drinkRecords]
    }));
    
    // 检查成就
    const { drinkRecords, achievements, unlockAchievement } = get();
    
    // 初次记录成就
    if (drinkRecords.length === 1) {
      unlockAchievement('1');
    }
    
    // 酒类探索者成就
    const uniqueTypes = new Set(drinkRecords.map(r => r.type));
    if (uniqueTypes.size >= 5) {
      unlockAchievement('3');
    }
  },
  
  updateDrinkRecord: (id, updates) => {
    set((state) => ({
      drinkRecords: state.drinkRecords.map(record => 
        record.id === id ? { ...record, ...updates } : record
      )
    }));
  },
  
  deleteDrinkRecord: (id) => {
    set((state) => ({
      drinkRecords: state.drinkRecords.filter(record => record.id !== id)
    }));
  },
  
  getFilteredRecords: (filters) => {
    const { drinkRecords } = get();
    return drinkRecords.filter(record => {
      if (filters.type && record.type !== filters.type) return false;
      if (filters.brand && !record.brand.toLowerCase().includes(filters.brand.toLowerCase())) return false;
      if (filters.abvRange && (record.abv < filters.abvRange[0] || record.abv > filters.abvRange[1])) return false;
      if (filters.dateRange && (record.date < filters.dateRange[0] || record.date > filters.dateRange[1])) return false;
      return true;
    });
  },
  
  // 地图方法
  checkInVenue: (venueId) => {
    set((state) => ({
      checkedInVenues: state.checkedInVenues.includes(venueId) 
        ? state.checkedInVenues.filter(id => id !== venueId)
        : [...state.checkedInVenues, venueId]
    }));
  },
  
  // 文章方法
  markArticleAsRead: (articleId) => {
    set((state) => ({
      readArticles: state.readArticles.includes(articleId)
        ? state.readArticles
        : [...state.readArticles, articleId]
    }));
  },
  
  // 成就方法
  unlockAchievement: (achievementId) => {
    set((state) => ({
      achievements: state.achievements.map(achievement =>
        achievement.id === achievementId
          ? { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
          : achievement
      )
    }));
  },
  
  // 今日推荐方法
  setDailyRecommendation: (recommendation) => {
    set({ dailyRecommendation: recommendation });
  },
  
  // UI状态方法
  setCurrentView: (view) => {
    set({ currentView: view });
  }
}));

// 导出类型
export type { AppState };