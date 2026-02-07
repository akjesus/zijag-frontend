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
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableRow,
} from '@coreui/react';
import api from '../../api/axios';

const Reports = () => {
  const [reports, setReports] = useState(null); // Change to handle a single report object
  const [modalVisible, setModalVisible] = useState(false);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', reportType: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleFilterReports = async (e) => {
    e.preventDefault();
    try {
      const response = await api.get('/reports', { params: filters }); // Fetch filtered reports from the backend
      setReports(response.data); // Set the single report object
      console.log(response.data);
      setModalVisible(false);
    } catch (error) {
      console.error('Failed to filter reports:', error.response?.data || error.message);
    }
  };

  return (
    <CContainer className="mt-4">
      <CRow>
        <CCol md={12}>
          <CCard>
            <CCardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <h4>Financial Reports</h4>
                <CButton color="primary" onClick={() => setModalVisible(true)}>
                  Filter Reports
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody>
              {filters.reportType === 'detailed' && reports && (
                <>
                  <p><strong>Total Income:</strong> N{reports.totalIncome}</p>
                  <p><strong>Total Expenses:</strong> N{reports.totalExpenses}</p>
                  <p><strong>Net Profit:</strong> N{reports.netProfit}</p>
                  <p><strong>Date:</strong> from {new Date(reports.startDate).toLocaleDateString()} to {new Date(reports.endDate).toLocaleDateString()}</p>

                  <h5>Income</h5>
                  <CTable hover responsive>
                    <CTableBody>
                      {reports.income.map((item) => (
                        <CTableRow key={item._id}>
                          <CTableDataCell>{item.description}</CTableDataCell>
                          <CTableDataCell>{item.amount}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>

                  <h5>Expenses</h5>
                  <CTable hover responsive>
                    <CTableBody>
                      {reports.expenses.map((item) => (
                        <CTableRow key={item._id}>
                          <CTableDataCell>{item.description}</CTableDataCell>
                          <CTableDataCell>{item.amount}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>

                  <h5>Sales</h5>
                  <CTable hover responsive>
                    <CTableBody>
                      {reports.sales.map((sale) => (
                        <React.Fragment key={sale._id}>
                          {sale.items.map((item, index) => (
                            <CTableRow key={index}>
                              <CTableDataCell>{item.product}</CTableDataCell>
                              <CTableDataCell>{item.quantity} x {item.price}</CTableDataCell>
                            </CTableRow>
                          ))}
                          <CTableRow>
                            <CTableDataCell><strong>Total Amount:</strong></CTableDataCell>
                            <CTableDataCell>{sale.totalAmount}</CTableDataCell>
                          </CTableRow>
                        </React.Fragment>
                      ))}
                    </CTableBody>
                  </CTable>
                </>
              )}
              {filters.reportType === 'summary' && reports && (
                <>
                  <p><strong> Sales :</strong> N{reports.totalSales}</p>
                  <p><strong> Income:</strong> N{reports.totalIncome}</p>
                  <p><strong>Total Income:</strong> N{reports.totalIncome + reports.totalSales}</p>
                  <p><strong>Total Expenses:</strong> N{reports.totalExpenses}</p>
                  <p><strong>Net Profit:</strong> N{reports.netProfit}</p>
                  <p><strong>Date:</strong> from {new Date(reports.startDate).toLocaleDateString()} to {new Date(reports.endDate).toLocaleDateString()}</p>
                </>
              )}
              {!reports && <p>No reports to display. Please filter reports to view data.</p>}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Filter Reports</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleFilterReports}>
            <CFormInput
              className="mb-3"
              type="date"
              name="startDate"
              placeholder="Start Date"
              value={filters.startDate}
              onChange={handleInputChange}
              required
            />
            <CFormInput
              className="mb-3"
              type="date"
              name="endDate"
              placeholder="End Date"
              value={filters.endDate}
              onChange={handleInputChange}
              required
            />
            <CFormSelect
              className="mb-3"
              name="reportType"
              value={filters.reportType}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Report Type</option>
              <option value="summary">Summary</option>
              <option value="detailed">Detailed</option>
            </CFormSelect>
            <CButton type="submit" color="primary">
              Apply Filters
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

export default Reports;