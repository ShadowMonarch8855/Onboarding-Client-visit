import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getInvoices, createInvoice, sendInvoice } from '../api/invoice.api';
import { getProjects } from '../api/project.api';
import InvoiceTable from '../components/Invoices/InvoiceTable';
import InvoiceForm from '../components/Invoices/InvoiceForm';
import Modal from '../components/Common/Modal';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import EmptyState from '../components/Common/EmptyState';
import Pagination from '../components/Common/Pagination';
import styles from './InvoicesPage.module.css';

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await getInvoices({ 
        page: currentPage, 
        search, 
        status: statusFilter === 'all' ? undefined : statusFilter 
      });
      setInvoices(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data || []);
    } catch (error) {
      console.error('Failed to fetch projects for invoice form', error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [currentPage, search, statusFilter]);

  useEffect(() => {
    if (isModalOpen && projects.length === 0) {
      fetchProjects();
    }
  }, [isModalOpen]);

  const handleCreateInvoice = async (data) => {
    try {
      setFormLoading(true);
      await createInvoice(data);
      toast.success('Invoice created successfully');
      setIsModalOpen(false);
      fetchInvoices();
    } catch (error) {
      toast.error('Failed to create invoice');
    } finally {
      setFormLoading(false);
    }
  };

  const handleSendInvoice = async (id) => {
    try {
      await sendInvoice(id);
      toast.success('Invoice sent successfully');
      fetchInvoices();
    } catch (error) {
      toast.error('Failed to send invoice');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Invoices</h1>
        <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
          <FiPlus /> Create Invoice
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <FiSearch className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search by invoice number..." 
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
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : invoices.length === 0 ? (
        <EmptyState 
          icon={<FiSearch />}
          title="No invoices found"
          message="Try adjusting your filters or create a new invoice."
          actionLabel="Create Invoice"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <>
          <InvoiceTable 
            invoices={invoices} 
            onSend={handleSendInvoice} 
            onView={(id) => toast('View details not yet implemented')} 
          />
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          )}
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Invoice">
        <InvoiceForm 
          projects={projects} 
          onSubmit={handleCreateInvoice} 
          onCancel={() => setIsModalOpen(false)} 
          loading={formLoading} 
        />
      </Modal>
    </div>
  );
};

export default InvoicesPage;
