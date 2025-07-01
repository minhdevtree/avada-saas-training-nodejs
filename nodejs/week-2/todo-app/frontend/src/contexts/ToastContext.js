import { createContext, useContext, useState, useCallback } from 'react';
import { Frame, Toast } from '@shopify/polaris';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toastProps, setToastProps] = useState(null);

  const showToast = useCallback(
    ({ message, error = false, duration = 3000 }) => {
      setToastProps({
        content: message,
        error,
        duration,
        onDismiss: () => setToastProps(null),
      });
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Frame>
        {children}
        {toastProps && <Toast {...toastProps} />}
      </Frame>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
