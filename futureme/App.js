import React from 'react'

import Navigator from './config/navigator';
import { AppProvider } from './context/AppContext';

export default function App() {
  return (
  <AppProvider>
     <Navigator/>
  </AppProvider>
  );
  }