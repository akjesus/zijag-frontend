import React, { useState, useEffect } from 'react'
import api from '../../api/axios'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

import {
  CAvatar,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPeople, cilArrowBottom, cilArrowTop} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import WidgetsDropdown from '../widgets/WidgetsDropdown'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalExpenses: 0,
    totalIncome: 0,
    totalSales: 0,
    newUsers: 0,
    bounceRate: 0,
  })
  const [dashUsers, setDashUsers] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard');
        console.log(response.data)
        setStats(response.data);
        setDashUsers(Array.isArray(response.data.recentUsers) ? response.data.recentUsers : []);
      } catch (error) {
        console.error(
          'Failed to fetch dashboard stats:',
          error.response?.data || error.message
        )
      }
    }

    fetchStats()
  }, [])

  return (
    <>
      <WidgetsDropdown
        stats={[
          {
            title: 'Sales',
            value: `N${stats.totalSales}`,
            change: '-12.4%',
            icon: cilArrowBottom,
            color: 'primary',
            chartData: {
              labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
              datasets: [
                {
                  label: 'Sales',
                  backgroundColor: 'transparent',
                  borderColor: 'rgba(255,255,255,.55)',
                  data: [65, 59, 84, 84, 51, 55, 40],
                },
              ],
            },
            chartOptions: {
              plugins: { legend: { display: false } },
              maintainAspectRatio: false,
              scales: {
                x: { grid: { display: false }, ticks: { display: false } },
                y: { grid: { display: false }, ticks: { display: false } },
              },
            },
          },
          {
            title: 'Income',
            value: `N${stats.totalIncome}`,
            change: '40.9%',
            icon: cilArrowTop,
            color: 'info',
            chartData: {
              labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
              datasets: [
                {
                  label: 'Income',
                  backgroundColor: 'transparent',
                  borderColor: 'rgba(255,255,255,.55)',
                  data: [1, 18, 9, 17, 34, 22, 11],
                },
              ],
            },
            chartOptions: {
              plugins: { legend: { display: false } },
              maintainAspectRatio: false,
              scales: {
                x: { grid: { display: false }, ticks: { display: false } },
                y: { grid: { display: false }, ticks: { display: false } },
              },
            },
          },
          {
            title: 'Expenses',
            value: `N${stats.totalExpenses}`,
            change: '-5.2%',
            icon: cilArrowBottom,
            color: 'danger',
            chartData: {
              labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
              datasets: [
                {
                  label: 'Expenses',
                  backgroundColor: 'transparent',
                  borderColor: 'rgba(255,255,255,.55)',
                  data: [12, 15, 9, 20, 34, 22, 18],
                },
              ],
            },
            chartOptions: {
              plugins: { legend: { display: false } },
              maintainAspectRatio: false,
              scales: {
                x: { grid: { display: false }, ticks: { display: false } },
                y: { grid: { display: false }, ticks: { display: false } },
              },
            },
          },
          {
            title: 'Net Profit',
            value: `N${(stats.totalIncome + stats.totalSales) - stats.totalExpenses}`,
            change: '15.3%',
            icon: cilArrowTop,
            color: 'success',
            chartData: {
              labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
              datasets: [
                {
                  label: 'Sales',
                  backgroundColor: 'transparent',
                  borderColor: 'rgba(255,255,255,.55)',
                  data: [22, 30, 25, 40, 50, 45, 60],
                },
              ],
            },
            chartOptions: {
              plugins: { legend: { display: false } },
              maintainAspectRatio: false,
              scales: {
                x: { grid: { display: false }, ticks: { display: false } },
                y: { grid: { display: false }, ticks: { display: false } },
              },
            },
          },
        ]}
        className="mb-4"
      />
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Traffic {' & '} Sales</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-info py-1 px-3">
                        <div className="text-body-secondary text-truncate small">New Clients</div>
                        <div className="fs-5 fw-semibold">9,123</div>
                      </div>
                    </CCol>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">
                          Recurring Clients
                        </div>
                        <div className="fs-5 fw-semibold">22,643</div>
                      </div>
                    </CCol>
                  </CRow>
                  <hr className="mt-0" />
                </CCol>
                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">Pageviews</div>
                        <div className="fs-5 fw-semibold">78,623</div>
                      </div>
                    </CCol>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">Organic</div>
                        <div className="fs-5 fw-semibold">49,123</div>
                      </div>
                    </CCol>
                  </CRow>

                  <hr className="mt-0" />
                  <div className="mb-5"></div>
                </CCol>
              </CRow>

              <br />

              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">User</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Activity</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {dashUsers.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-center">
                        <CAvatar size="md" src={avatar1} status={item.status} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.name}</div>
                        <div className="small text-body-secondary text-nowrap">
                          <span>{item.new ? 'New' : 'Recurring'}</span> | Registered:{' '}
                          {dayjs(item.createdAt).format('MMMM D, YYYY h:mm A')}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="small text-body-secondary text-nowrap">Last login</div>
                        <div className="fw-semibold text-nowrap">{dayjs(item.lastLogin).fromNow()}</div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
      </CRow>
    </>
  )
}

export default Dashboard
