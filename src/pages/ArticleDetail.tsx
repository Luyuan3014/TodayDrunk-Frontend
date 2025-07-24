import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Share, BookOpen, Clock } from 'lucide-react';
import { useAppStore } from '../store';
import { DrinkType } from '../types';
import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { toast } from 'sonner';

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

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { articles, markArticleAsRead } = useAppStore();
  
  const article = articles.find(a => a.id === id);
  
  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">文章不存在</p>
          <button
            onClick={() => navigate('/knowledge')}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            返回知识库
          </button>
        </div>
      </div>
    );
  }

  // 标记为已读
  useEffect(() => {
    markArticleAsRead(article.id);
  }, [article.id, markArticleAsRead]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href
      }).catch(console.error);
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast.success('链接已复制到剪贴板');
      }).catch(() => {
        toast.error('分享失败');
      });
    }
  };

  // 相关文章推荐
  const relatedArticles = articles
    .filter(a => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <Share className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <article className="max-w-4xl mx-auto">
        {/* 文章头图 */}
        {article.image && (
          <div className="w-full h-64 overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* 文章内容 */}
        <div className="bg-white">
          <div className="p-6">
            {/* 文章标题和元信息 */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">{drinkTypeEmojis[article.category]}</span>
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                  {drinkTypeLabels[article.category]}
                </span>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                {article.title}
              </h1>
              
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{format(parseISO(article.publishDate), 'yyyy年MM月dd日', { locale: zhCN })}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  <span>{article.readCount} 次阅读</span>
                </div>
              </div>
            </div>

            {/* 文章摘要 */}
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6">
              <p className="text-gray-700 leading-relaxed">{article.summary}</p>
            </div>

            {/* 文章正文 */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                {article.content}
              </div>
            </div>

            {/* 文章底部操作 */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    <Share className="w-5 h-5" />
                    <span>分享文章</span>
                  </button>
                </div>
                
                <div className="text-sm text-gray-500">
                  <span>阅读时长约 {Math.ceil(article.content.length / 300)} 分钟</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 相关文章推荐 */}
        {relatedArticles.length > 0 && (
          <div className="bg-white mt-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">相关推荐</h2>
              <div className="space-y-4">
                {relatedArticles.map((relatedArticle) => (
                  <button
                    key={relatedArticle.id}
                    onClick={() => navigate(`/knowledge/${relatedArticle.id}`)}
                    className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      {relatedArticle.image && (
                        <img
                          src={relatedArticle.image}
                          alt={relatedArticle.title}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                          {relatedArticle.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {relatedArticle.summary}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <Eye className="w-3 h-3 mr-1" />
                          <span>{relatedArticle.readCount}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 返回按钮 */}
        <div className="p-6">
          <button
            onClick={() => navigate('/knowledge')}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            返回知识库
          </button>
        </div>
      </article>
    </div>
  );
}