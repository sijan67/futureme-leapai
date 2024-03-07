// AppContext.js
import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <AppContext.Provider value={{ showWelcome, setShowWelcome }}>
      {children}
    </AppContext.Provider>
  );
};
