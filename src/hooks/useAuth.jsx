import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { logger } from '../services/logger';

export function useAuthValidation() {
  const { token, setMe, signOut } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      if (!token) return;

      try {
        const { me } = await api.validateToken(token);
        setMe(me);
        logger.info('Token validated successfully');
      } catch (error) {
        logger.error('Token validation failed:', error);
        showAlert('Session expired. Please login again.', 'error');
        signOut();
        navigate('/login');
      }
    };

    validateToken();
  }, [token, setMe, signOut, showAlert, navigate]);
}