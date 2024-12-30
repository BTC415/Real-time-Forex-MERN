import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './config/router';
import { AlertProvider } from './context/AlertContext';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

function App() {
  return (
    <AlertProvider>
      <RouterProvider router={router} />
    </AlertProvider>
  );
}

export default App;