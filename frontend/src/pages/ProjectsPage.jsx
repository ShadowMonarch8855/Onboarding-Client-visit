import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getProjects } from '../api/project.api';
import { useAuth } from '../hooks/useAuth';
import Modal from '../components/Common/Modal';
import ProjectForm from '../components/Projects/ProjectForm';
import StatusBadge from '../components/Common/StatusBadge';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import EmptyState from '../components/Common/EmptyState';
import Pagination from '../components/Common/Pagination';
import styles from './ProjectsPage.module.css';

const ProjectsPage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await getProjects({ 
        page: currentPage, 
        search, 
        status: statusFilter === 'all' ? undefined : statusFilter 
      });
      setProjects(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [currentPage, search, statusFilter]);

  const handleCreateSuccess = () => {
    setIsModalOpen(false);
    fetchProjects();
    toast.success('Project created successfully');
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Projects</h1>
        {isAdmin && (
          <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
            <FiPlus /> New Project
          </button>
        )}
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <FiSearch className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className={styles.searchInput}
          />
        </div>
        <select 
          className={styles.statusFilter}
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="ready_to_start">Ready to Start</option>
          <option value="in_progress">In Progress</option>
          <option value="on_hold">On Hold</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : projects.length === 0 ? (
        <EmptyState 
          icon={<FiSearch />}
          title="No projects found"
          message="Try adjusting your filters or create a new project."
          actionLabel={isAdmin ? "New Project" : ""}
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <>
          <div className={styles.grid}>
            {projects.map(project => (
              <div 
                key={project._id || project.id} 
                className={styles.card}
                onClick={() => navigate(`/projects/${project._id || project.id}`)}
              >
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{project.name}</h3>
                  <StatusBadge status={project.status} />
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Client:</span>
                    <span className={styles.value}>{project.client?.companyName || 'N/A'}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Assigned to:</span>
                    <span className={styles.value}>{project.assignedUser?.name || 'Unassigned'}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Created:</span>
                    <span className={styles.value}>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          )}
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        <ProjectForm onSubmit={handleCreateSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default ProjectsPage;
