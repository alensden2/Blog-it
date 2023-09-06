import { AppBar, Box, Toolbar, Typography, IconButton, Menu, MenuItem, Badge } from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import NotificationsIcon from '@mui/icons-material/Notifications';

export default function Navbar({ showPlusButton, showThreeDotMenu, showNotifications }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    localStorage.removeItem('email');
    navigate('/')
  };

  return (
    <div>
      <Box>
        <AppBar position="static">
          <Toolbar variant="dense">
            <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1 }}>
              Blog It!
            </Typography>

            {showPlusButton && (
              <IconButton color="inherit" component={Link} to="/create-blog">
                <AddIcon />
              </IconButton>
            )}

            {showNotifications && (
              <IconButton color="inherit">
                <Badge badgeContent={0} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            )}

            {showThreeDotMenu && (
              <>
                <IconButton color="inherit" onClick={handleMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  <MenuItem onClick={handleMenuClose}>Sign Out</MenuItem>
                </Menu>
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}
