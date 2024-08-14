import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://classroom-website-1.onrender.com/api/auth/login', { email, password });
      localStorage.setItem('authtoken', response.data.token);
      localStorage.setItem('id',response.data.id );
      localStorage.setItem('role',response.data.role)
      const userRole=response.data.role
      if(userRole === 'Principal'){
      navigate('/principalview');
      }
      else if(userRole === 'Teacher'){
        navigate('/teacherview');
        }
        else if(userRole === 'Student'){
          navigate('/studentview');
        }
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 4,
          p: 3,
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default Login;
