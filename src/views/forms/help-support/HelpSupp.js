/* eslint-disable prettier/prettier */
import React from 'react'
import { Search } from 'lucide-react'
import logo from '../../../assets/brand/logo.png'
import ArticleCard from '../../../components/ArtcleCard'
import { useNavigate } from 'react-router-dom'
function HelpSupp() {
  const navigate = useNavigate()

  const handleSupport = () => {
    navigate('/HelpSupp/Raise-Ticket')
  }

  const handleNavigateBack = () => {
    navigate(-1)
  }

  return (
    <div style={{ backgroundColor: 'white', borderBottom: '1px solid #dee2e6', height: '80vh' }}>
      <div className="mb-5 mx-5">
        {/**HEADER */}
        <div>
          <div className="ms-5 pt-2 d-flex justify-content-between">
            <img src={logo} style={{ width: '180px' }} />
            <span className="mt-3 goBack btn border-0" onClick={handleNavigateBack}>
              Go Back
            </span>
          </div>
          <div className="container py-4">
            <div className="d-flex flex-column gap-3 text-center">
              <h1 className="h3 fw-bold text-dark">
                <strong> How can we help?</strong>
              </h1>
            </div>
          </div>
        </div>
        {/**ARTICLES */}
        <ArticleCard />
        {/**CONTACT SUPPORT */}
        {/* <div className="text-center mt-5">
          <h5>
            {' '}
            <strong>Still need help?</strong>
          </h5>
          <p style={{ fontSize: '15px', fontWeight: '600', opacity: '0.8' }}>
            Contact us for further assistance.
          </p>
          <button
            onClick={handleSupport}
            className="btn bg-info text-white"
            style={{ fontWeight: 'bold' }}
          >
            Raise Ticket
          </button>
        </div> */}
      </div>
    </div>
  )
}

export default HelpSupp
