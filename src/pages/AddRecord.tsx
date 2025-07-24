import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, X } from 'lucide-react';
import { useAppStore } from '../store';
import { DrinkType } from '../types';
import { toast } from 'sonner';

const drinkTypes = [
  { value: DrinkType.BEER, label: '啤酒', emoji: '🍺' },
  { value: DrinkType.WINE, label: '葡萄酒', emoji: '🍷' },
  { value: DrinkType.BAIJIU, label: '白酒', emoji: '🍶' },
  { value: DrinkType.WHISKEY, label: '威士忌', emoji: '🥃' },
  { value: DrinkType.SAKE, label: '清酒', emoji: '🍶' },
  { value: DrinkType.COCKTAIL, label: '鸡尾酒', emoji: '🍸' },
  { value: DrinkType.CUSTOM, label: '自定义', emoji: '🥂' }
];

export default function AddRecord() {
  const navigate = useNavigate();
  const { addDrinkRecord } = useAppStore();
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: DrinkType.BEER,
    brand: '',
    abv: '',
    volume: '',
    location: '',
    mood: '',
    notes: '',
    photo: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.brand.trim()) {
      toast.error('请输入酒品牌名称');
      return;
    }
    
    if (!formData.abv || parseFloat(formData.abv) <= 0) {
      toast.error('请输入有效的酒精度');
      return;
    }
    
    if (!formData.volume || parseFloat(formData.volume) <= 0) {
      toast.error('请输入有效的容量');
      return;
    }

    addDrinkRecord({
      date: formData.date,
      type: formData.type,
      brand: formData.brand.trim(),
      abv: parseFloat(formData.abv),
      volume: parseFloat(formData.volume),
      location: formData.location.trim(),
      mood: formData.mood.trim(),
      notes: formData.notes.trim(),
      photo: formData.photo
    });
    
    toast.success('记录添加成功！');
    navigate('/history');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, photo: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, photo: '' }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      {/* 顶部导航 */}
      <header className="relative z-10 backdrop-blur-sm bg-white/10 border-b border-white/20 px-6 py-4">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-white hover:text-blue-200 transition-colors backdrop-blur-sm bg-white/10 rounded-xl border border-white/20"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="ml-4 text-2xl font-bold text-white">添加饮酒记录</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="relative z-10 p-6 space-y-8">
        {/* 基本信息 */}
        <div className="backdrop-blur-md bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">基本信息</h2>
          
          {/* 日期 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/90 mb-3">日期</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-4 py-3 backdrop-blur-sm bg-white/10 border border-white/30 rounded-2xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-white placeholder-white/60 transition-all duration-300"
            />
          </div>

          {/* 酒类型 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/90 mb-3">酒类型</label>
            <div className="grid grid-cols-2 gap-3">
              {drinkTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                  className={`p-4 rounded-2xl border text-left transition-all duration-300 backdrop-blur-sm ${
                    formData.type === type.value
                      ? 'border-amber-400 bg-amber-400/20 text-white shadow-lg scale-105'
                      : 'border-white/30 bg-white/10 text-white/90 hover:bg-white/20 hover:border-white/40'
                  }`}
                >
                  <span className="text-xl mr-3">{type.emoji}</span>
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 品牌名称 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/90 mb-3">品牌名称 *</label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
              placeholder="请输入酒品牌或名称"
              className="w-full px-4 py-3 backdrop-blur-sm bg-white/10 border border-white/30 rounded-2xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-white placeholder-white/60 transition-all duration-300"
              required
            />
          </div>
        </div>

        {/* 详细信息 */}
        <div className="backdrop-blur-md bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">详细信息</h2>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* 酒精度 */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-3">酒精度 (%) *</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.abv}
                onChange={(e) => setFormData(prev => ({ ...prev, abv: e.target.value }))}
                placeholder="40.0"
                className="w-full px-4 py-3 backdrop-blur-sm bg-white/10 border border-white/30 rounded-2xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-white placeholder-white/60 transition-all duration-300"
                required
              />
            </div>

            {/* 容量 */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-3">容量 (ml) *</label>
              <input
                type="number"
                min="1"
                value={formData.volume}
                onChange={(e) => setFormData(prev => ({ ...prev, volume: e.target.value }))}
                placeholder="500"
                className="w-full px-4 py-3 backdrop-blur-sm bg-white/10 border border-white/30 rounded-2xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-white placeholder-white/60 transition-all duration-300"
                required
              />
            </div>
          </div>

          {/* 饮酒地点 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/90 mb-3">饮酒地点</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="请输入饮酒地点"
              className="w-full px-4 py-3 backdrop-blur-sm bg-white/10 border border-white/30 rounded-2xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-white placeholder-white/60 transition-all duration-300"
            />
          </div>

          {/* 心情 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/90 mb-3">心情</label>
            <input
              type="text"
              value={formData.mood}
              onChange={(e) => setFormData(prev => ({ ...prev, mood: e.target.value }))}
              placeholder="描述当时的心情"
              className="w-full px-4 py-3 backdrop-blur-sm bg-white/10 border border-white/30 rounded-2xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-white placeholder-white/60 transition-all duration-300"
            />
          </div>

          {/* 备注 */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-3">备注</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="记录品酒感受、口感等"
              rows={4}
              className="w-full px-4 py-3 backdrop-blur-sm bg-white/10 border border-white/30 rounded-2xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-white placeholder-white/60 transition-all duration-300 resize-none"
            />
          </div>
        </div>

        {/* 照片上传 */}
        <div className="backdrop-blur-md bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">照片</h2>
          
          {formData.photo ? (
            <div className="relative">
              <img
                src={formData.photo}
                alt="酒瓶照片"
                className="w-full h-48 object-cover rounded-2xl shadow-lg"
              />
              <button
                type="button"
                onClick={removePhoto}
                className="absolute top-3 right-3 p-2 bg-red-500/80 backdrop-blur-sm text-white rounded-full hover:bg-red-600/80 transition-all duration-300 border border-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <label className="block">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <div className="border-2 border-dashed border-white/30 rounded-2xl p-12 text-center hover:border-white/50 cursor-pointer transition-all duration-300 backdrop-blur-sm bg-white/5">
                <Camera className="w-16 h-16 text-white/60 mx-auto mb-4" />
                <p className="text-white/80 text-lg font-medium">点击上传酒瓶照片</p>
                <p className="text-sm text-white/60 mt-2">支持 JPG、PNG 格式</p>
              </div>
            </label>
          )}
        </div>

        {/* 提交按钮 */}
        <div className="pb-8">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-amber-400/30"
          >
            保存记录
          </button>
        </div>
      </form>
    </div>
  );
}