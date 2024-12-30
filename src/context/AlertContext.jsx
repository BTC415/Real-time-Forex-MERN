import React, { createContext, useContext, useState, useCallback } from 'react';
import Alert from '../components/alerts/Alert';

const AlertContext = createContext({});

export const useAlert = () => useContext(AlertContext);

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null);

  const showAlert = useCallback((message, type = 'info') => {
    setAlert({ message, type });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(null);
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {alert && <Alert {...alert} onClose={hideAlert} />}
      {children}
    </AlertContext.Provider>
  );
}