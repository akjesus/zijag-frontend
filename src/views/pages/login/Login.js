import React, { useState } from 'react'
import.meta.env.VITE_API
import { Link, useNavigate } from 'react-router-dom'
import axios from '../../../api/axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CToast,
  CToastBody,
  CToastClose,
  CToaster,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('') 
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (email, password) => {
    try {
      setLoading(true)
      const response = await axios.post(`/auth/login`, { email, password })
      const { token, role } = response.data; 
      localStorage.setItem('token', token) 
      localStorage.setItem('role', role) 
      navigate('/dashboard')
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message)
      setToastMessage(error.response?.data?.message || 'Login failed');
      setToastVisible(true);
      setLoading(false)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center justify-content-center">
      <CContainer>
        <CRow className="justify-content-center text-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol>
                        <CButton
                          color="primary"
                          className="px-4"
                          onClick={() => handleLogin(email, password)}
                          disabled={loading} // Disable button when loading
                        >
                          {loading ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          ) : (
                            'Login'
                          )}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
      <CToaster placement="top-end">
        {toastVisible && (
          <CToast autohide={true} visible={toastVisible} color={toastColor} onClose={() => setToastVisible(false)}>
            <CToastBody>
              {toastMessage}
              <CToastClose onClick={() => setToastVisible(false)} />
            </CToastBody>
          </CToast>
        )}
      </CToaster>
    </div>
  )
}

export default Login
