import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getClients, createClient, updateClient, archiveClient } from '../api/client.api';
import ClientTable from '../components/Clients/ClientTable';
import ClientForm from '../components/Clients/ClientForm';
import Modal from '../components/Common/Modal';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ConfirmDialog from '../components/Common/ConfirmDialog';
import EmptyState from '../components/Common/EmptyState';
import Pagination from '../components/Common/Pagination';
import styles from './ClientsPage.module.css';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [clientToArchive, setClientToArchive] = useState(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await getClients({ page: currentPage, search });
      setClients(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [currentPage, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleAddClient = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      if (editingClient) {
        await updateClient(editingClient._id, formData);
        toast.success('Client updated successfully');
      } else {
        await createClient(formData);
        toast.success('Client created successfully');
      }
      setIsModalOpen(false);
      setEditingClient(null);
      fetchClients();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save client');
    } finally {
      setFormLoading(false);
    }
  };

  const promptArchive = (client) => {
    setClientToArchive(client);
    setIsConfirmOpen(true);
  };

  const confirmArchive = async () => {
    try {
      await archiveClient(clientToArchive._id);
      toast.success('Client archived successfully');
      fetchClients();
    } catch (error) {
      toast.error('Failed to archive client');
    } finally {
      setIsConfirmOpen(false);
      setClientToArchive(null);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Clients</h1>
        <button className={styles.addButton} onClick={handleAddClient}>
          <FiPlus /> Add Client
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <FiSearch className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search by company name..." 
            value={search}
            onChange={handleSearch}
            className={styles.searchInput}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : clients.length === 0 ? (
        <EmptyState 
          icon={<FiSearch />}
          title="No clients found"
          message={search ? "Try adjusting your search filters." : "Get started by adding your first client."}
          actionLabel={!search ? "Add Client" : ""}
          onAction={handleAddClient}
        />
      ) : (
        <>
          <ClientTable 
            clients={clients} 
            onEdit={handleEditClient} 
            onArchive={promptArchive} 
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

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingClient ? "Edit Client" : "Add New Client"}
      >
        <ClientForm 
          initialData={editingClient} 
          onSubmit={handleFormSubmit} 
          onCancel={() => setIsModalOpen(false)}
          loading={formLoading}
        />
      </Modal>

      <ConfirmDialog 
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmArchive}
        title="Archive Client"
        message={`Are you sure you want to archive ${clientToArchive?.companyName || 'this client'}? They will no longer appear in active lists.`}
        variant="danger"
      />
    </div>
  );
};

export default ClientsPage;
