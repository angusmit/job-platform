import React, { useState } from 'react';
import axios from 'axios';
import Profile from './components/Profile';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/login/', {
        username: formData.username,
        password: formData.password
      });
      
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      setIsLoggedIn(true);
      fetchUserProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/register/', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      setIsLoggedIn(true);
      fetchUserProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/protected/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isLoggedIn && user) {
    return (
      <div>
        <nav style={{ background: '#eee', padding: '10px' }}>
          <button onClick={() => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setIsLoggedIn(false);
            setUser(null);
          }}>Logout</button>
        </nav>
        <Profile />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Login</h2>
      <input 
        type="text" 
        name="username" 
        placeholder="Username" 
        onChange={handleChange} 
        style={{ margin: '5px' }}
      /><br />
      <input 
        type="password" 
        name="password" 
        placeholder="Password" 
        onChange={handleChange} 
        style={{ margin: '5px' }}
      /><br />
      <button onClick={handleLogin} style={{ margin: '5px' }}>Login</button>
      
      <h2>Register</h2>
      <input 
        type="text" 
        name="email" 
        placeholder="Email" 
        onChange={handleChange} 
        style={{ margin: '5px' }}
      /><br />
      <button onClick={handleRegister} style={{ margin: '5px' }}>Register</button>
    </div>
  );
}

export default App;