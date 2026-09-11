import React, { useState } from 'react';
import styles from './FileUploader.module.css';

const FileUploader = ({ projects, onUpload, loading }) => {
  const [file, setFile] = useState(null);
  const [projectId, setProjectId] = useState('');
  const [category, setCategory] = useState('document');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);
    formData.append('category', category);

    // Mocking a proper FormData submission object for this context
    onUpload({ file: file.name, projectId, category });
    
    // Reset form after upload intent
    setFile(null);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.uploaderForm}>
      <div 
        className={styles.dropzone} 
        onDragOver={handleDragOver} 
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          onChange={handleFileChange} 
          className={styles.fileInput} 
          id="fileUpload"
        />
        <label htmlFor="fileUpload" className={styles.dropLabel}>
          {file ? (
            <div className={styles.fileInfo}>
              <span className={styles.fileName}>{file.name}</span>
              <span className={styles.fileSize}>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          ) : (
            <div className={styles.uploadPrompt}>
              <span className={styles.uploadIcon}>📁</span>
              <p>Drag & drop a file here, or click to browse</p>
            </div>
          )}
        </label>
      </div>

      <div className={styles.formControls}>
        <div className={styles.formGroup}>
          <label>Project</label>
          <select value={projectId} onChange={(e) => setProjectId(e.target.value)} required>
            <option value="">Select a project...</option>
            {projects.map(p => (
              <option key={p._id || p.id} value={p._id || p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="logo">Logo</option>
            <option value="document">Document</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button type="submit" className={styles.uploadBtn} disabled={!file || loading}>
          {loading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>
    </form>
  );
};

export default FileUploader;
