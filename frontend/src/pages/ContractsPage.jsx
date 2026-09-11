import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getContracts, createContract, sendContract, signContract } from '../api/contract.api';
import { getProjects } from '../api/project.api';
import Modal from '../components/Common/Modal';
import ContractUpload from '../components/Contracts/ContractUpload';
import SignaturePanel from '../components/Contracts/SignaturePanel';
import StatusBadge from '../components/Common/StatusBadge';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import EmptyState from '../components/Common/EmptyState';
import styles from './ContractsPage.module.css';

const ContractsPage = () => {
  const [contracts, setContracts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const res = await getContracts();
      setContracts(res.data || []);
    } catch (error) {
      toast.error('Failed to load contracts');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data?.projects || res.data || []);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    }
  };

  useEffect(() => {
    fetchContracts();
    fetchProjects();
  }, []);

  const handleUploadContract = async (data) => {
    try {
      await createContract(data);
      toast.success('Contract uploaded successfully');
      setIsUploadModalOpen(false);
      fetchContracts();
    } catch (error) {
      toast.error('Failed to upload contract');
    }
  };

  const handleSendContract = async (id) => {
    try {
      await sendContract(id);
      toast.success('Contract sent for signature');
      fetchContracts();
    } catch (error) {
      toast.error('Failed to send contract');
    }
  };

  const openSignModal = (contract) => {
    setSelectedContract(contract);
    setIsSignModalOpen(true);
  };

  const handleSignContract = async (signatureData) => {
    try {
      await signContract(selectedContract._id || selectedContract.id, signatureData);
      toast.success('Contract signed successfully');
      setIsSignModalOpen(false);
      fetchContracts();
    } catch (error) {
      toast.error('Failed to sign contract');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Contracts</h1>
        <button className={styles.addButton} onClick={() => setIsUploadModalOpen(true)}>
          <FiPlus /> Create Contract
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : contracts.length === 0 ? (
        <EmptyState 
          icon={<FiPlus />}
          title="No contracts found"
          message="Upload a contract to get started."
          actionLabel="Create Contract"
          onAction={() => setIsUploadModalOpen(true)}
        />
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Created Date</th>
                <th>Version</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map(contract => (
                <tr key={contract._id || contract.id}>
                  <td>{contract.project?.name || 'Unknown Project'}</td>
                  <td>{new Date(contract.createdAt).toLocaleDateString()}</td>
                  <td>v{contract.version || 1}</td>
                  <td><StatusBadge status={contract.status} /></td>
                  <td className={styles.actions}>
                    {contract.status === 'draft' && (
                      <button onClick={() => handleSendContract(contract._id || contract.id)} className={styles.actionBtn}>
                        Send
                      </button>
                    )}
                    {contract.status === 'sent' && (
                      <button onClick={() => openSignModal(contract)} className={styles.actionBtn}>
                        Sign
                      </button>
                    )}
                    <button className={styles.viewBtn}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Upload Contract">
        <ContractUpload 
          projects={projects} 
          onUpload={handleUploadContract} 
          onCancel={() => setIsUploadModalOpen(false)} 
        />
      </Modal>

      <Modal isOpen={isSignModalOpen} onClose={() => setIsSignModalOpen(false)} title="Sign Contract">
        {selectedContract && (
          <SignaturePanel 
            contract={selectedContract} 
            onSign={handleSignContract} 
            onCancel={() => setIsSignModalOpen(false)} 
          />
        )}
      </Modal>
    </div>
  );
};

export default ContractsPage;
