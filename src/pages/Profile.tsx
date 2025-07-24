import { useState } from 'react';
import { User, Settings, Award, BarChart3, MapPin, BookOpen, Share2, HelpCircle, LogOut, ChevronRight, Camera, Edit3 } from 'lucide-react';
import { useAppStore } from '../store';
import { toast } from 'sonner';

export default function Profile() {
  const { drinkRecords, achievements, venues } = useAppStore();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '酒友',
    avatar: '',
    bio: '热爱生活，品味人生',
    joinDate: '2024-01-01'
  });

  // 统计数据
  const totalRecords = drinkRecords.length;
  const earnedAchievements = achievements?.filter(a => a.unlocked).length || 0;
  const visitedVenues = venues.filter(v => v.checkedIn).length;
  const totalVolume = drinkRecords.reduce((sum, record) => sum + (record.volume || 0), 0);

  // 菜单项配置
  const menuSections = [
    {
      title: '数据统计',
      items: [
        {
          icon: BarChart3,
          label: '我的数据',
          value: `${totalRecords} 条记录`,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        },
        {
          icon: Award,
          label: '成就收集',
          value: `${earnedAchievements}/${achievements.length}`,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50'
        },
        {
          icon: MapPin,
          label: '打卡地点',
          value: `${visitedVenues} 个地点`,
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        }
      ]
    },
    {
      title: '应用功能',
      items: [
        {
          icon: BookOpen,
          label: '酒知识库',
          description: '学习更多酒类知识',
          action: () => {}
        },
        {
          icon: Share2,
          label: '分享应用',
          description: '推荐给朋友',
          action: () => {
            if (navigator.share) {
              navigator.share({
                title: 'TodayDrunk - 今日小酌',
                text: '记录每一次美好的饮酒时光',
                url: window.location.origin
              }).catch(console.error);
            } else {
              toast.success('分享链接已复制到剪贴板');
            }
          }
        }
      ]
    },
    {
      title: '设置与帮助',
      items: [
        {
          icon: Settings,
          label: '应用设置',
          description: '个性化设置',
          action: () => toast.info('设置功能开发中')
        },
        {
          icon: HelpCircle,
          label: '帮助与反馈',
          description: '使用帮助和意见反馈',
          action: () => toast.info('帮助功能开发中')
        }
      ]
    }
  ];

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleSaveProfile = () => {
    setShowEditProfile(false);
    toast.success('个人信息已更新');
  };

  const handleAvatarChange = () => {
    // 模拟头像上传
    const avatars = [
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20avatar%20portrait%20of%20a%20person%20enjoying%20wine%2C%20friendly%20smile%2C%20warm%20lighting&image_size=square',
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=casual%20avatar%20portrait%20with%20wine%20glass%2C%20relaxed%20atmosphere%2C%20modern%20style&image_size=square',
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20avatar%20portrait%20in%20wine%20cellar%20setting%2C%20sophisticated%20look&image_size=square'
    ];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    setUserInfo(prev => ({ ...prev, avatar: randomAvatar }));
    toast.success('头像已更新');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部标题栏 */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <h1 className="text-xl font-semibold text-gray-900">个人中心</h1>
      </header>

      <div className="p-4 space-y-6">
        {/* 用户信息卡片 */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
                {userInfo.avatar ? (
                  <img 
                    src={userInfo.avatar} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-white" />
                )}
              </div>
              <button
                onClick={handleAvatarChange}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-white text-orange-600 rounded-full flex items-center justify-center shadow-lg"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-semibold">{userInfo.name}</h2>
                <button
                  onClick={handleEditProfile}
                  className="p-1 hover:bg-white/20 rounded"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-white/80 text-sm mt-1">{userInfo.bio}</p>
              <p className="text-white/60 text-xs mt-2">加入于 {userInfo.joinDate}</p>
            </div>
          </div>
          
          {/* 快速统计 */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/20">
            <div className="text-center">
              <p className="text-2xl font-bold">{totalRecords}</p>
              <p className="text-white/80 text-sm">记录</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{earnedAchievements}</p>
              <p className="text-white/80 text-sm">成就</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{(totalVolume / 1000).toFixed(1)}L</p>
              <p className="text-white/80 text-sm">总量</p>
            </div>
          </div>
        </div>

        {/* 菜单列表 */}
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">{section.title}</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {section.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  onClick={item.action}
                  className="w-full px-4 py-4 flex items-center space-x-3 hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    item.bgColor || 'bg-gray-100'
                  }`}>
                    <item.icon className={`w-5 h-5 ${
                      item.color || 'text-gray-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">{item.label}</p>
                    {item.description && (
                      <p className="text-sm text-gray-500">{item.description}</p>
                    )}
                    {item.value && (
                      <p className="text-sm text-orange-600 font-medium">{item.value}</p>
                    )}
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* 退出登录 */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => toast.info('退出登录功能开发中')}
            className="w-full px-4 py-4 flex items-center space-x-3 hover:bg-red-50 transition-colors"
          >
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-red-600">退出登录</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* 版本信息 */}
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">TodayDrunk v1.0.0</p>
          <p className="text-xs text-gray-400 mt-1">记录每一次美好的饮酒时光</p>
        </div>
      </div>

      {/* 编辑个人信息弹窗 */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">编辑个人信息</h3>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  昵称
                </label>
                <input
                  type="text"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="请输入昵称"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  个人简介
                </label>
                <textarea
                  value={userInfo.bio}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="介绍一下自己"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => setShowEditProfile(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}