import React from 'react';
import styles from './StepWizard.module.css';

const StepWizard = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className={styles.wizard}>
      {steps.map((step, index) => (
        <div key={step._id || step.id || index} className={`${styles.stepWrapper} ${index <= currentStep ? styles.active : ''}`}>
          <div className={styles.circle} onClick={() => onStepClick(index)}>
            {index + 1}
          </div>
          <span className={styles.label}>{step.stepTitle || step.title}</span>
          {index < steps.length - 1 && <div className={styles.line}></div>}
        </div>
      ))}
    </div>
  );
};

export default StepWizard;
