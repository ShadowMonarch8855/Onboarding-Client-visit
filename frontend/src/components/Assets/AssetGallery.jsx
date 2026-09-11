import React from 'react';
import { FiDownload, FiTrash2, FiFile, FiImage, FiVideo } from 'react-icons/fi';
import styles from './AssetGallery.module.css';

const AssetGallery = ({ assets, onDownload, onDelete }) => {
  if (!assets || assets.length === 0) {
    return (
      <div className={styles.emptyState}>
        <FiFile className={styles.emptyIcon} />
        <p>No assets found.</p>
      </div>
    );
  }

  const getIcon = (category) => {
    switch (category) {
      case 'image':
      case 'logo':
        return <FiImage />;
      case 'video':
        return <FiVideo />;
      default:
        return <FiFile />;
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    const mb = bytes / (1024 * 1024);
    if (mb < 1) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <div className={styles.grid}>
      {assets.map((asset) => (
        <div key={asset._id || asset.id} className={styles.card}>
          <div className={styles.preview}>
            {asset.url && (asset.category === 'image' || asset.category === 'logo') ? (
              <img src={asset.url} alt={asset.name} className={styles.thumbnail} />
            ) : (
              <div className={styles.iconPlaceholder}>
                {getIcon(asset.category)}
              </div>
            )}
            <span className={styles.categoryBadge}>{asset.category}</span>
          </div>
          
          <div className={styles.details}>
            <div className={styles.name} title={asset.name}>{asset.name}</div>
            <div className={styles.meta}>
              <span>{formatSize(asset.size)}</span>
              <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className={styles.actions}>
            <button 
              onClick={() => onDownload(asset._id || asset.id, asset.name)}
              className={styles.actionBtn}
              title="Download"
            >
              <FiDownload />
            </button>
            <button 
              onClick={() => onDelete(asset)}
              className={`${styles.actionBtn} ${styles.deleteBtn}`}
              title="Delete"
            >
              <FiTrash2 />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssetGallery;
