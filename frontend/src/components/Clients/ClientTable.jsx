import React from 'react';
import Table from '../Common/Table';
import StatusBadge from '../Common/StatusBadge';
import { FiEdit2, FiArchive } from 'react-icons/fi';
import styles from './ClientTable.module.css';
import { Link } from 'react-router-dom';

const ClientTable = ({ clients, loading, onEdit, onArchive }) => {
  const columns = [
    { header: 'Company', accessor: 'companyName', render: (row) => <Link to={`/clients/${row._id}`} className={styles.link}>{row.companyName}</Link> },
    { header: 'Contact', accessor: 'contactName' },
    { header: 'Email', accessor: 'email' },
    { header: 'Status', render: (row) => <StatusBadge status={row.status || 'active'} /> },
    {
      header: 'Actions',
      render: (row) => (
        <div className={styles.actions}>
          <button onClick={() => onEdit(row)} className={styles.iconBtn} title="Edit"><FiEdit2 /></button>
          <button onClick={() => onArchive(row)} className={styles.iconBtn} title="Archive"><FiArchive /></button>
        </div>
      )
    }
  ];

  return <Table columns={columns} data={clients} loading={loading} emptyMessage="No clients found." />;
};

export default ClientTable;
