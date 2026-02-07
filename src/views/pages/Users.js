import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
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
  CButtonGroup,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle
} from '@coreui/react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', role: '', password: '' });
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/auth/users');
        setUsers(response.data);
      } catch (error) {
        //set a notification for error
        setToastMessage(error.response?.data?.message || 'Failed to fetch users' );
        setToastVisible(true);
        console.error( error.response?.data || error.message);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/register', formData);
      setUsers([...users, response.data.user]);
      setFormData({ name: '', email: '', role: '', password: '' });
      setToastMessage('User added successfully!');
      setToastVisible(true);
    } catch (error) {
        console.error('Failed to add user:', error.response?.data.message);
        setToastMessage(error.response?.data.message || 'Failed to add user');
        setToastVisible(true);
      }
  };

  const confirmDelete = (userId) => {
    setUserToDelete(userId);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/auth/users/${userToDelete}`);
      setUsers(users.filter((user) => user._id !== userToDelete));
      setDeleteModalVisible(false);
      setUserToDelete(null);
      setToastMessage('User deleted successfully!');
      setToastVisible(true);
    } catch (error) {
      console.error('Failed to delete user:', error.response?.data.message);
      setToastMessage(error.response?.data.message || 'Failed to delete user');
      setToastVisible(true);
    }
  };

  const handleEdit = (user) => {
    setUserToEdit(user);
    setFormData({ name: user.name, email: user.email, role: user.role, password: '' });
    setEditModalVisible(true);
  };

  const handleUpdateUser = async () => {
    if (!userToEdit) return;
    try {
      const response = await api.put(`/auth/users/${userToEdit._id}`, formData);
      const updatedUser = response.data.user;
      setUsers(users.map((user) => (user._id === updatedUser._id ? updatedUser : user)));
      setEditModalVisible(false);
      setUserToEdit(null);
      setFormData({ name: '', email: '', role: '', password: '' });
      setToastMessage('User updated successfully!');
      setToastVisible(true);
    } catch (error) {
      console.error('Failed to update user:', error.response?.data.message);
      setToastMessage(error.response?.data.message || 'Failed to update user');
      setToastVisible(true);
    }
  };

  return (
    <CContainer className="mt-4">
      <CRow>
        <CCol md={12}>
          <CCard>
            <CCardHeader>
              <CButton color="primary" onClick={() => setAddModalVisible(true)}>
                Add User
              </CButton>
            </CCardHeader>
            <CCardBody>
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell>Role</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {users.map((user, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{user.name}</CTableDataCell>
                      <CTableDataCell>{user.email}</CTableDataCell>
                      <CTableDataCell>{user.role}</CTableDataCell>
                      <CTableDataCell>
                        <CButtonGroup>
                          <CButton color="info" size="sm" onClick={() => handleEdit(user)}>
                            Edit
                          </CButton>
                          <CButton color="danger" size="sm" onClick={() => confirmDelete(user._id)}>
                            Delete
                          </CButton>
                        </CButtonGroup>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={addModalVisible} onClose={() => setAddModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Add User</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleAddUser}>
            <CFormInput
              className="mb-3"
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <CFormInput
              className="mb-3"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <select
              className="form-select mb-3"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Role</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
            <CFormInput
              className="mb-3"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <CButton type="submit" color="primary">
              Add User
            </CButton>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setAddModalVisible(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={editModalVisible} onClose={() => setEditModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Edit User</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              className="mb-3"
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <CFormInput
              className="mb-3"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <select
              className="form-select mb-3"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Role</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleUpdateUser}>
            Update
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Confirm Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to delete this user?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={handleDelete}>
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

export default Users;