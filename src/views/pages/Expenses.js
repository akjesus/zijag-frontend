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

const Expenses = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '' });
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of expenses per page

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await api.get('/expenses'); // Fetch all expenses from the backend
        setExpenses(response.data);
      } catch (error) {
        console.error('Failed to fetch expenses:', error.response?.data || error.message);
      }
    };

    fetchExpenses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({ ...newExpense, [name]: value });
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/expenses', newExpense);
      setExpenses((prevExpenses) => [...prevExpenses, response.data.expense]);
      setModalVisible(false);
      setNewExpense({ description: '', amount: '' });
    } catch (error) {
      console.error('Failed to add expense:', error.response?.data || error.message);
    }
  };

  const handleEditClick = (expense) => {
    setExpenseToEdit(expense);
    setEditModalVisible(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseToEdit({ ...expenseToEdit, [name]: value });
  };

  const handleUpdateExpense = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/expenses/${expenseToEdit._id}`, expenseToEdit);
      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense._id === expenseToEdit._id ? response.data.expense : expense
        )
      );
      setEditModalVisible(false);
      setExpenseToEdit(null);
    } catch (error) {
      console.error('Failed to update expense:', error.response?.data || error.message);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExpenses = expenses.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(expenses.length / itemsPerPage);

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
                Add Expense
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
                    <CTableHeaderCell>Made By</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {currentExpenses.map((expense, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{indexOfFirstItem + index + 1}</CTableDataCell>
                      <CTableDataCell>{expense.description}</CTableDataCell>
                      <CTableDataCell>{expense.amount}</CTableDataCell>
                      <CTableDataCell>{new Date(expense.createdAt).toLocaleDateString()}</CTableDataCell>
                      <CTableDataCell>{expense.userId.name}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditClick(expense)}
                        >
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
          <CModalTitle>Add Expense</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleAddExpense}>
            <CFormInput
              className="mb-3"
              type="text"
              name="description"
              placeholder="Description"
              value={newExpense.description}
              onChange={handleInputChange}
              required
            />
            <CFormInput
              className="mb-3"
              type="number"
              name="amount"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={handleInputChange}
              required
            />
            <CButton type="submit" color="primary">
              Add Expense
            </CButton>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={editModalVisible} onClose={() => setEditModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Edit Expense</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleUpdateExpense}>
            <CFormInput
              className="mb-3"
              type="text"
              name="description"
              placeholder="Description"
              value={expenseToEdit?.description || ''}
              onChange={handleEditInputChange}
              required
            />
            <CFormInput
              className="mb-3"
              type="number"
              name="amount"
              placeholder="Amount"
              value={expenseToEdit?.amount || ''}
              onChange={handleEditInputChange}
              required
            />
            <CButton type="submit" color="primary">
              Update Expense
            </CButton>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default Expenses;