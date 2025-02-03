import React from 'react'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { CContainer, CRow, CCol, CCard, CCardBody, CCardText, CButton, CSpinner, CFooter } from '@coreui/react';

const Maintenance = () => {
  const token = Cookies.get('authToken')

  const handleRedirectToMaintenance = () => {
    try {
      if (!token) {
        throw new Error('No authentication token found. Please log in.')
      }

      // Decode the token to check expiration or required claims
      const decodedToken = jwtDecode(token)
      const currentTime = Date.now() / 1000

      // Check if token is expired
      if (decodedToken.exp < currentTime) {
        throw new Error('Token expired. Please log in again.')
      }

      // Redirect with token (consider encrypting it for added security)
      window.location.href = `http://localhost:3001?token=${encodeURIComponent(token)}`
    } catch (error) {
      console.error('Redirect error:', error)
      alert(error.message || 'Failed to access Maintenance Portal.')
    }
  }

  return (
    // <div className="maintenance">
    //   <h1>Under Maintenance</h1>
    //   <p>Sorry, our website is currently undergoing maintenance. Please check back later.</p>
    //   <button className="btn btn-primary" onClick={handleRedirectToMaintenance}>
    //     Go To Maintenance
    //   </button>
    // </div>

    // New tempory template code..

    <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCard className="text-center shadow-lg p-4 border-0 rounded-4">
              <CCardBody>
                <h1 className="display-4 fw-bold text-danger mb-3">🚧 Vehicle Maintenance 🚧</h1>
                <CCardText className="fs-5 text-muted mb-4">
                  This page is currently undergoing maintenance.<br />
                  Please check back later.
                </CCardText>
                {/* <CButton color="primary" className="mb-3 px-4 py-2 rounded-pill">
                  Refresh Page
                </CButton> */}
                <div className="d-flex justify-content-center">
                  <CSpinner color="secondary" variant="grow" />
                </div>
              </CCardBody>
              <CFooter className="bg-transparent border-0 mt-3">
                <small className="text-muted">&copy; 2025 Vehicle Maintenance System. All Rights Reserved.</small>
              </CFooter>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>

  )
}

export default Maintenance
