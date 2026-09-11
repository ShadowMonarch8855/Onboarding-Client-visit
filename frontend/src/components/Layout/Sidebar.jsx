import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiFolder, FiFileText, FiDollarSign, FiClipboard, FiUpload, FiBell, FiBarChart2, FiSettings, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import styles from './Sidebar.module.css';

const Sidebar = ({ isMobileOpen, closeMobile }) => {
  const { user, isAdmin, isTeamMember, isClient, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    const links = [{ to: '/', icon: <FiHome />, label: 'Dashboard' }];
    
    if (isAdmin || isTeamMember) {
      links.push(
        { to: '/clients', icon: <FiUsers />, label: 'Clients' },
        { to: '/projects', icon: <FiFolder />, label: 'Projects' },
        { to: '/invoices', icon: <FiDollarSign />, label: 'Invoices' },
        { to: '/contracts', icon: <FiFileText />, label: 'Contracts' }
      );
    }
    
    if (isClient) {
      links.push(
        { to: '/projects', icon: <FiFolder />, label: 'Projects' }
      );
    }

    links.push(
      { to: '/assets', icon: <FiUpload />, label: 'Assets' },
      { to: '/notifications', icon: <FiBell />, label: 'Notifications' }
    );

    if (isAdmin) {
      links.push(
        { to: '/users', icon: <FiUsers />, label: 'Users' },
        { to: '/reports', icon: <FiBarChart2 />, label: 'Reports' }
      );
    }

    return links;
  };

  return (
    <>
      <div className={`${styles.sidebar} ${isMobileOpen ? styles.open : ''}`}>
        <div className={styles.logo}>
          <h2>ClientFlow</h2>
        </div>
        <nav className={styles.nav}>
          {getNavLinks().map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={closeMobile}
              className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className={styles.footer}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </div>
      {isMobileOpen && <div className={styles.overlay} onClick={closeMobile}></div>}
    </>
  );
};

export default Sidebar;
