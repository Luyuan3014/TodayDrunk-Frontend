// 酒类型枚举
export enum DrinkType {
  BEER = 'beer',
  WINE = 'wine',
  BAIJIU = 'baijiu',
  WHISKEY = 'whiskey',
  SAKE = 'sake',
  COCKTAIL = 'cocktail',
  CUSTOM = 'custom'
}

// 饮酒记录接口
export interface DrinkRecord {
  id: string;
  date: string;
  type: DrinkType;
  brand: string;
  abv: number; // 酒精度
  volume: number; // 容量(ml)
  location: string;
  mood?: string;
  notes?: string;
  photo?: string;
  createdAt: string;
}

// 酒吧/店铺接口
export interface Venue {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  phone?: string;
  openHours?: string;
  rating?: number;
  checkedIn?: boolean;
}

// 酒类知识文章接口
export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: DrinkType;
  image?: string;
  readCount: number;
  publishDate: string;
}

// 成就接口
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

// 统计数据接口
export interface DrinkStats {
  totalRecords: number;
  monthlyRecords: number;
  totalVolume: number;
  averageABV: number;
  favoriteType: DrinkType;
  favoriteBrand: string;
  typeDistribution: Record<DrinkType, number>;
}

// 筛选条件接口
export interface FilterOptions {
  type?: DrinkType;
  brand?: string;
  abvRange?: [number, number];
  dateRange?: [string, string];
}

// 今日推荐接口
export interface DailyRecommendation {
  id: string;
  drink: {
    name: string;
    type: DrinkType;
    description: string;
    image: string;
    abv: number;
  };
  reason: string;
  date: string;
}