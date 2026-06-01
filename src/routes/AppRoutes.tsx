import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '@layouts/MainLayout';
import LoginPage from '@pages/LoginPage';
import PlayPage from '@pages/Play/PlayPage';
import KeyboardPreview from '@pages/dev/KeyboardPreview';

const AppRoutes = () =>
  createBrowserRouter([
    {
      path: '/login',
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
          element: <div>Home</div>,
        },
        {
          path: '/play',
          element: <PlayPage />,
        },
        {
          path: '/result',
          element: <div>Result</div>,
        },
        {
          path: '/shop',
          element: <div>Shop</div>,
        },
      ],
    },
    ...(import.meta.env.DEV ? [{ path: '/dev/keyboard', element: <KeyboardPreview /> }] : []),
  ]);

export default AppRoutes;
