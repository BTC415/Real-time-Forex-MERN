import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      console.warn('❌ Socket authentication failed: No token provided');
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user);

    if (!user) {
      console.warn('❌ Socket authentication failed: User not found');
      return next(new Error('Authentication error'));
    }

    socket.user = user;
    console.log('✅ Socket authenticated successfully:', user.email);
    next();
  } catch (error) {
    console.error('❌ Socket authentication error:', error.message);
    next(new Error('Authentication error'));
  }
};