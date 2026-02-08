import React, { useState, useEffect } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CToast,
  CToastBody,
  CToastClose,
  CToaster,
} from '@coreui/react';
import api from '../../api/axios';

const Income = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [income, setIncome] = useState([]);
  const [newIncome, setNewIncome] = useState({ description: '', amount: '' });
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('')
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const itemsPerPage = 10; // Number of income entries per page

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const response = await api.get('/income'); // Fetch all income from the backend
        setIncome(response.data);
      } catch (error) {
        console.error('Failed to fetch income:', error.response?.data || error.message);
      }
    };

    fetchIncome();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewIncome({ ...newIncome, [name]: value });
  };

  const showToast = (message, color) => {
    setToast({ visible: true, message, color });
    setTimeout(() => setToast({ visible: false, message: '', color: '' }), 3000);
  };

  const handleAddOrUpdateIncome = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Start spinner
    try {
      if (editingId) {
        // Update existing income
        const response = await api.put(`/income/${editingId}`, newIncome);
        setIncome((prevIncome) =>
          prevIncome.map((item) => (item._id === editingId ? response.data.income : item))
        );
        setToastMessage('Income updated successfully!');
        setToastVisible(true);
      } else {
        // Add new income
        const response = await api.post('/income', newIncome);
        setIncome((prevIncome) => [...prevIncome, response.data.income]);
        setToastMessage('Income added successfully!');
        setToastVisible(true);
      }
      setModalVisible(false);
      setNewIncome({ description: '', amount: '' });
      setEditingId(null); // Reset editing ID
    } catch (error) {
      console.error('Failed to save income:', error.response?.data || error.message);
      setToastMessage('Failed to save income');
      setToastVisible(true);
    } finally {
      setIsSubmitting(false); // Stop spinner
    }
  };

  const handleEditIncome = (id) => {
    const incomeToEdit = income.find((item) => item._id === id);
    if (incomeToEdit) {
      setNewIncome({ description: incomeToEdit.description, amount: incomeToEdit.amount });
      setModalVisible(true);
      setEditingId(id); // Track the ID being edited
    }
  };

  const confirmDelete = (incomeId) => {
    setIncomeToDelete(incomeId);
    setDeleteModalVisible(true);
  };

  const handleDeleteIncome = async () => {
    if (!incomeToDelete) return;
    try {
      await api.delete(`/income/${incomeToDelete}`);
      setIncome((prevIncome) => prevIncome.filter((item) => item._id !== incomeToDelete));
      setDeleteModalVisible(false);
      setIncomeToDelete(null);
      setToastMessage('Income deleted successfully!');
      setToastVisible(true);
    } catch (error) {
      console.error('Failed to delete income:', error.response?.data || error.message);
      showToast('Failed to delete income', 'danger');
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentIncome = income.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(income.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <CContainer className="mt-4">
      <CRow>
        <CCol md={12}>
          <CCard>
            <CCardHeader>
              <CButton color="primary" onClick={() => setModalVisible(true)}>
                Add Income
              </CButton>
            </CCardHeader>
            <CCardBody>
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Description</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Created By</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {currentIncome.map((item, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{indexOfFirstItem + index + 1}</CTableDataCell>
                      <CTableDataCell>{item.description}</CTableDataCell>
                      <CTableDataCell>{item.amount}</CTableDataCell>
                      <CTableDataCell>{new Date(item.createdAt).toLocaleDateString()}</CTableDataCell>
                      <CTableDataCell>{item.userId.name}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditIncome(item._id)}
                        >
                          Edit
                        </CButton>
                        <CButton
                          color="danger"
                          size="sm"
                          onClick={() => confirmDelete(item._id)}
                        >
                          Delete
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  Page {currentPage} of {totalPages}
                </div>
                <div>
                  {[...Array(totalPages)].map((_, index) => (
                    <CButton
                      key={index}
                      color={currentPage === index + 1 ? 'primary' : 'secondary'}
                      size="sm"
                      className="me-2"
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </CButton>
                  ))}
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>{editingId ? 'Edit' : 'Add'} Income</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleAddOrUpdateIncome}>
            <CFormInput
              className="mb-3"
              type="text"
              name="description"
              placeholder="Description"
              value={newIncome.description}
              onChange={handleInputChange}
              required
            />
            <CFormInput
              className="mb-3"
              type="number"
              name="amount"
              placeholder="Amount"
              value={newIncome.amount}
              onChange={handleInputChange}
              required
            />
            <CButton type="submit" color="primary" disabled={isSubmitting}>
              {isSubmitting ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : editingId ? 'Update' : 'Add'} Income
            </CButton>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Confirm Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to delete this income?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={handleDeleteIncome}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>

      <CToaster placement="top-end">
              {toastVisible && (
                <CToast autohide={true} visible={toastVisible} onClose={() => setToastVisible(false)}>
                  <CToastBody>
                    {toastMessage}
                    <CToastClose onClick={() => setToastVisible(false)} />
                  </CToastBody>
                </CToast>
              )}
            </CToaster>
    </CContainer>
  );
};

export default Income;