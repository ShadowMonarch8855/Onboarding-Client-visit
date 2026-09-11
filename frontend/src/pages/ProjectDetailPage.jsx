import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getProject, startOnboarding } from '../api/project.api';
import { getTemplates } from '../api/onboarding.api';
import Modal from '../components/Common/Modal';
import ProjectTabs from '../components/Projects/ProjectTabs';
import StatusBadge from '../components/Common/StatusBadge';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import styles from './ProjectDetailPage.module.css';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [templates, setTemplates] = useState([]);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [startingOnboarding, setStartingOnboarding] = useState(false);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await getProject(id);
      setProject(res.data);
    } catch (error) {
      toast.error('Failed to load project details');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await getTemplates();
      setTemplates(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedTemplateId(res.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching onboarding templates', error);
    }
  };

  useEffect(() => {
    fetchProject();
    fetchTemplates();
  }, [id]);

  const handleStartOnboarding = async () => {
    try {
      setStartingOnboarding(true);
      const res = await startOnboarding(id, selectedTemplateId || 'default-template');
      toast.success('Onboarding workflow initiated!');
      setIsTemplateModalOpen(false);
      setProject({ ...project, onboardingInstance: res.data._id || res.data.id });
      setActiveTab('Onboarding');
      navigate(`/onboarding/${res.data._id || res.data.id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to start onboarding');
    } finally {
      setStartingOnboarding(false);
    }
  };

  if (loading) return <div className={styles.loadingContainer}><LoadingSpinner /></div>;
  if (!project) return null;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>{project.name}</h1>
          <div className={styles.metaRow}>
            <span className={styles.clientName}>{project.client?.companyName}</span>
            <span className={styles.dot}>•</span>
            <StatusBadge status={project.status} />
            <span className={styles.dot}>•</span>
            <span className={styles.assignee}>Assigned: {project.assignedUser?.name || 'Unassigned'}</span>
          </div>
        </div>
      </div>

      <ProjectTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className={styles.tabContent}>
        {activeTab === 'Overview' && (
          <div className={styles.overviewTab}>
            <div className={styles.card}>
              <h3>Project Details</h3>
              <p><strong>Description:</strong> {project.description || 'No description provided.'}</p>
              <p><strong>Created:</strong> {new Date(project.createdAt).toLocaleDateString()}</p>
              {!project.onboardingInstance && (
                <button className={styles.primaryButton} onClick={() => setIsTemplateModalOpen(true)}>
                  Start Onboarding Process
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Onboarding' && (
          <div className={styles.onboardingTab}>
            {project.onboardingInstance ? (
              <div className={styles.card}>
                <h3>Onboarding Process Active</h3>
                <p>Click below to continue the onboarding wizard.</p>
                <button 
                  className={styles.primaryButton}
                  onClick={() => navigate(`/onboarding/${project.onboardingInstance}`)}
                >
                  Go to Onboarding Wizard
                </button>
              </div>
            ) : (
              <div className={styles.emptyTab}>
                <p>Onboarding hasn't been started yet.</p>
                <button className={styles.primaryButton} onClick={() => setIsTemplateModalOpen(true)}>
                  Choose Template & Start Onboarding
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Invoices' && (
          <div className={styles.invoicesTab}>
            <h3>Invoices</h3>
            <p>Invoice management goes here.</p>
          </div>
        )}

        {activeTab === 'Contracts' && (
          <div className={styles.contractsTab}>
            <h3>Contracts</h3>
            <p>Contract management goes here.</p>
          </div>
        )}

        {activeTab === 'Assets' && (
          <div className={styles.assetsTab}>
            <h3>Assets</h3>
            <p>Asset gallery and uploader go here.</p>
          </div>
        )}

        {activeTab === 'Information' && (
          <div className={styles.infoTab}>
            <h3>Business Information</h3>
            <p>Client information forms go here.</p>
          </div>
        )}
      </div>

      <Modal isOpen={isTemplateModalOpen} onClose={() => setIsTemplateModalOpen(false)} title="Select Onboarding Template Blueprint">
        <div className={styles.modalContent}>
          <p className={styles.modalSub}>Select the workflow template that fits this engagement:</p>
          
          <div className={styles.templateList}>
            {templates.map(tmpl => (
              <div 
                key={tmpl._id} 
                className={`${styles.templateOption} ${selectedTemplateId === tmpl._id ? styles.selectedOption : ''}`}
                onClick={() => setSelectedTemplateId(tmpl._id)}
              >
                <div className={styles.optionHeader}>
                  <h4 className={styles.tmplName}>{tmpl.name}</h4>
                  <span className={styles.tmplBadge}>{(tmpl.steps || []).length} Milestones</span>
                </div>
                <p className={styles.tmplDesc}>{tmpl.description}</p>
                <div className={styles.stepsPreview}>
                  {(tmpl.steps || []).slice(0, 4).map((s, idx) => (
                    <span key={idx} className={styles.stepTag}>
                      {idx + 1}. {s.title}
                    </span>
                  ))}
                  {(tmpl.steps || []).length > 4 && <span className={styles.stepTag}>+{tmpl.steps.length - 4} more...</span>}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.modalActions}>
            <button type="button" onClick={() => setIsTemplateModalOpen(false)} className={styles.cancelBtn}>Cancel</button>
            <button 
              type="button" 
              onClick={handleStartOnboarding} 
              disabled={startingOnboarding || !selectedTemplateId} 
              className={styles.primaryButton}
            >
              {startingOnboarding ? 'Initializing Workflow...' : 'Apply Template & Launch'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectDetailPage;
