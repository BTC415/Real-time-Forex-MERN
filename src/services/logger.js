// Consistent logging utility
const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
};

const isDevelopment = import.meta.env.DEV;

export const logger = {
  info: (message, data) => {
    if (isDevelopment) {
      console.log(`ℹ️ [${LOG_LEVELS.INFO}] ${message}`, data ? data : '');
    }
  },
  
  warn: (message, data) => {
    if (isDevelopment) {
      console.warn(`⚠️ [${LOG_LEVELS.WARN}] ${message}`, data ? data : '');
    }
  },
  
  error: (message, error) => {
    if (isDevelopment) {
      console.error(`❌ [${LOG_LEVELS.ERROR}] ${message}`, error ? error : '');
    }
  }
};