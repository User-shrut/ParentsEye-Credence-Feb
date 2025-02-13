import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'
import './login.css' // Optional: If you want to keep custom styles
import Logo from '../../../assets/brand/logo.png'
import toast, { Toaster } from 'react-hot-toast'
import { FaUserAlt } from 'react-icons/fa'
import { RiLockPasswordFill } from 'react-icons/ri'
import { styled } from '@mui/material'

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!credentials?.username || !credentials?.password) {
      toast.error('Please enter both username and password');
      return;
    }

    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/auth/login`;

      const response = await axios.post(apiUrl, credentials);

      if (response.data?.token) {
        const { token } = response.data;

        const cookieOptions = {
          secure: window.location.protocol === 'https:', // Set secure for HTTPS
        };

        if (rememberMe) {
          cookieOptions.expires = 30; // Expires in 30 days
        }

        Cookies.set('crdntl', JSON.stringify(credentials), cookieOptions);
        Cookies.set('authToken', token, cookieOptions);
        navigate('/dashboard');
      } else {
        toast.error(response.data?.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Invalid credentials');
    }
  };


  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
        <div className="row w-100">
          <div className="col-12 col-lg-6 p-0 d-none d-lg-block">
            <div className="video-container">
              <video autoPlay muted loop className="w-100 h-100">
                <source src="login-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          <div className="col-12 col-lg-6 d-flex justify-content-center align-items-center">
            <div
              className="card shadow-lg  rounded-4"
              style={{ maxWidth: '500px', width: '100%', backgroundColor: '#f7f6e7' }}
            >
              <div className="card-body">
                <div className="text-center mb-4">
                  <img src="CR-LOGO.png" alt="Logo" width="120" className="mb-3" />
                  <h5 style={{ colog: '#575a59' }}>
                    <strong>Navigating Towards a Secured Future</strong>
                  </h5>
                </div>
                <h2
                  className="card-title text-center mb-3"
                  style={{ fontWeight: 'bold', color: '#333' }}
                >
                  Welcome Back!
                </h2>
                <p className="text-center text-secondary">
                  <strong>Please enter your details</strong>
                </p>
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label text-black">
                      <strong>UserName</strong>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text" id="basic-addon1">
                        <FaUserAlt />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        placeholder="Username"
                        value={credentials.username}
                        onChange={(e) =>
                          setCredentials({ ...credentials, username: e.target.value })
                        }
                        style={{ border: '1px solid #ff7a00' }}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label text-black">
                      <strong>Password</strong>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text" id="basic-addon1">
                        <RiLockPasswordFill />
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={(e) =>
                          setCredentials({ ...credentials, password: e.target.value })
                        }
                        style={{ border: '1px solid #ff7a00' }}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label
                      className="form-check-label ms-2"
                      htmlFor="remember"
                      style={{ fontSize: '0.8rem' }}
                    >
                      <strong>Remember for 30 days</strong>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn w-100 fw-bold text-white"
                    style={{ backgroundColor: '#ff7a00' }}
                  >
                    Log In
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
