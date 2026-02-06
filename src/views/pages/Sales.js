import React, { useState, useEffect } from 'react';
import api from '../../api/axios'
import logo from '../../assets/images/logo.png';
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
import { jsPDF } from 'jspdf';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [items, setItems] = useState([{ product: '', quantity: '', price: '' }]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState(''); // Add toast message state
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false); // State for edit modal
  const [saleToEdit, setSaleToEdit] = useState(null); // State for the sale being edited
  const [addModalVisible, setAddModalVisible] = useState(false); // State for add modal
  const [inventory, setInventory] = useState([]); // State to store inventory items
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of sales per page

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...items];

    if (name === 'product') {
      const selectedProduct = inventory.find((item) => item.name === value);
      updatedItems[index].product = value;
      updatedItems[index].price = selectedProduct ? selectedProduct.price : '';
      updatedItems[index].id = selectedProduct ? selectedProduct._id : null; // Add inventory ID
    } else {
      updatedItems[index][name] = value;
    }

    setItems(updatedItems);
  };

  const handleAddItem = () => {
    setItems([...items, { product: '', quantity: '', price: '' }]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleAddSale = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/sales', { items });

      // Ensure the response structure is correctly handled
      const newSales = Array.isArray(response.data.sales) ? response.data.sales : [response.data.sale];

      setSales([...sales, ...newSales]);
      setItems([{ product: '', quantity: '', price: '' }]);
      setToastMessage('Sales added successfully!');
      setToastVisible(true);

    } catch (error) {
      console.error('Failed to add sales:', error.response?.data || error.message);
      setToastMessage('Failed to add sales.');
      setToastVisible(true);
    }
  };

  const confirmDelete = (saleId) => {
    setSaleToDelete(saleId);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    if (!saleToDelete) return;
    try {
      await api.delete(`/sales/${saleToDelete}`); // Delete sale from backend
      setSales(sales.filter((sale) => sale._id !== saleToDelete));
      setDeleteModalVisible(false);
      setSaleToDelete(null);
      setToastMessage('Sale deleted successfully!');
      setToastVisible(true); // Show toast notification for deletion
    } catch (error) {
      console.error('Failed to delete sale:', error.response?.data || error.message);
    }
  };

  const handleEdit = (saleId) => {
    const sale = sales.find((s) => s._id === saleId);
    if (sale) {
      setSaleToEdit(sale);
      setItems(sale.items);
      setEditModalVisible(true);
    }
  };

  const handleUpdateSale = async () => {
    if (!saleToEdit) return;
    try {
      const response = await api.put(`/sales/${saleToEdit._id}`, { items }); // Update sale in backend
      const updatedSale = response.data.sale; // Assuming the response contains the updated sale
      setSales(sales.map((sale) => (sale._id === updatedSale._id ? updatedSale : sale)));
      setEditModalVisible(false);
      setSaleToEdit(null);
      setItems([{ product: '', quantity: '', price: '' }]);
      setToastMessage('Sale updated successfully!');
      setToastVisible(true); // Show toast notification for update
    } catch (error) {
      console.error('Failed to update sale:', error.response?.data || error.message);
    }
  };

  const handlePrint = (saleId) => {
    const sale = sales.find((s) => s._id === saleId);
    if (!sale) {
      console.error('Sale not found');
      return;
    }

    const doc = new jsPDF({ unit: 'mm', format: [88, 297] }); 

    // Adjust logo dimensions to maintain aspect ratio
    const logoWidth = 20; // Desired width in mm
    const logoHeight = 20; // Desired height in mm
    doc.addImage(logo, 'PNG', 34, 10, logoWidth, logoHeight); // Centered logo

    doc.setFontSize(10);
    doc.text('Zijag Hub', 44, 35, { align: 'center' });
    doc.text('210, Garden City layout', 44, 40, { align: 'center' });
    doc.text('Off Enugu East Local Government Road, Nike, Enugu.', 44, 45, { align: 'center' });
    doc.text('Phone: +2347066377348', 44, 50, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Receipt', 44, 60, { align: 'center' });
    doc.setFontSize(12);
    sale.items.forEach((item, index) => {
      const yPosition = 70 + index * 10;
      doc.text(`Product: ${item.product}`, 10, yPosition);
      doc.text(`Quantity: ${item.quantity}`, 60, yPosition);
      doc.text(`Price: N${item.price}`, 110, yPosition);
      doc.text(`Total: N${item.quantity * item.price}`, 160, yPosition);
    });

    doc.text(`Date: ${new Date(sale.createdAt).toLocaleDateString()}`, 10, 70 + sale.items.length * 10);

    doc.save(`receipt_${sale._id}.pdf`);
  };

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await api.get('/sales');
        setSales(response.data);
      } catch (error) {
        console.error('Failed to fetch sales:', error.response?.data || error.message);
      }
    };

    const fetchInventory = async () => {
      try {
        const response = await api.get('/inventory'); // Fetch inventory from the backend
        setInventory(response.data);
      } catch (error) {
        console.error('Failed to fetch inventory:', error.response?.data || error.message);
      }
    };

    fetchSales();
    fetchInventory();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSales = sales.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sales.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <CContainer className="mt-4">
      <CRow>
        <CCol md={12}>
          <CCard>
            <CCardHeader>
              <CButton color="primary" onClick={() => setAddModalVisible(true)}>
                Add Sale
              </CButton>
            </CCardHeader>
            <CCardBody>
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Product</CTableHeaderCell>
                    <CTableHeaderCell>Quantity</CTableHeaderCell>
                    <CTableHeaderCell>Price</CTableHeaderCell>
                    <CTableHeaderCell>Total</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Sold By</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {currentSales.map((sale, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{indexOfFirstItem + index + 1}</CTableDataCell>
                      <CTableDataCell>
                        {sale.items.map((item, i) => (
                          <div key={i}>{item.product}</div>
                        ))}
                      </CTableDataCell>
                      <CTableDataCell>
                        {sale.items.map((item, i) => (
                          <div key={i}>{item.quantity}</div>
                        ))}
                      </CTableDataCell>
                      <CTableDataCell>
                        {sale.items.map((item, i) => (
                          <div key={i}>N{item.price}</div>
                        ))}
                      </CTableDataCell>
                      <CTableDataCell>
                        {sale.items.map((item, i) => (
                          <div key={i}>N{item.quantity * item.price}</div>
                        ))}
                      </CTableDataCell>
                      <CTableDataCell>{new Date(sale.createdAt).toLocaleDateString()}</CTableDataCell>
                        <CTableDataCell>{sale.userId?.name || 'Unknown User'}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButtonGroup>
                          <CButton color="info" size="sm" className="me-2" onClick={() => handleEdit(sale._id)}>
                            Edit
                          </CButton>
                          <CButton color="danger" size="sm" className="me-2" onClick={() => confirmDelete(sale._id)}>
                            Delete
                          </CButton>
                          <CButton color="success" size="sm" onClick={() => handlePrint(sale._id)}>
                            Print Receipt
                          </CButton>
                        </CButtonGroup>
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

      <CModal visible={addModalVisible} onClose={() => setAddModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Add Sales</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleAddSale}>
            {items.map((item, index) => (
              <div key={index} className="mb-3 d-flex align-items-center gap-2">
                <select
                  className="form-select"
                  name="product"
                  value={item.product}
                  onChange={(e) => handleItemChange(index, e)}
                  required
                >
                  <option value="">Select Product</option>
                  {inventory.map((invItem) => (
                    <option key={invItem._id} value={invItem.name}>
                      {invItem.name}
                    </option>
                  ))}
                </select>
                <CFormInput
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, e)}
                  required
                />
                <CFormInput
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={item.price}
                  readOnly
                />
                <CButton color="danger" size="sm" onClick={() => handleRemoveItem(index)}>
                  Remove
                </CButton>
              </div>
            ))}
            <div className="d-flex justify-content-between mt-3">
              <CButton color="success" size="sm" onClick={handleAddItem}>
                Add Item
              </CButton>
              <CButton type="submit" color="primary">
                Add Sales
              </CButton>
            </div>
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
          <CModalTitle>Edit Sale</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            {items.map((item, index) => (
              <div key={index} className="mb-3">
                <CFormInput
                  type="text"
                  name="product"
                  placeholder="Product Name"
                  value={item.product}
                  onChange={(e) => handleItemChange(index, e)}
                  required
                />
                <CFormInput
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, e)}
                  required
                />
                <CFormInput
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, e)}
                  required
                />
              </div>
            ))}
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleUpdateSale}>
            Update
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Confirm Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to delete this sale?</CModalBody>
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

export default Sales;