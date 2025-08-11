import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { UserAuthContext } from '../context/UserAuthContext';
import { handleSuccess, handleError } from '../utils'; // adjust path if needed


const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState('forgotPassword'); // forgotPassword, resetPassword
  const [loading, setLoading] = useState(false);
  const { login } = useContext(UserAuthContext); // Use UserAuthContext here
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/login`,
        { email, password },
        {
          headers: {
            'x-api-key': process.env.REACT_APP_API_KEY,
          },
          withCredentials: true,
        }
      );
      login(data);
      handleSuccess("Successfully Logged In!");
      navigate('/contests'); // Redirect to user profile page after successful login
    } catch (error) {
      handleError(
        error.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/forgotpassword`,
        { email },
        {
          headers: {
            'x-api-key': process.env.REACT_APP_API_KEY,
          },
          withCredentials: true,
        }
      );
      handleSuccess(data.message);
      setModalStep('resetPassword');
    } catch (error) {
      handleError(
        error.response?.data?.message || 'Failed to send OTP.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      handleError('Please enter a valid 6-digit OTP.');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      handleError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/resetpassword`,
        {
          email,
          otp: otpString,
          newPassword,
        },
        {
          headers: {
            'x-api-key': process.env.REACT_APP_API_KEY,
          },
          withCredentials: true,
        }
      );
      handleSuccess(data.message);
      setTimeout(() => {
        setShowModal(false);
        setModalStep('forgotPassword');
      }, 3000);
    } catch (error) {
      handleError(error.response?.data?.message || 'Failed to reset password.');
      setMessage(null);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalStep('forgotPassword');
    setError(null);
  };

  return (
    <div className="container mt-5">
      <div className="text-center flex items-center justify-center gap-3 mb-4">
        <div className="avatar mb-3">
          <div className="w-16 rounded-full ring ring-primary ring-offset-2">
            <img
              src="https://static.vecteezy.com/system/resources/previews/008/442/086/original/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
              alt="User Avatar"
              className="img-fluid rounded-circle"
            />
          </div>
        </div>

        <h2 className="text-black font-bold text-4xl">Login</h2>
      </div>

      {message && <div className="alert alert-success text-center">{message}</div>}
      {error && <div className="alert alert-danger text-center">{error}</div>}
      <form onSubmit={handleLogin} className="mx-auto shadow-lg p-4 rounded-lg bg-gradient-to-br from-purple-700 via-pink-500 to-purple-600 text-white w-full sm:max-w-md">
        <div className="form-group mb-3">
          <label className="font-bold">Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group mt-3">
          <label className="font-bold">Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full mt-6"
        >
          {loading ? <span className="loading loading-spinner"></span> : 'Login'}
        </button>

        <p className="text-center mt-3">
          <button
            type="button"
            className="btn btn-link text-white"
            onClick={() => setShowModal(true)} // Open modal on click
          >
            Forgot Password?
          </button>
        </p>
      </form>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: 'black', fontWeight: 'bold' }}>
            {modalStep === 'forgotPassword' ? 'Forgot Password' : 'Reset Password'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {message && <div className="alert alert-success text-center">{message}</div>}
          {error && <div className="alert alert-danger text-center">{error}</div>}

          {modalStep === 'forgotPassword' && (
            <form onSubmit={handleForgotPassword}>
              <div className="form-group">
                <label style={{ fontWeight: 'bold', color: 'black' }}>Email:</label>
                <input
                  type="email"
                  className="input input-bordered input-accent w-full mb-4"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ background: '#2A2A72', color: 'white' }} // Synthwave style for input
                />
              </div>
              <button type="submit" className="btn btn-primary d-block mx-auto mt-4 w-full py-2 text-lg font-semibold">
                {loading ? <Spinner animation="border" size="sm" /> : 'Send OTP'}
              </button>
            </form>
          )}

          {modalStep === 'resetPassword' && (
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label style={{ fontWeight: 'bold', color: '#007bff' }}>OTP:</label>
                <div className="d-flex justify-content-between">
                  {otp.map((data, index) => (
                    <input
                      type="text"
                      name="otp"
                      maxLength="1"
                      key={index}
                      value={data}
                      onChange={(e) => handleOtpChange(e.target, index)}
                      onFocus={(e) => e.target.select()}
                      className="input input-bordered input-accent w-12 text-center mb-4"
                      style={{ borderColor: '#007bff', borderWidth: '2px' }}
                    />
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label style={{ fontWeight: 'bold', color: '#007bff' }}>New Password:</label>
                <input
                  type="password"
                  className="input input-bordered input-accent w-full mb-4"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                  style={{ background: '#2A2A72', color: 'white' }} // Synthwave style for input
                />
              </div>
              <div className="form-group">
                <label style={{ fontWeight: 'bold', color: '#007bff' }}>Confirm Password:</label>
                <input
                  type="password"
                  className="input input-bordered input-accent w-full mb-4"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm new password"
                  style={{ background: '#2A2A72', color: 'white' }} // Synthwave style for input
                />
              </div>
              <button type="submit" className="btn btn-primary d-block mx-auto mt-4 w-full py-2 text-lg font-semibold">
                {loading ? <Spinner animation="border" size="sm" /> : 'Reset Password'}
              </button>
            </form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserLogin;
