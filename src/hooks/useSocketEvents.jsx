import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { useNavigate } from 'react-router-dom';

export function useSocketEvents() {
  const socket = useSocket();
  const { signOut } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    // Handle authentication errors
    socket.on('authError', (error) => {
      showAlert(error.message || 'Authentication failed', 'error');
      signOut();
      navigate('/login');
    });

    // Handle user events
    socket.on('userLogin', ({ user }) => {
      showAlert(`${user.name} has logged in`, 'info');
    });

    socket.on('userLogout', ({ user }) => {
      showAlert(`${user.name} has logged out`, 'info');
    });

    // Handle channel events
    // socket.on('channelCreated', (channel) => {
    //   showAlert(`New channel "${channel.name}" created`, 'info');
    // });

    // socket.on('channelUpdated', (channel) => {
    //   showAlert(`Channel "${channel.name}" updated`, 'info');
    // });

    // socket.on('channelDeleted', (channel) => {
    //   showAlert(`Channel "${channel.name}" deleted`, 'info');
    // });

    // Handle message events
    socket.on('messageCreated', ({ channel, user }) => {
      showAlert(`New message in ${channel.name} from ${user.name}`, 'info');
    });

    return () => {
      socket.off('authError');
      socket.off('userLogin');
      socket.off('userLogout');
      // socket.off('channelCreated');
      // socket.off('channelUpdated');
      // socket.off('channelDeleted');
      socket.off('messageCreated');
    };
  }, [socket, signOut, showAlert, navigate]);
}