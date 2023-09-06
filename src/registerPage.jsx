import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import Navbar from './components/navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
      const SAVE_USER_LAMBDA_API_GATEWAY_ENDPOINT = `${process.env.REACT_APP_API_ENDPOINT}/test/register`;
      // Preparing the request object
      const request = {
        email: email, //the email from the form
        name: name,
        password: password
      }
      // Axios request to the GATEWAY
      axios.post(SAVE_USER_LAMBDA_API_GATEWAY_ENDPOINT, request).then(res => {
        console.log("success : ", res.data);
      }).catch(err => { console.log(err) })
      localStorage.setItem('email', email);
      alert("Login Success!")
      navigate("/profilePage")
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
