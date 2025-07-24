import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, List, Filter, Search, Wine } from 'lucide-react';
import { useAppStore } from '../store';
import { DrinkType, FilterOptions } from '../types';
import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const drinkTypeLabels = {
  [DrinkType.BEER]: '啤酒',
  [DrinkType.WINE]: '葡萄酒',
  [DrinkType.BAIJIU]: '白酒',
  [DrinkType.WHISKEY]: '威士忌',
  [DrinkType.SAKE]: '清酒',
  [DrinkType.COCKTAIL]: '鸡尾酒',
  [DrinkType.CUSTOM]: '自定义'
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

export default function History() {
  const { drinkRecords, currentView, setCurrentView, getFilteredRecords } = useAppStore();
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});

  // 获取筛选后的记录
  const filteredRecords = getFilteredRecords({
    ...filters,
    brand: searchTerm || filters.brand
  });

  // 按日期分组记录
  const groupedRecords = filteredRecords.reduce((groups, record) => {
    const date = record.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
    return groups;
  }, {} as Record<string, typeof filteredRecords>);

  const sortedDates = Object.keys(groupedRecords).sort((a, b) => b.localeCompare(a));

  // 日历视图数据
  const calendarData = drinkRecords.reduce((acc, record) => {
    const date = record.date;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date]++;
    return acc;
  }, {} as Record<string, number>);

  const resetFilters = () => {
    setFilters({});
    setSearchTerm('');
    setShowFilter(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      {/* 顶部导航 */}
      <header className="relative z-10 backdrop-blur-sm bg-white/10 border-b border-white/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">历史记录</h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="p-3 text-white hover:text-blue-200 transition-colors backdrop-blur-sm bg-white/10 rounded-xl border border-white/20"
            >
              <Filter className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 搜索栏 */}
        <div className="mt-4 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
          <input
            type="text"
            placeholder="搜索品牌名称..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 backdrop-blur-sm bg-white/10 border border-white/30 rounded-2xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-white placeholder-white/60 transition-all duration-300"
          />
        </div>

        {/* 视图切换 */}
        <div className="mt-4 flex backdrop-blur-sm bg-white/10 rounded-2xl p-1 border border-white/20">
          <button
            onClick={() => setCurrentView('list')}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
              currentView === 'list'
                ? 'bg-amber-400/20 text-white shadow-lg border border-amber-400/30'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <List className="w-5 h-5 mr-2" />
            列表视图
          </button>
          <button
            onClick={() => setCurrentView('calendar')}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
              currentView === 'calendar'
                ? 'bg-amber-400/20 text-white shadow-lg border border-amber-400/30'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Calendar className="w-5 h-5 mr-2" />
            日历视图
          </button>
        </div>
      </header>

      {/* 筛选面板 */}
      {showFilter && (
        <div className="relative z-10 backdrop-blur-md bg-white/10 border-b border-white/20 p-6">
          <div className="space-y-6">
            {/* 酒类型筛选 */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-3">酒类型</label>
              <select
                value={filters.type || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as DrinkType || undefined }))}
                className="w-full px-4 py-3 backdrop-blur-sm bg-white/10 border border-white/30 rounded-2xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-white transition-all duration-300"
              >
                <option value="" className="bg-slate-800 text-white">全部类型</option>
                {Object.entries(drinkTypeLabels).map(([value, label]) => (
                  <option key={value} value={value} className="bg-slate-800 text-white">{label}</option>
                ))}
              </select>
            </div>

            {/* 酒精度范围 */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-3">酒精度范围 (%)</label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="最低"
                  value={filters.abvRange?.[0] || ''}
                  onChange={(e) => {
                    const min = parseFloat(e.target.value) || 0;
                    setFilters(prev => ({
                      ...prev,
                      abvRange: [min, prev.abvRange?.[1] || 100]
                    }));
                  }}
                  className="px-4 py-3 backdrop-blur-sm bg-white/10 border border-white/30 rounded-2xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-white placeholder-white/60 transition-all duration-300"
                />
                <input
                  type="number"
                  placeholder="最高"
                  value={filters.abvRange?.[1] || ''}
                  onChange={(e) => {
                    const max = parseFloat(e.target.value) || 100;
                    setFilters(prev => ({
                      ...prev,
                      abvRange: [prev.abvRange?.[0] || 0, max]
                    }));
                  }}
                  className="px-4 py-3 backdrop-blur-sm bg-white/10 border border-white/30 rounded-2xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-white placeholder-white/60 transition-all duration-300"
                />
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex space-x-4">
              <button
                onClick={resetFilters}
                className="flex-1 py-3 px-6 backdrop-blur-sm bg-white/10 border border-white/30 text-white rounded-2xl hover:bg-white/20 transition-all duration-300"
              >
                重置
              </button>
              <button
                onClick={() => setShowFilter(false)}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-2xl transition-all duration-300 shadow-lg"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 内容区域 */}
      <div className="relative z-10 p-6">
        {currentView === 'list' ? (
          /* 列表视图 */
          <div className="space-y-6">
            {filteredRecords.length === 0 ? (
              <div className="text-center py-16">
                <Wine className="w-20 h-20 text-white/30 mx-auto mb-6" />
                <p className="text-white text-xl mb-3">暂无记录</p>
                <p className="text-blue-200/80 text-sm mb-8">开始记录你的品酒体验吧</p>
                <Link
                  to="/add-record"
                  className="inline-block bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-3 rounded-2xl font-medium transition-all duration-300 shadow-lg transform hover:scale-105"
                >
                  添加记录
                </Link>
              </div>
            ) : (
              sortedDates.map(date => (
                <div key={date} className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 px-6 py-4 border-b border-white/20">
                    <h3 className="font-semibold text-white text-lg">
                      {format(parseISO(date), 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
                    </h3>
                    <p className="text-blue-200/80 text-sm">{groupedRecords[date].length} 条记录</p>
                  </div>
                  <div className="divide-y divide-white/10">
                    {groupedRecords[date].map(record => (
                      <div key={record.id} className="p-6 hover:bg-white/5 transition-all duration-300">
                        <div className="flex items-start space-x-4">
                          <div className="text-3xl">{drinkTypeEmojis[record.type]}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white text-lg">{record.brand}</h4>
                            <p className="text-blue-200/90 text-sm mt-2">
                              {drinkTypeLabels[record.type]} · {record.abv}% ABV · {record.volume}ml
                            </p>
                            {record.location && (
                              <p className="text-amber-300/80 text-sm mt-2">📍 {record.location}</p>
                            )}
                            {record.mood && (
                              <p className="text-purple-300/80 text-sm mt-2">💭 {record.mood}</p>
                            )}
                            {record.notes && (
                              <p className="text-white/80 text-sm mt-3 bg-white/5 rounded-xl p-3">{record.notes}</p>
                            )}
                          </div>
                          {record.photo && (
                            <img
                              src={record.photo}
                              alt="酒瓶照片"
                              className="w-20 h-20 rounded-2xl object-cover border border-white/20 shadow-lg"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* 日历视图 */
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-semibold text-white mb-6">记录日历</h3>
            <div className="grid grid-cols-7 gap-3 mb-6">
              {['日', '一', '二', '三', '四', '五', '六'].map(day => (
                <div key={day} className="text-center text-sm font-semibold text-blue-200/90 py-3 backdrop-blur-sm bg-white/5 rounded-xl">
                  {day}
                </div>
              ))}
            </div>
            
            {/* 简化的日历实现 */}
            <div className="text-center py-12">
              <Calendar className="w-20 h-20 text-white/30 mx-auto mb-6" />
              <p className="text-white text-lg mb-3">日历视图开发中...</p>
              <p className="text-blue-200/80 text-sm">请使用列表视图查看记录</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}