import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiBell, FiSearch } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { getNotifications } from '../../api/notification.api';
import styles from './Header.module.css';

const Header = ({ toggleSidebar, title }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchUnread = async () => {
      try {
        const res = await getNotifications({ filter: 'unread', limit: 1 });
        if (isMounted) {
          setUnreadCount(res.pagination?.total || 0);
        }
      } catch (err) {
        // silently ignore error on header count fetch
      }
    };

    if (user) {
      fetchUnread();
      const interval = setInterval(fetchUnread, 30000); // refresh every 30s
      return () => {
        isMounted = false;
        clearInterval(interval);
      };
    }
  }, [user]);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={toggleSidebar}>
          <FiMenu size={24} />
        </button>
        <h1 className={styles.title}>{title || 'ClientFlow'}</h1>
      </div>
      
      <div className={styles.right}>
        <div className={styles.search}>
          <FiSearch className={styles.searchIcon} />
          <input type="text" placeholder="Search..." className={styles.searchInput} />
        </div>
        
        <button 
          className={styles.iconBtn} 
          onClick={() => navigate('/notifications')} 
          title="View Notifications"
        >
          <FiBell size={20} />
          {unreadCount > 0 && <span className={styles.badge}>{unreadCount > 99 ? '99+' : unreadCount}</span>}
        </button>
        
        <div className={styles.userProfile}>
          <div className={styles.avatar}>{user?.name?.charAt(0) || 'U'}</div>
          <span className={styles.userName}>{user?.name}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
