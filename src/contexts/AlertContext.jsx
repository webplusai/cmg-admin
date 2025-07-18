import { useToast } from "@chakra-ui/react";
import React, { createContext, useContext, useMemo, useState } from 'react';
import CMGAlertDialog from "../components/CMGAlertDialog";


// Create the context
const defaultContextValue = {
  showAlert: () => { },
  showAlertDialog: () => { },
};

export const AlertContext = createContext(defaultContextValue);

export const AlertProvider = ({ children }) => {
  const toast = useToast();
  const [alertDialogContentConfig, setAlertDialogContentConfig] = useState(null);


  const showAlert = (alert) => {
    toast({
      title: alert.title,
      description: alert.description,
      status: alert.status || 'info',
      duration: alert.duration || 5000,
      isClosable: true,
      position: alert.position || 'top-right',
    });
  };

  const alertDialogContent = useMemo(() => {
    if (!alertDialogContentConfig) {
      return null;
    }

    return (
      <CMGAlertDialog {...alertDialogContentConfig} setAlertDialogContentConfig={setAlertDialogContentConfig} />
    );
  }, [alertDialogContentConfig]);

  return (
    <AlertContext.Provider value={{ showAlert, showAlertDialog: setAlertDialogContentConfig }}>
      {children}
      {alertDialogContent}
    </AlertContext.Provider>
  );
};

export const useAlertContext = () => useContext(AlertContext);
