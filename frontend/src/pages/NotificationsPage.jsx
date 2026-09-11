import React, { useState, useEffect } from 'react';
import { FiBell, FiCheckCircle, FiInfo, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getNotifications, markAsRead, markAllAsRead } from '../api/notification.api';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import EmptyState from '../components/Common/EmptyState';
import Pagination from '../components/Common/Pagination';
import styles from './NotificationsPage.module.css';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotifications({ page: currentPage, filter });
      const items = (res.data || []).map(n => ({
        ...n,
        isRead: Boolean(n.readAt)
      }));
      setNotifications(items);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [currentPage, filter]);

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      toast.success('Notification marked as read');
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      toast.success('All notifications marked as read');
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'success': return <FiCheckCircle className={styles.iconSuccess} />;
      case 'alert': return <FiAlertCircle className={styles.iconAlert} />;
      default: return <FiInfo className={styles.iconInfo} />;
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Notifications</h1>
        <button onClick={handleMarkAllRead} className={styles.markAllBtn}>
          Mark All Read
        </button>
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${filter === 'all' ? styles.activeTab : ''}`}
          onClick={() => { setFilter('all'); setCurrentPage(1); }}
        >
          All
        </button>
        <button 
          className={`${styles.tab} ${filter === 'unread' ? styles.activeTab : ''}`}
          onClick={() => { setFilter('unread'); setCurrentPage(1); }}
        >
          Unread
        </button>
        <button 
          className={`${styles.tab} ${filter === 'read' ? styles.activeTab : ''}`}
          onClick={() => { setFilter('read'); setCurrentPage(1); }}
        >
          Read
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : notifications.length === 0 ? (
        <EmptyState 
          icon={<FiBell />}
          title="No notifications"
          message="You're all caught up! There are no notifications to display."
        />
      ) : (
        <div className={styles.notificationList}>
          {notifications.map(notification => (
            <div 
              key={notification._id || notification.id} 
              className={`${styles.card} ${!notification.isRead ? styles.unread : ''}`}
              onClick={() => !notification.isRead && handleMarkRead(notification._id || notification.id)}
            >
              <div className={styles.iconContainer}>
                {getIcon(notification.type)}
              </div>
              <div className={styles.content}>
                <h4 className={styles.notificationTitle}>{notification.title}</h4>
                <p className={styles.notificationMessage}>{notification.message}</p>
                <span className={styles.timestamp}>
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
              </div>
              {!notification.isRead && <div className={styles.unreadDot} />}
            </div>
          ))}
          
          {totalPages > 1 && (
            <div className={styles.paginationWrapper}>
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
