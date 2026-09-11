import React, { useState } from 'react';
import { FiCheckCircle, FiClock, FiFileText, FiKey, FiHelpCircle, FiCheck, FiSend } from 'react-icons/fi';
import styles from './StepCard.module.css';

const StepCard = ({ step, isActive, onUpdate }) => {
  const [inputText, setInputText] = useState(step?.dataJson?.notes || '');
  const [submitting, setSubmitting] = useState(false);

  if (!step) return null;

  const isCompleted = step.status === 'completed';

  const getTypeIcon = (type) => {
    switch (type) {
      case 'form': return <FiFileText className={styles.typeIcon} />;
      case 'credentials': return <FiKey className={styles.typeIcon} />;
      case 'questionnaire': return <FiHelpCircle className={styles.typeIcon} />;
      case 'approval': return <FiCheck className={styles.typeIcon} />;
      default: return <FiFileText className={styles.typeIcon} />;
    }
  };

  const handleComplete = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await onUpdate({
        status: 'completed',
        dataJson: {
          notes: inputText,
          updatedAt: new Date().toISOString()
        }
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`${styles.card} ${isActive ? styles.activeCard : ''} ${isCompleted ? styles.completedCard : ''}`}>
      <div className={styles.header}>
        <div className={styles.titleInfo}>
          <span className={styles.typeBadge}>
            {getTypeIcon(step.stepType || step.type)}
            {step.stepType ? step.stepType.toUpperCase() : 'STEP'}
          </span>
          <h3 className={styles.stepTitle}>{step.stepTitle || step.title}</h3>
          {(step.required || step.isRequired) && <span className={styles.requiredBadge}>Required</span>}
        </div>
        <div className={styles.statusBadge}>
          {isCompleted ? (
            <span className={styles.completedPill}><FiCheckCircle /> Completed</span>
          ) : (
            <span className={styles.pendingPill}><FiClock /> Pending</span>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <p className={styles.description}>{step.stepDescription || step.description || 'Complete the required information for this onboarding milestone.'}</p>

        <form onSubmit={handleComplete} className={styles.formArea}>
          <label className={styles.inputLabel}>
            {step.stepType === 'credentials' && 'Credentials / Verification Details:'}
            {step.stepType === 'document' && 'Asset & Document Links / Submission Notes:'}
            {step.stepType === 'questionnaire' && 'Strategy Answers & Stakeholder Inputs:'}
            {step.stepType === 'approval' && 'Stakeholder Sign-Off Confirmation:'}
            {(!step.stepType || step.stepType === 'form' || step.stepType === 'general') && 'Milestone Details & Notes:'}
          </label>
          <textarea
            className={styles.textarea}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={step.stepPlaceholder || step.placeholder || 'Type required inputs, links, or notes for this step...'}
            rows={4}
            disabled={isCompleted}
          />

          <div className={styles.actionRow}>
            {isCompleted ? (
              <button 
                type="button" 
                onClick={() => onUpdate({ status: 'pending' })} 
                className={styles.reopenBtn}
              >
                Reopen & Edit Step
              </button>
            ) : (
              <button 
                type="submit" 
                disabled={submitting} 
                className={styles.completeBtn}
              >
                <FiSend /> {submitting ? 'Saving...' : 'Submit & Mark Completed'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default StepCard;
