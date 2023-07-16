import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import Navbar from './components/navbar';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSignUp = () => {
    if (!name || !email || !password) {
      setError('Please fill all fields');
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    try {
      // Call API gateway with the Save user info
      // Save email to local storage

      /** REMOVE
       * MOCKED 
       * FIX API GATEWAY
       */
      const userEmail = 'email@example.com';

      localStorage.setItem('email', userEmail);
      navigate("/profilePage")
    } catch (e) {
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
          Sign up to use Blog It
        </Typography>
        <form onSubmit={handleFormSubmit}>
          <Box sx={{ marginBottom: '1rem' }}>
            <TextField label="Name" variant="outlined" value={name} onChange={handleNameChange} />
          </Box>
          <Box sx={{ marginBottom: '1rem' }}>
            <TextField
              label="Email"
              variant="outlined"          
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
          <Box sx={{ marginBottom: '1rem' }}>
            <TextField
              label="Password"
              variant="outlined"
              type="password"              
              value={password}
              onChange={handlePasswordChange}
            />
          </Box>
          <Button variant="contained" type='submit' color="primary" disabled={!name || !email || !password} onClick={handleSignUp}>
            Sign Up
          </Button>
        </form>
      </Box>
    </Box>
  );
}
