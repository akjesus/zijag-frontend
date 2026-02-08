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
  CToaster,
  CToast,
  CToastBody,
  CToastClose,
} from '@coreui/react';
import api from '../../api/axios'

const Inventory = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [inventories, setInventories] = useState([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newInventory, setNewInventory] = useState({ name: '', quantity: '', price: '' });
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [inventoryToDelete, setInventoryToDelete] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false); // Add loading state
  const itemsPerPage = 10; // Number of inventory items per page

  useEffect(() => {
    const fetchInventories = async () => {
      try {
        const response = await api.get('/inventory');
        setInventories(Array.isArray(response.data) ? response.data : []); 
      } catch (error) {
        console.error('Failed to fetch inventories:', error.response?.data || error.message);
        setInventories([]);
      }
    };

    fetchInventories();
  }, []); 

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInventory = inventories.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(inventories.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!csvFile) return;

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const response = await api.post('/inventory/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setInventories(response.data); // Assuming the response contains the updated inventory list
      setModalVisible(false);
      setCsvFile(null);
      setToastMessage('Inventory uploaded successfully!');
      setToastVisible(true);
    } catch (error) {
      console.error('Failed to upload inventory:', error.response?.data || error.message);
      setToastMessage('Failed to upload inventory.');
      setToastVisible(true);
    }
  };

  const handleCreateInventory = async () => {
    setLoading(true); // Set loading to true when the process starts
    try {
      const response = await api.post('/inventory', newInventory);
      setInventories((prevInventories) => [...prevInventories, response.data.inventory]); // Update the inventory list immediately
      setCreateModalVisible(false);
      setNewInventory({ name: '', quantity: '', price: '' });
      setToastMessage('Inventory item added successfully!');
      setToastVisible(true);
    } catch (error) {
      console.error('Failed to create inventory:', error.response?.data || error.message);
      setToastMessage('Failed to add inventory item.');
      setToastVisible(true);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleEditInventory = async (id, updatedInventory) => {
    try {
      const response = await api.put(`/inventory/${id}`, updatedInventory);
      setInventories((prevInventories) =>
        prevInventories.map((item) => (item._id === id ? response.data : item))
      );
      setToastMessage('Inventory item updated successfully!');
      setToastVisible(true);
    } catch (error) {
      console.error('Failed to edit inventory:', error.response?.data || error.message);
      setToastMessage('Failed to update inventory item.');
      setToastVisible(true);
    }
  };

  const confirmDeleteInventory = (id) => {
    setInventoryToDelete(id);
    setDeleteModalVisible(true);
  };

  const handleDeleteInventory = async () => {
    if (!inventoryToDelete) return;
    try {
      await api.delete(`/inventory/${inventoryToDelete}`);
      setInventories((prevInventories) => prevInventories.filter((item) => item._id !== inventoryToDelete));
      setDeleteModalVisible(false);
      setInventoryToDelete(null);
      setToastMessage('Inventory item deleted successfully!');
      setToastVisible(true);
    } catch (error) {
      console.error('Failed to delete inventory:', error.response?.data || error.message);
      setToastMessage('Failed to delete inventory item.');
      setToastVisible(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInventory({ ...newInventory, [name]: value });
  };

  return (
    <CContainer className="mt-4">
      <CRow>
        <CCol md={12}>
          <CCard>
            <CCardHeader>
              <CButton color="primary" onClick={() => setModalVisible(true)}>
                Upload Inventory
              </CButton>
              <CButton color="success" className="ms-2" onClick={() => setCreateModalVisible(true)}>
                Create Inventory
              </CButton>
            </CCardHeader>
            <CCardBody>
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Item Name</CTableHeaderCell>
                    <CTableHeaderCell>Quantity</CTableHeaderCell>
                    <CTableHeaderCell>Price</CTableHeaderCell>
                    <CTableHeaderCell>Created By</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {currentInventory.map((item, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{indexOfFirstItem + index + 1}</CTableDataCell>
                      <CTableDataCell>{item.name}</CTableDataCell>
                      <CTableDataCell>{item.quantity}</CTableDataCell>
                      <CTableDataCell>{item.price}</CTableDataCell>
                      <CTableDataCell>{item.userId.name}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="info"
                          size="sm"
                          className="me-2"
                          onClick={() => {
                            setNewInventory(item);
                            setCreateModalVisible(true);
                          }}
                        >
                          Edit
                        </CButton>
                        <CButton
                          color="danger"
                          size="sm"
                          onClick={() => confirmDeleteInventory(item._id)}
                        >
                          Delete
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>Page {currentPage} of {totalPages}</div>
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

      <CModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Confirm Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to delete this inventory item?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={handleDeleteInventory}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Upload Inventory</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              required
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleUpload}>
            Upload
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={createModalVisible} onClose={() => setCreateModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>{newInventory._id ? 'Edit Inventory' : 'Create Inventory'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              className="mb-3"
              type="text"
              name="name"
              placeholder="Item Name"
              value={newInventory.name}
              onChange={handleInputChange}
              required
            />
            <CFormInput
              className="mb-3"
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={newInventory.quantity}
              onChange={handleInputChange}
              required
            />
            <CFormInput
              className="mb-3"
              type="number"
              name="price"
              placeholder="Price"
              value={newInventory.price}
              onChange={handleInputChange}
              required
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setCreateModalVisible(false)}>
            Cancel
          </CButton>
          <CButton
            color="primary"
            onClick={() => {
              if (newInventory._id) {
                handleEditInventory(newInventory._id, newInventory);
              } else {
                handleCreateInventory();
              }
            }}
            disabled={loading} // Disable button when loading
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              newInventory._id ? 'Update' : 'Create'
            )}
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
export default Inventory;