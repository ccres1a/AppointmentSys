import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { AppContext } from './AppContext.jsx';
import Modal from 'react-modal';
import '../css/Navigationbar.css';

Modal.setAppElement('#root'); // Set the app element for the modal

const AdminLoginModal = ({ isOpen, onRequestClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (event) => {
    event.preventDefault();
    if (username === 'admin' && password === 'password') {
      onLogin();
      onRequestClose();
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Admin Login">
      <div className="modal-content">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
          <button type="button" onClick={onRequestClose}>Close</button>
        </form>
      </div>
    </Modal>
  );
};

export default function Navbar() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(AppContext);
  const navigate = useNavigate();

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate('/administrator');
  };

  return (
    <nav className="navbar">
      <NavLink className="navbar-brand" to="/">All Stars Barbers</NavLink>
      <div className="navbar-collapse">
        <ul className="navbar-links">
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/appointmentbooking">Appointment Booking</NavLink></li>
          <li><NavLink to="/viewappointment">View Appointments</NavLink></li>
          <li><NavLink to="/services">Services</NavLink></li>
          <li><NavLink to="/about">About Us</NavLink></li>
          {isAuthenticated ? (
            <li><NavLink to="/administrator">Administrator</NavLink></li>
          ) : (
            <li><NavLink className="admin-button" onClick={openModal}>Administrator</NavLink></li>
          )}
        </ul>
      </div>
      <AdminLoginModal isOpen={modalIsOpen} onRequestClose={closeModal} onLogin={handleLogin} />
    </nav>
  );
}
