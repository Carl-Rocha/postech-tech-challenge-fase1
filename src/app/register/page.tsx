"use client";

import React, { useState } from 'react';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Link,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Person,
  Lock,
} from '@mui/icons-material';
import Image from 'next/image';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register data:', formData);
    // Implementar lógica de registro aqui
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex'
    }}>
      {/* Seção Esquerda - Ilustração */}
      <Box sx={{
        flex: 1,
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#EEF3FC',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Ilustração principal */}
        <Box sx={{ textAlign: 'center', zIndex: 2 }}>
          <Image
            src="/images/login.svg"
            alt="Online Banking"
            width={400}
            height={400}
          />
        </Box>
      </Box>

      {/* Seção Direita - Formulário */}
      <Box sx={{
        flex: { xs: 1, lg: 0.6 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        background: 'white'
      }}>
        <Card sx={{
          width: '100%',
          maxWidth: 400,
          padding: 4,
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          borderRadius: 3
        }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 'bold', 
              color: '#2c3e50',
              mb: 1
            }}>
              Criar Conta no Bytebank
            </Typography>
            <Typography variant="body1" sx={{ 
              color: '#7f8c8d',
              mb: 3
            }}>
              Comece sua jornada financeira conosco
            </Typography>
          </Box>

          {/* Formulário */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Usuário"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Senha"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ color: '#7f8c8d', fontSize: '0.85rem' }}>
                Ao criar uma conta, você concorda com nossos{' '}
                <Link 
                  href="#" 
                  sx={{ 
                    color: '#5D87FF', 
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Termos de Uso
                </Link>
                {' '}e{' '}
                <Link 
                  href="#" 
                  sx={{ 
                    color: '#5D87FF', 
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Política de Privacidade
                </Link>
              </Typography>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #5D87FF 0%, #8BB3FF 100%)',
                padding: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: '0 4px 15px rgba(93, 135, 255, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4A6FE8 0%, #7BA3FF 100%)',
                  boxShadow: '0 6px 20px rgba(93, 135, 255, 0.4)',
                }
              }}
            >
              Criar Conta
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                ou crie com
              </Typography>
            </Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                Já tem uma conta?{' '}
                <Link 
                  href="/login" 
                  sx={{ 
                    color: '#5D87FF', 
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Fazer login
                </Link>
              </Typography>
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
