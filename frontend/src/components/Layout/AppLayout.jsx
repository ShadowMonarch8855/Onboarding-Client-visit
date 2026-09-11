import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './AppLayout.module.css';

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    return path.split('/')[1].charAt(0).toUpperCase() + path.split('/')[1].slice(1);
  };

  return (
    <div className={styles.layout}>
      <Sidebar isMobileOpen={isSidebarOpen} closeMobile={() => setIsSidebarOpen(false)} />
      <div className={styles.mainContent}>
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} title={getPageTitle()} />
        <main className={styles.contentArea}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
