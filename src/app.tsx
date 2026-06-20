import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { AppProvider } from './store/AppContext';
import './app.scss';

function App(props) {
  useEffect(() => {
    console.log('[App] Mounted');
  }, []);

  useDidShow(() => {
    console.log('[App] Show');
  });

  useDidHide(() => {
    console.log('[App] Hide');
  });

  return <AppProvider>{props.children}</AppProvider>;
}

export default App;
