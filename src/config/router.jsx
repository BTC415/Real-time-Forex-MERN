import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Workspace from '../pages/Workspace';
import RootLayout from '../layouts/RootLayout';
import PrivateRoute from '../layouts/PrivateRoute';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '/',
        element: <PrivateRoute><Workspace /></PrivateRoute>
      }
    ]
  }
]);