"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  useScrollTrigger,
  Slide,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

function HideOnScroll(props: { children: React.ReactElement; window?: () => Window }) {
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

export default function Header() {
  const pathname = usePathname();
  const hiddenPages = ['/login', '/register'];
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const hasAppBar = !hiddenPages.includes(pathname);
    const main = document.querySelector('main');
    if (main) {
      main.style.marginTop = hasAppBar ? '64px' : '0';
    }
  }, [pathname, mounted]);

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  if (!mounted) {
    return null;
  }

  const hasAppBar = !hiddenPages.includes(pathname);
  const showLoginButton = pathname === '/transactions';

  if (!hasAppBar) {
    return null;
  }

  return (
    <>
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
            {showLoginButton && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={handleDrawerOpen}
              >
                <MenuIcon />
              </IconButton>
            )}
            <AccountBalanceWalletIcon sx={{ mr: 1 }} />
            
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ flexGrow: 1, fontWeight: 'bold' }}
            >
              Bytebank
            </Typography>
            {
              !showLoginButton && (
                <Button color="inherit" onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('authToken');
                    window.location.href = '/login';
                  }
                }}>
                  Login
                </Button>
              )
            }
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerClose}>
        <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerClose}>
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="Início" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="Transações" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="Transferencia" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="Investimentos" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('authToken');
                    window.location.href = '/login';
                  }
                }}
              >
                <ListItemText primary="Sair" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}