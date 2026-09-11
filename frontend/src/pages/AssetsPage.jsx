import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAssets, uploadAsset, downloadAsset, deleteAsset } from '../api/asset.api';
import { getProjects } from '../api/project.api';
import FileUploader from '../components/Assets/FileUploader';
import AssetGallery from '../components/Assets/AssetGallery';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ConfirmDialog from '../components/Common/ConfirmDialog';
import styles from './AssetsPage.module.css';

const AssetsPage = () => {
  const [assets, setAssets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [uploadLoading, setUploadLoading] = useState(false);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const res = await getAssets({ category: categoryFilter === 'all' ? undefined : categoryFilter });
      setAssets(res.data || []);
    } catch (error) {
      toast.error('Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data?.projects || res.data || []);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    }
  };

  useEffect(() => {
    fetchAssets();
    fetchProjects();
  }, [categoryFilter]);

  const handleUpload = async (formData) => {
    try {
      setUploadLoading(true);
      await uploadAsset(formData);
      toast.success('Asset uploaded successfully');
      fetchAssets();
    } catch (error) {
      toast.error('Failed to upload asset');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDownload = async (id, filename) => {
    try {
      const res = await downloadAsset(id);
      // Create a blob and download link (standard implementation)
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename || 'download');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      toast.error('Failed to download asset');
    }
  };

  const promptDelete = (asset) => {
    setAssetToDelete(asset);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteAsset(assetToDelete._id || assetToDelete.id);
      toast.success('Asset deleted successfully');
      fetchAssets();
    } catch (error) {
      toast.error('Failed to delete asset');
    } finally {
      setIsConfirmOpen(false);
      setAssetToDelete(null);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Asset Management</h1>
      </div>

      <div className={styles.uploadSection}>
        <FileUploader 
          projects={projects} 
          onUpload={handleUpload} 
          loading={uploadLoading} 
        />
      </div>

      <div className={styles.controls}>
        <select 
          className={styles.categoryFilter}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="logo">Logos</option>
          <option value="document">Documents</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="other">Other</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <AssetGallery 
          assets={assets} 
          onDownload={handleDownload} 
          onDelete={promptDelete} 
        />
      )}

      <ConfirmDialog 
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Asset"
        message={`Are you sure you want to delete ${assetToDelete?.name || 'this file'}? This action cannot be undone.`}
        variant="danger"
      />
    </div>
  );
};

export default AssetsPage;
