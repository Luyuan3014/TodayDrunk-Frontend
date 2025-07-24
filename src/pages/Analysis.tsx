import { useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calendar, TrendingUp, Award, Target, Filter } from 'lucide-react';
import { useAppStore } from '../store';
import { DrinkType } from '../types';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
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

const COLORS = ['#f97316', '#ea580c', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d', '#450a0a'];

type TimeRange = 'week' | 'month' | 'year';

export default function Analysis() {
  const { drinkRecords, achievements } = useAppStore();
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [showFilter, setShowFilter] = useState(false);

  // 根据时间范围过滤记录
  const getFilteredRecords = () => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (timeRange) {
      case 'week':
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        endDate = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        return drinkRecords;
    }

    return drinkRecords.filter(record => {
      const recordDate = parseISO(record.date);
      return isWithinInterval(recordDate, { start: startDate, end: endDate });
    });
  };

  const filteredRecords = getFilteredRecords() || [];

  // 统计数据
  const totalRecords = filteredRecords.length;
  const totalVolume = filteredRecords.reduce((sum, record) => sum + (record.volume || 0), 0);
  const avgAlcohol = filteredRecords.length > 0 
    ? filteredRecords.reduce((sum, record) => sum + (record.abv || 0), 0) / filteredRecords.length
    : 0;
  const uniqueVenues = new Set(filteredRecords.map(record => record.location).filter(Boolean)).size;

  // 按酒类型统计
  const drinkTypeStats = Object.values(DrinkType).map(type => {
    const typeRecords = filteredRecords.filter(record => record.type === type);
    return {
      name: drinkTypeLabels[type],
      value: typeRecords.length,
      volume: typeRecords.reduce((sum, record) => sum + (record.volume || 0), 0)
    };
  }).filter(stat => stat.value > 0);

  // 按日期统计（最近7天或30天）
  const getDailyStats = () => {
    const days = timeRange === 'week' ? 7 : 30;
    const dailyStats = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      const dayRecords = filteredRecords.filter(record => 
        record.date.startsWith(dateStr)
      );
      
      dailyStats.push({
        date: format(date, timeRange === 'week' ? 'EEE' : 'MM/dd', { locale: zhCN }),
        count: dayRecords.length,
        volume: dayRecords.reduce((sum, record) => sum + (record.volume || 0), 0)
      });
    }
    
    return dailyStats;
  };

  const dailyStats = getDailyStats();

  // 心情统计
  const moodStats = [
    { name: '开心', value: filteredRecords.filter(r => r.mood === '开心').length, emoji: '😊' },
    { name: '放松', value: filteredRecords.filter(r => r.mood === '放松').length, emoji: '😌' },
    { name: '庆祝', value: filteredRecords.filter(r => r.mood === '庆祝').length, emoji: '🎉' },
    { name: '社交', value: filteredRecords.filter(r => r.mood === '社交').length, emoji: '👥' },
    { name: '品鉴', value: filteredRecords.filter(r => r.mood === '品鉴').length, emoji: '🍷' },
    { name: '其他', value: filteredRecords.filter(r => !['开心', '放松', '庆祝', '社交', '品鉴'].includes(r.mood || '')).length, emoji: '🤔' }
  ].filter(stat => stat.value > 0);

  // 获得的成就
  const earnedAchievements = achievements.filter(achievement => achievement.unlocked);

  const timeRangeLabels = {
    week: '本周',
    month: '本月',
    year: '今年'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 pb-20 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* 顶部标题栏 */}
      <header className="relative z-10 backdrop-blur-md bg-white/10 border-b border-white/20 px-6 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">数据分析</h1>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-300"
          >
            <Filter className="w-6 h-6" />
          </button>
        </div>
        
        {/* 时间范围选择 */}
        {showFilter && (
          <div className="mt-6 p-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl">
            <p className="text-sm font-medium text-white/90 mb-4">时间范围</p>
            <div className="flex space-x-3">
              {(['week', 'month', 'year'] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
                    timeRange === range
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                      : 'backdrop-blur-sm bg-white/10 text-white/80 hover:bg-white/20 border border-white/30'
                  }`}
                >
                  {timeRangeLabels[range]}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <div className="relative z-10 p-6 space-y-8">
        {/* 概览统计 */}
        <div className="grid grid-cols-2 gap-6">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-200/80 mb-2">记录次数</p>
                <p className="text-3xl font-bold text-white">{totalRecords}</p>
              </div>
              <Calendar className="w-10 h-10 text-amber-400" />
            </div>
          </div>
          
          <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-200/80 mb-2">总容量(ml)</p>
                <p className="text-3xl font-bold text-white">{totalVolume.toFixed(0)}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-amber-400" />
            </div>
          </div>
          
          <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-200/80 mb-2">平均酒精度</p>
                <p className="text-3xl font-bold text-white">{avgAlcohol.toFixed(1)}%</p>
              </div>
              <Target className="w-10 h-10 text-amber-400" />
            </div>
          </div>
          
          <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-200/80 mb-2">打卡地点</p>
                <p className="text-3xl font-bold text-white">{uniqueVenues}</p>
              </div>
              <Award className="w-10 h-10 text-amber-400" />
            </div>
          </div>
        </div>

        {/* 趋势图表 */}
        {dailyStats.length > 0 && (
          <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-6">
              {timeRange === 'week' ? '本周' : '本月'}饮酒趋势
            </h2>
            <div className="h-64 backdrop-blur-sm bg-white/5 rounded-xl p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                  <XAxis dataKey="date" tick={{ fill: 'white', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'white', fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value, name) => [
                      value, 
                      name === 'count' ? '记录次数' : '容量(ml)'
                    ]}
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#fbbf24" 
                    strokeWidth={3}
                    dot={{ fill: '#fbbf24', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 酒类型分布 */}
        {drinkTypeStats.length > 0 && (
          <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-6">酒类型分布</h2>
            <div className="h-64 backdrop-blur-sm bg-white/5 rounded-xl p-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={drinkTypeStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {drinkTypeStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [value, '次数']}
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 心情统计 */}
        {moodStats.length > 0 && (
          <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-6">心情分布</h2>
            <div className="space-y-4">
              {moodStats.map((mood, index) => (
                <div key={mood.name} className="flex items-center justify-between p-4 backdrop-blur-sm bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{mood.emoji}</span>
                    <span className="font-semibold text-white text-lg">{mood.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 h-3 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${totalRecords > 0 ? (mood.value / totalRecords) * 100 : 0}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-amber-300 w-8 text-right">
                      {mood.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 成就展示 */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-6">
            成就收集 ({earnedAchievements.length}/{achievements.length})
          </h2>
          
          {earnedAchievements.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {earnedAchievements.slice(0, 3).map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-4 p-4 backdrop-blur-sm bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-400/30 rounded-xl hover:bg-amber-500/30 transition-all duration-300">
                  <span className="text-3xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-lg">{achievement.name}</h3>
                    <p className="text-sm text-blue-200/80">{achievement.description}</p>
                  </div>
                  <div className="text-xs text-amber-300 font-semibold bg-amber-400/20 px-3 py-1 rounded-full">
                    已获得
                  </div>
                </div>
              ))}
              
              {earnedAchievements.length > 3 && (
                <div className="text-center pt-3">
                  <span className="text-sm text-blue-200/80">
                    还有 {earnedAchievements.length - 3} 个成就已获得
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Award className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <p className="text-white text-lg mb-2">还没有获得任何成就</p>
              <p className="text-blue-200/80 text-sm">继续记录，解锁更多成就！</p>
            </div>
          )}
        </div>

        {/* 无数据提示 */}
        {totalRecords === 0 && (
          <div className="backdrop-blur-md bg-white/10 border border-white/20 p-12 rounded-2xl shadow-xl text-center">
            <TrendingUp className="w-20 h-20 text-white/30 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-white mb-3">
              {timeRangeLabels[timeRange]}还没有记录
            </h3>
            <p className="text-blue-200/80 mb-8">开始记录您的饮酒体验，查看详细的数据分析</p>
            <button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg transform hover:scale-105">
              添加记录
            </button>
          </div>
        )}
      </div>
    </div>
  );
}