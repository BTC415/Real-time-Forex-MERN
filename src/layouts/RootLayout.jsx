import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { SocketProvider } from '../context/SocketContext';
import { UserStatusProvider } from '../context/UserStatusContext';
import { SocketEventHandler } from '../components/sockets/SocketEventHandler';

export default function RootLayout() {
  return (
    <AuthProvider>
      <SocketProvider>
        <UserStatusProvider>
          <SocketEventHandler />
          <Outlet />
        </UserStatusProvider>
      </SocketProvider>
    </AuthProvider>
  );
}