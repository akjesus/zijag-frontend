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
} from '@coreui/react';
import api from '../../api/axios';

const Income = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [income, setIncome] = useState([]);
  const [newIncome, setNewIncome] = useState({ description: '', amount: '' });
  const [currentPage, setCurrentPage] = useState(1);
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

  const handleAddIncome = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/income', newIncome);
      setIncome((prevIncome) => [...prevIncome, response.data]);
      setModalVisible(false);
      setNewIncome({ description: '', amount: '' });
    } catch (error) {
      console.error('Failed to add income:', error.response?.data || error.message);
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
                        <CButton color="warning" size="sm" className="me-2">
                          Edit
                        </CButton>
                        <CButton color="danger" size="sm">
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
          <CModalTitle>Add Income</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleAddIncome}>
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
            <CButton type="submit" color="primary">
              Add Income
            </CButton>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default Income;