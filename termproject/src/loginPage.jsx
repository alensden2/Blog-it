import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import Navbar from './components/navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = () => {
    if (!email || !password) {
      setError('Please fill all fields');
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    try {
      // Call API gateway to authenticate user
      const LOGIN_LAMBDA_API_GATEWAY_ENDPOINT = `${process.env.REACT_APP_API_ENDPOINT}/login`;
      // Preparing the request object
      const request = {
        email: email,
        password: password
      }
      // Axios request to the GATEWAY
      axios.post(LOGIN_LAMBDA_API_GATEWAY_ENDPOINT, request).then(res => {
        console.log("success : ", res.data);
        localStorage.setItem('email', email);
        alert("Login Success!")
        navigate("/profilePage")
      }).catch(err => {
        console.log(err);
        setError('Invalid credentials. Please try again.');
      });
    } catch (e) {
      alert("Login Failed")
      console.log(e);
    }
  };

  return (
    <Box>
      <Box sx={{ marginBottom: '2rem' }}>
        <Navbar />
      </Box>
      <Box sx={{ padding: '2rem' }}>
        <Typography variant="h4" sx={{ marginBottom: '1rem' }}>
          Login to Blog It
        </Typography>
        <form onSubmit={handleFormSubmit}>
          <Box sx={{ marginBottom: '1rem' }}>
            <TextField
              label="Email"
              variant="outlined"
              value={email}
              onChange={handleEmailChange}
              fullWidth
            />
          </Box>
          <Box sx={{ marginBottom: '1rem' }}>
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              fullWidth
            />
          </Box>
          {error && <Typography color="error" sx={{ marginBottom: '1rem' }}>{error}</Typography>}
          <Button variant="contained" type="submit" color="primary" onClick={handleLogin}>
            Login
          </Button>
        </form>
      </Box>
    </Box>
  );
}
