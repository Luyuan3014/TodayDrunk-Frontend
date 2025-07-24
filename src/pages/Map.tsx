import { useState } from 'react';
import { MapPin, Star, Phone, Clock, Navigation, CheckCircle } from 'lucide-react';
import { useAppStore } from '../store';
import { Venue } from '../types';

export default function Map() {
  const { venues, checkedInVenues, checkInVenue } = useAppStore();
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // 模拟获取用户位置
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('获取位置失败:', error);
          // 使用默认位置（北京）
          setUserLocation({ lat: 39.9042, lng: 116.4074 });
        }
      );
    } else {
      // 使用默认位置
      setUserLocation({ lat: 39.9042, lng: 116.4074 });
    }
  };

  // 计算距离（简化版本）
  const calculateDistance = (venue: Venue) => {
    if (!userLocation) return '未知';
    
    const R = 6371; // 地球半径（公里）
    const dLat = (venue.latitude - userLocation.lat) * Math.PI / 180;
    const dLng = (venue.longitude - userLocation.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(venue.latitude * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    } else {
      return `${distance.toFixed(1)}km`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">附近酒吧</h1>
          <button
            onClick={getCurrentLocation}
            className="p-2 text-blue-600 hover:text-blue-700"
          >
            <Navigation className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 地图区域 */}
      <div className="relative">
        {/* 模拟地图 */}
        <div className="h-64 bg-gradient-to-br from-green-100 to-blue-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gray-200 opacity-50">
            <div className="w-full h-full bg-gradient-to-br from-green-200 via-blue-200 to-purple-200"></div>
          </div>
          
          {/* 地图标记 */}
          {venues.map((venue, index) => (
            <button
              key={venue.id}
              onClick={() => setSelectedVenue(venue)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                selectedVenue?.id === venue.id ? 'z-20' : 'z-10'
              }`}
              style={{
                left: `${20 + index * 25}%`,
                top: `${30 + index * 20}%`
              }}
            >
              <div className={`relative ${
                selectedVenue?.id === venue.id ? 'scale-125' : 'scale-100'
              } transition-transform`}>
                <MapPin className={`w-8 h-8 ${
                  checkedInVenues.includes(venue.id) 
                    ? 'text-green-600' 
                    : 'text-red-600'
                } drop-shadow-lg`} />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-xs font-medium whitespace-nowrap">
                  {venue.name}
                </div>
              </div>
            </button>
          ))}
          
          {/* 用户位置标记 */}
          {userLocation && (
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
              style={{ left: '50%', top: '50%' }}
            >
              <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
            </div>
          )}
          
          {/* 地图说明 */}
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3">
            <p className="text-sm font-medium text-gray-900 mb-2">图例</p>
            <div className="space-y-1">
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                <span>我的位置</span>
              </div>
              <div className="flex items-center text-xs">
                <MapPin className="w-4 h-4 text-red-600 mr-1" />
                <span>酒吧/酒馆</span>
              </div>
              <div className="flex items-center text-xs">
                <MapPin className="w-4 h-4 text-green-600 mr-1" />
                <span>已打卡</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 店铺列表 */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">附近店铺</h2>
        <div className="space-y-4">
          {venues.map((venue) => {
            const isCheckedIn = checkedInVenues.includes(venue.id);
            const distance = calculateDistance(venue);
            
            return (
              <div
                key={venue.id}
                className={`bg-white rounded-xl shadow-sm p-4 border-2 transition-colors ${
                  selectedVenue?.id === venue.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-transparent'
                }`}
                onClick={() => setSelectedVenue(selectedVenue?.id === venue.id ? null : venue)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="font-semibold text-gray-900 mr-2">{venue.name}</h3>
                      {isCheckedIn && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{venue.description}</p>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="mr-4">{distance}</span>
                      {venue.rating && (
                        <>
                          <Star className="w-4 h-4 mr-1 text-yellow-500" />
                          <span>{venue.rating}</span>
                        </>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-500">{venue.address}</p>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      checkInVenue(venue.id);
                    }}
                    className={`ml-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isCheckedIn
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {isCheckedIn ? '已打卡' : '打卡'}
                  </button>
                </div>
                
                {/* 展开的详细信息 */}
                {selectedVenue?.id === venue.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 gap-3">
                      {venue.phone && (
                        <div className="flex items-center text-sm">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-gray-600">电话：</span>
                          <a href={`tel:${venue.phone}`} className="text-blue-600 ml-1">
                            {venue.phone}
                          </a>
                        </div>
                      )}
                      
                      {venue.openHours && (
                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-gray-600">营业时间：{venue.openHours}</span>
                        </div>
                      )}
                      
                      <div className="flex space-x-2 mt-3">
                        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                          导航前往
                        </button>
                        <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                          分享店铺
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {venues.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">附近暂无店铺</p>
            <p className="text-gray-400 text-sm">我们正在努力收集更多店铺信息</p>
          </div>
        )}
      </div>
    </div>
  );
}