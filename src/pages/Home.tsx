import { Link } from 'react-router-dom';
import { Plus, History, MapPin, BookOpen, BarChart3, User, Wine } from 'lucide-react';
import { useAppStore } from '../store';

const quickActions = [
  {
    path: '/add-record',
    icon: Plus,
    label: '添加记录',
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    path: '/history',
    icon: History,
    label: '历史记录',
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    path: '/map',
    icon: MapPin,
    label: '附近酒吧',
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  {
    path: '/knowledge',
    icon: BookOpen,
    label: '酒类知识',
    color: 'bg-orange-500 hover:bg-orange-600'
  },
  {
    path: '/analytics',
    icon: BarChart3,
    label: '数据分析',
    color: 'bg-red-500 hover:bg-red-600'
  },
  {
    path: '/profile',
    icon: User,
    label: '个人中心',
    color: 'bg-gray-500 hover:bg-gray-600'
  }
];

export default function Home() {
  const { dailyRecommendation, drinkRecords } = useAppStore();
  const recentRecords = drinkRecords.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      {/* 头部区域 */}
      <div className="relative">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">今日小酌</h1>
              <p className="text-blue-200/80 text-lg">记录每一次美好的品酒时光</p>
            </div>
            <div className="text-right backdrop-blur-sm bg-white/5 rounded-2xl p-4 border border-white/10">
              <p className="text-blue-200/70 text-sm">今天是</p>
              <p className="text-white font-semibold text-lg">{new Date().toLocaleDateString('zh-CN')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 relative z-10">
        {/* 今日推荐 */}
        {dailyRecommendation && (
          <div className="backdrop-blur-md bg-white/10 rounded-3xl border border-white/20 p-6 mb-6 shadow-2xl hover:bg-white/15 transition-all duration-300">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Wine className="w-7 h-7 text-amber-400 mr-3 drop-shadow-lg" />
              今日推荐
            </h2>
            <div className="flex items-start space-x-6">
              <div className="relative">
                <img
                  src={dailyRecommendation.drink.image}
                  alt={dailyRecommendation.drink.name}
                  className="w-24 h-24 rounded-2xl object-cover shadow-xl ring-2 ring-white/20"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl text-white mb-2">{dailyRecommendation.drink.name}</h3>
                <p className="text-blue-200/80 text-sm mb-3 leading-relaxed">{dailyRecommendation.drink.description}</p>
                <p className="text-amber-300 text-sm font-medium mb-3">{dailyRecommendation.reason}</p>
                <div className="flex items-center">
                  <span className="text-xs bg-white/20 text-white px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/30">
                    {dailyRecommendation.drink.abv}% ABV
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 快速操作 */}
        <div className="backdrop-blur-md bg-white/10 rounded-3xl border border-white/20 p-6 mb-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">快速操作</h2>
          <div className="grid grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.path}
                  to={action.path}
                  className="backdrop-blur-sm bg-white/10 hover:bg-white/20 text-white p-4 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 shadow-lg border border-white/20 hover:border-white/30 hover:scale-105"
                >
                  <Icon className="w-7 h-7 mb-3 drop-shadow-lg" />
                  <span className="text-sm font-medium text-center">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 最近记录 */}
        <div className="backdrop-blur-md bg-white/10 rounded-3xl border border-white/20 p-6 mb-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">最近记录</h2>
            <Link to="/history" className="text-amber-300 text-sm font-medium hover:text-amber-200 transition-colors">
              查看全部
            </Link>
          </div>
          {recentRecords.length > 0 ? (
            <div className="space-y-4">
              {recentRecords.map((record) => (
                <div key={record.id} className="flex items-center space-x-4 p-4 backdrop-blur-sm bg-white/10 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="w-12 h-12 bg-amber-400/20 rounded-2xl flex items-center justify-center border border-amber-400/30">
                    <Wine className="w-6 h-6 text-amber-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{record.brand}</h3>
                    <p className="text-sm text-blue-200/80">
                      {record.date} · {record.abv}% ABV · {record.volume}ml
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Wine className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <p className="text-blue-200/80 mb-6">还没有记录，开始你的第一次品酒记录吧！</p>
              <Link
                to="/add-record"
                className="inline-block backdrop-blur-sm bg-amber-400/20 text-white px-6 py-3 rounded-2xl text-sm font-medium hover:bg-amber-400/30 transition-all duration-300 border border-amber-400/30"
              >
                立即记录
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}