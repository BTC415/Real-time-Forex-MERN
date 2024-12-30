import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { SocketProvider } from '../context/SocketContext';
import { SocketEventHandler } from '../components/sockets/SocketEventHandler';

export default function RootLayout() {
  return (
    <AuthProvider>
      <SocketProvider>
        <SocketEventHandler />
        <Outlet />
      </SocketProvider>
    </AuthProvider>
  );
}