import React from 'react';
import { FiEye, FiSend } from 'react-icons/fi';
import StatusBadge from '../Common/StatusBadge';
import styles from './InvoiceTable.module.css';

const InvoiceTable = ({ invoices, onSend, onView }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Project Name</th>
            <th>Amount</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map(invoice => (
            <tr key={invoice._id || invoice.id}>
              <td className={styles.invoiceNumber}>{invoice.invoiceNumber || 'INV-XXX'}</td>
              <td>{invoice.project?.name || 'Unknown Project'}</td>
              <td className={styles.amount}>{formatCurrency(invoice.amount)}</td>
              <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
              <td><StatusBadge status={invoice.status} /></td>
              <td className={styles.actions}>
                <button 
                  onClick={() => onView(invoice._id || invoice.id)} 
                  className={styles.iconBtn} 
                  title="View"
                >
                  <FiEye />
                </button>
                {invoice.status === 'draft' && (
                  <button 
                    onClick={() => onSend(invoice._id || invoice.id)} 
                    className={styles.iconBtn} 
                    title="Send to Client"
                  >
                    <FiSend />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;
