import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getInstance, updateStep, submitOnboarding, reviewOnboarding } from '../api/onboarding.api';
import { useAuth } from '../hooks/useAuth';
import ProgressBar from '../components/Onboarding/ProgressBar';
import StepWizard from '../components/Onboarding/StepWizard';
import StepCard from '../components/Onboarding/StepCard';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import StatusBadge from '../components/Common/StatusBadge';
import styles from './OnboardingPage.module.css';

const OnboardingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, isTeamMember } = useAuth();
  
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  const fetchInstance = async () => {
    try {
      setLoading(true);
      const res = await getInstance(id);
      setInstance(res.data);
    } catch (error) {
      toast.error('Failed to load onboarding data');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstance();
  }, [id]);

  const handleUpdateStep = async (stepId, data) => {
    try {
      await updateStep(id, stepId, data);
      toast.success('Step updated');
      fetchInstance();
    } catch (error) {
      toast.error('Failed to update step');
    }
  };

  const handleSubmit = async () => {
    try {
      await submitOnboarding(id);
      toast.success('Onboarding submitted successfully');
      fetchInstance();
    } catch (error) {
      toast.error('Failed to submit onboarding');
    }
  };

  const handleReview = async (status) => {
    try {
      await reviewOnboarding(id, { status, comments: reviewComment });
      toast.success(`Onboarding ${status}`);
      setReviewComment('');
      fetchInstance();
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  if (loading) return <div className={styles.loadingContainer}><LoadingSpinner /></div>;
  if (!instance) return null;

  const steps = instance.steps || [];
  const currentStep = steps[currentStepIndex];
  const allRequiredCompleted = steps.filter(s => s.required || s.isRequired).every(s => s.status === 'completed');

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Onboarding Setup</h1>
          <p className={styles.subtitle}>Project: {instance.project?.name}</p>
        </div>
        <StatusBadge status={instance.status} />
      </div>

      <div className={styles.progressSection}>
        <ProgressBar progress={instance.progress || 0} />
      </div>

      <div className={styles.mainContent}>
        <div className={styles.sidebar}>
          <StepWizard 
            steps={steps} 
            currentStep={currentStepIndex} 
            onStepClick={setCurrentStepIndex} 
          />
        </div>

        <div className={styles.stepContent}>
          {currentStep && (
            <StepCard 
              step={currentStep} 
              isActive={true} 
              onUpdate={(data) => handleUpdateStep(currentStep._id || currentStep.id, data)} 
            />
          )}

          <div className={styles.actions}>
            {instance.status === 'in_progress' && (
              <button 
                onClick={handleSubmit} 
                disabled={!allRequiredCompleted}
                className={styles.submitBtn}
              >
                Submit Onboarding
              </button>
            )}
          </div>

          {(isAdmin || isTeamMember) && instance.status === 'submitted' && (
            <div className={styles.reviewPanel}>
              <h3>Review Onboarding</h3>
              <textarea 
                value={reviewComment} 
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Add comments for requested changes..."
                className={styles.reviewTextarea}
              />
              <div className={styles.reviewActions}>
                <button onClick={() => handleReview('changes_requested')} className={styles.rejectBtn}>
                  Request Changes
                </button>
                <button onClick={() => handleReview('approved')} className={styles.approveBtn}>
                  Approve
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
