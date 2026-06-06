import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '@layouts/MainLayout';
import HomePage from '@pages/HomePage';
import LoginPage from '@pages/LoginPage';
import PlayPage from '@pages/Play/PlayPage';
import PracticeMenuPage from '@pages/Play/PracticeMenuPage';
import ShopPage from '@pages/Shop/ShopPage';
import KeyboardPreview from '@pages/dev/KeyboardPreview';

const AppRoutes = () =>
  createBrowserRouter([
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/auth/kakao/callback',
      element: <LoginPage />,
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <Navigate to='/home' replace />,
        },
        {
          path: '/home',
          element: <HomePage />,
        },
        {
          path: '/play',
          element: <PracticeMenuPage />,
        },
        {
          path: '/play/typing',
          element: <PlayPage />,
        },
        {
          path: '/result',
          element: <div>Result</div>,
        },
        {
          path: '/shop',
          element: <ShopPage />,
        },
      ],
    },
    ...(import.meta.env.DEV ? [{ path: '/dev/keyboard', element: <KeyboardPreview /> }] : []),
  ]);

export default AppRoutes;
