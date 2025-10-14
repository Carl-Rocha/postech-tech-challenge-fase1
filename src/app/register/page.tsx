"use client";

import React, { useState } from 'react';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import Image from 'next/image';
import { AuthService } from '@/services/AuthService';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await AuthService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex'
    }}>
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
        <Box sx={{ textAlign: 'center', zIndex: 2 }}>
          <Image
            src="/images/login.svg"
            alt="Online Banking"
            width={400}
            height={400}
          />
        </Box>
      </Box>

      {/* form */}
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
          {/* header */}
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

          {/* form */}
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

            {error && (
              <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
                {error}
              </Typography>
            )}

            <Button variant="contained" className="mb-3" type="submit" disabled={loading} fullWidth sx={{fontWeight: 'bold'}}>
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </Button>

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
