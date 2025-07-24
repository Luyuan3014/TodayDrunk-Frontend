import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Eye, Search, Filter } from 'lucide-react';
import { useAppStore } from '../store';
import { DrinkType } from '../types';
import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const drinkTypeLabels = {
  [DrinkType.BEER]: '啤酒',
  [DrinkType.WINE]: '葡萄酒',
  [DrinkType.BAIJIU]: '白酒',
  [DrinkType.WHISKEY]: '威士忌',
  [DrinkType.SAKE]: '清酒',
  [DrinkType.COCKTAIL]: '鸡尾酒',
  [DrinkType.CUSTOM]: '其他'
};

const drinkTypeEmojis = {
  [DrinkType.BEER]: '🍺',
  [DrinkType.WINE]: '🍷',
  [DrinkType.BAIJIU]: '🍶',
  [DrinkType.WHISKEY]: '🥃',
  [DrinkType.SAKE]: '🍶',
  [DrinkType.COCKTAIL]: '🍸',
  [DrinkType.CUSTOM]: '🥂'
};

export default function Knowledge() {
  const { articles, readArticles, markArticleAsRead } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<DrinkType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 筛选文章
  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 按分类统计文章数量
  const categoryStats = articles.reduce((stats, article) => {
    stats[article.category] = (stats[article.category] || 0) + 1;
    return stats;
  }, {} as Record<DrinkType, number>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">酒类知识</h1>
            <p className="text-orange-100 mt-1">探索酒文化的奥秘</p>
          </div>
          <BookOpen className="w-8 h-8 text-yellow-300" />
        </div>
      </header>

      <div className="px-4 -mt-4">
        {/* 搜索栏 */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="搜索文章标题或内容..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 分类筛选 */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Filter className="w-5 h-5 mr-2 text-orange-600" />
            分类浏览
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`p-3 rounded-lg border text-left transition-colors ${
                selectedCategory === 'all'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg mr-2">📚</span>
                  <span className="text-sm font-medium">全部文章</span>
                </div>
                <span className="text-xs text-gray-500">{articles.length}</span>
              </div>
            </button>
            
            {Object.entries(drinkTypeLabels).map(([type, label]) => {
              const count = categoryStats[type as DrinkType] || 0;
              if (count === 0) return null;
              
              return (
                <button
                  key={type}
                  onClick={() => setSelectedCategory(type as DrinkType)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    selectedCategory === type
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg mr-2">{drinkTypeEmojis[type as DrinkType]}</span>
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    <span className="text-xs text-gray-500">{count}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 文章列表 */}
        <div className="space-y-4 mb-6">
          {filteredArticles.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">暂无相关文章</p>
              <p className="text-gray-400 text-sm">请尝试其他搜索条件或分类</p>
            </div>
          ) : (
            filteredArticles.map((article) => {
              const isRead = readArticles.includes(article.id);
              
              return (
                <Link
                  key={article.id}
                  to={`/knowledge/${article.id}`}
                  onClick={() => markArticleAsRead(article.id)}
                  className="block bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="flex">
                    {/* 文章图片 */}
                    {article.image && (
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {/* 文章内容 */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-semibold text-gray-900 line-clamp-2 ${
                          isRead ? 'opacity-70' : ''
                        }`}>
                          {article.title}
                        </h3>
                        <div className="flex items-center ml-2">
                          <span className="text-lg">{drinkTypeEmojis[article.category]}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {article.summary}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">
                            {drinkTypeLabels[article.category]}
                          </span>
                          <div className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            <span>{article.readCount}</span>
                          </div>
                        </div>
                        <span>
                          {format(parseISO(article.publishDate), 'MM月dd日', { locale: zhCN })}
                        </span>
                      </div>
                      
                      {isRead && (
                        <div className="mt-2">
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            已阅读
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* 推荐阅读 */}
        {selectedCategory === 'all' && searchTerm === '' && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">推荐阅读</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                <h3 className="font-medium text-gray-900 mb-2">🍷 品酒入门指南</h3>
                <p className="text-sm text-gray-600 mb-3">
                  从基础的品酒技巧到专业的品鉴方法，带你走进品酒的世界。
                </p>
                <button className="text-sm text-orange-600 font-medium hover:text-orange-700">
                  开始学习 →
                </button>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-gray-900 mb-2">🥃 威士忌收藏指南</h3>
                <p className="text-sm text-gray-600 mb-3">
                  了解威士忌的收藏价值，学会识别优质威士忌的特征。
                </p>
                <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
                  了解更多 →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}