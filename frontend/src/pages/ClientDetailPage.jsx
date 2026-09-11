import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiEdit, FiArrowLeft, FiMail, FiPhone } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getClient } from '../api/client.api';
import { getProjects } from '../api/project.api';
import Modal from '../components/Common/Modal';
import ClientForm from '../components/Clients/ClientForm';
import StatusBadge from '../components/Common/StatusBadge';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import styles from './ClientDetailPage.module.css';

const ClientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      const [clientRes, projectsRes] = await Promise.all([
        getClient(id),
        getProjects({ clientId: id })
      ]);
      setClient(clientRes.data);
      setProjects(projectsRes.data?.projects || projectsRes.data || []);
    } catch (error) {
      toast.error('Failed to load client details');
      navigate('/clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientData();
  }, [id]);

  const handleEditComplete = () => {
    setIsEditModalOpen(false);
    fetchClientData();
  };

  if (loading) return <div className={styles.loadingContainer}><LoadingSpinner /></div>;
  if (!client) return null;

  return (
    <div className={styles.pageContainer}>
      <button onClick={() => navigate('/clients')} className={styles.backButton}>
        <FiArrowLeft /> Back to Clients
      </button>

      <div className={styles.header}>
        <div>
          <h1 className={styles.companyName}>{client.companyName}</h1>
          <StatusBadge status={client.status || 'active'} />
        </div>
        <button onClick={() => setIsEditModalOpen(true)} className={styles.editButton}>
          <FiEdit /> Edit Client
        </button>
      </div>

      <div className={styles.grid}>
        <div className={styles.infoCard}>
          <h2 className={styles.cardTitle}>Contact Information</h2>
          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Primary Contact</span>
              <span className={styles.infoValue}>{client.contactName}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}><FiMail className={styles.icon}/> Email</span>
              <span className={styles.infoValue}>{client.email}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}><FiPhone className={styles.icon}/> Phone</span>
              <span className={styles.infoValue}>{client.phone || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className={styles.projectsCard}>
          <h2 className={styles.cardTitle}>Projects ({projects.length})</h2>
          {projects.length === 0 ? (
            <p className={styles.noProjects}>No projects found for this client.</p>
          ) : (
            <div className={styles.projectList}>
              {projects.map(project => (
                <Link to={`/projects/${project._id || project.id}`} key={project._id || project.id} className={styles.projectItem}>
                  <div>
                    <div className={styles.projectName}>{project.name}</div>
                    <div className={styles.projectDate}>Added on {new Date(project.createdAt).toLocaleDateString()}</div>
                  </div>
                  <StatusBadge status={project.status} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Client">
        <ClientForm client={client} onSubmit={handleEditComplete} onCancel={() => setIsEditModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default ClientDetailPage;
