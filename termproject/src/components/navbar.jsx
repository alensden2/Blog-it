import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import React from 'react';

export default function Navbar() {
  return (
    <div>
      <Box>
        <AppBar position="static">
          <Toolbar variant="dense">
            <Box sx={{ padding: '1rem' }}>
              <Typography variant="h3" color="inherit" component="div">
                Blog It!
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}
