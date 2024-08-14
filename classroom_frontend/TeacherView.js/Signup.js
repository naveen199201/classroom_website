import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Select, MenuItem, Button, Container, Typography, Box } from '@mui/material';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('teacher');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:3000/api/auth/signup',
        { email, password, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('User created successfully');
    } catch (error) {
      alert('Signup failed');
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
          Signup
        </Typography>
        <form onSubmit={handleSignup} style={{ width: '100%' }}>
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
          <Select
            fullWidth
            margin="normal"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="teacher">Teacher</MenuItem>
            <MenuItem value="student">Student</MenuItem>
          </Select>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Create Account
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default Signup;
