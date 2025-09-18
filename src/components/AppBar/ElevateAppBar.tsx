"use client";

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  useScrollTrigger,
  Slide,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

interface Props {
  window?: () => Window;
  children: React.ReactElement;
}

function HideOnScroll(props: Props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function ElevateAppBar() {
  return (
    <HideOnScroll>
      <AppBar 
        position="fixed" 
        elevation={4}
        sx={{
          backgroundColor: '#5D87FF',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <AccountBalanceWalletIcon sx={{ mr: 1 }} />
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1, fontWeight: 'bold' }}
          >
            Bytebank
          </Typography>
          
          <Button color="inherit" sx={{ mr: 2 }}>
            Transações
          </Button>
          
          <Button color="inherit">
            Login
          </Button>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
}
