import { Outlet } from 'react-router-dom';
import BottomNavigation from './components/BottomNavigation';
import { Toaster } from 'sonner';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 主内容区域 */}
      <main className="pb-20">
        <Outlet />
      </main>
      
      {/* 底部导航 */}
      <BottomNavigation />
      
      {/* Toast通知 */}
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App
