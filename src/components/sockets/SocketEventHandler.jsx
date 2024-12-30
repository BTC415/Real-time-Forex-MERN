import { useSocketEvents } from '../../hooks/useSocketEvents';

export function SocketEventHandler() {
  useSocketEvents();
  return null;
}