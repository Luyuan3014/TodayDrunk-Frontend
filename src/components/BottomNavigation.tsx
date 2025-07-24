import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, History, MapPin, BookOpen, BarChart3, User } from 'lucide-react';
import { cn } from '../lib/utils';

const navigationItems = [
  {
    path: '/',
    icon: Home,
    label: '首页'
  },
  {
    path: '/add-record',
    icon: Plus,
    label: '记录'
  },
  {
    path: '/history',
    icon: History,
    label: '历史'
  },
  {
    path: '/map',
    icon: MapPin,
    label: '地图'
  },
  {
    path: '/knowledge',
    icon: BookOpen,
    label: '知识'
  },
  {
    path: '/analytics',
    icon: BarChart3,
    label: '分析'
  },
  {
    path: '/profile',
    icon: User,
    label: '我的'
  }
];

export default function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-0 flex-1',
                isActive
                  ? 'text-blue-900 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-700 hover:bg-gray-50'
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}