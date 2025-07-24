import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import AddRecord from '../pages/AddRecord';
import History from '../pages/History';
import Map from '../pages/Map';
import Knowledge from '../pages/Knowledge';
import Analysis from '../pages/Analysis';
import Profile from '../pages/Profile';
import ArticleDetail from '../pages/ArticleDetail';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'add-record',
        element: <AddRecord />
      },
      {
        path: 'history',
        element: <History />
      },
      {
        path: 'map',
        element: <Map />
      },
      {
        path: 'knowledge',
        element: <Knowledge />
      },
      {
        path: 'knowledge/:id',
        element: <ArticleDetail />
      },
      {
        path: 'analytics',
        element: <Analysis />
      },
      {
        path: 'profile',
        element: <Profile />
      }
    ]
  }
]);