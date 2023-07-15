import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

export default function Navbar() {
    return (
        <div>
            <Box>
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <Box sx={{padding : "3rem"}}>
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
