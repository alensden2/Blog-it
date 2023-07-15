import { Box, Button, Typography } from '@material-ui/core';
import React from 'react';
import Navbar from './components/navbar';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <Box
        sx={{
          padding: '2rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Box sx={{ marginBottom: '1rem' }}>
          <Typography variant="h4" component="h1">
            Term project by Alen John B00930528
          </Typography>
        </Box>

        <Box sx={{ marginBottom: '1rem' }}>
          <Typography variant="body1">
            Blog it is a blogging web app that leverages the advantages of cloud.
          </Typography>
        </Box>

        <Box sx={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
          <Button variant="contained" color="primary">
            Sign Up
          </Button>
          <Button variant="contained" color="secondary">
            Sign In
          </Button>
        </Box>
      </Box>
    </>
  );
}
