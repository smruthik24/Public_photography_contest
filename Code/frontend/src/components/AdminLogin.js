import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import { AdminAuthContext } from '../context/AdminAuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AdminAuthContext); // Use AdminAuthContext here
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/login`,
        { email, password },
        {
          headers: {
            'x-api-key': process.env.REACT_APP_API_KEY,
          },
          withCredentials: true,
        }
      );
      login(data);  // This should update the auth state immediately
      navigate('/admin-dashboard'); // Redirect to admin dashboard after successful login
    } catch (error) {
      console.error('Admin login error:', error);
      alert('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="text-center d-flex align-items-center justify-content-center gap-3 mb-4">
        <div className="avatar d-flex justify-content-center mb-3">
          <div className="ring-primary ring-offset-base-100 w-16 rounded-full ring ring-offset-2">
            <img
              src="https://static.vecteezy.com/system/resources/previews/008/442/086/original/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
              alt="User Avatar"
              className="img-fluid rounded-circle"
            />
          </div>
        </div>
        <h2 className="text-black font-bold text-4xl">Admin Login</h2>
      </div>
      <form
        onSubmit={handleLogin}
        className="mx-auto shadow-lg p-6 rounded-lg bg-gradient-to-br from-purple-700 via-pink-500 to-purple-600 text-white"
        style={{ maxWidth: '400px', border: '2px solid purple' }}
      >
        <div className="form-group">
          <label style={{ fontWeight: 'bold', color: 'white' }}>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ borderColor: 'purple', borderWidth: '2px' }}
          />
        </div>
        <br />
        <div className="form-group">
          <label style={{ fontWeight: 'bold', color: 'white' }}>Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ borderColor: 'purple', borderWidth: '2px' }}
          />
        </div>
        <button
          type="submit"
          className="btn d-block mx-auto mt-4"
          style={{
            backgroundColor: "purple",
            border: "none",
            fontSize: "20px",
            color: "white",
            borderRadius: "5px",
            padding: "10px",
            cursor: "pointer",
            margin: "10px 0",
            fontWeight: "bold",
          }}
        >
          {loading ? <Spinner animation="border" size="sm" /> : 'Login'}
        </button>
      </form>
    </div>
  );
}  

export default AdminLogin;
