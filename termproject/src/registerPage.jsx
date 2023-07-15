import { Box, TextField, Typography, Button } from '@mui/material';
import React, { useState } from 'react';
import Navbar from './components/navbar';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const handleNameChange = (event) => {
    setName(event.target.value)
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleSignUp = () => {
    if(!name || !email || !password) {
      setError("Please fill all fields")
    }
  }
  return (
    <Box>
      <Box sx={{ marginBottom: '2rem' }}>
        <Navbar />
      </Box>
      <Box sx={{ padding: '2rem' }}>
        <Typography variant="h4" sx={{ marginBottom: '1rem' }}>
          Sign up to use Blog It
        </Typography>
        <form>
          <Box sx={{ marginBottom: '1rem' }}>
            <TextField label="Name" variant="outlined" fullWidth value={name} onChange={handleNameChange}/>
          </Box>
          <Box sx={{ marginBottom: '1rem' }}>
            <TextField label="Email" variant="outlined" fullWidth value={email} onChange={handleEmailChange}/>
          </Box>
          <Box sx={{ marginBottom: '1rem' }}>
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              value={password}
              onChange={handlePasswordChange}
            />
          </Box>
          <Button variant="contained" color="primary" fullWidth disabled={!name || !email || !password} onClick={handleSignUp}>
            Sign Up
          </Button>
        </form>
      </Box>
    </Box>
  );
}
