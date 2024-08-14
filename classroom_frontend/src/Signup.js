import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Select, MenuItem, Button, Container, Typography, Box } from '@mui/material';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('teacher');
  

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://classroom-website-1.onrender.com/api/auth/signup',
        { email, password, name,role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('User created successfully');
    } catch (error) {
      alert('Signup failed');
    }
  };

  return (
    <Container className='main-container'>
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto', boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>

        <Typography variant="h4" component="h1" gutterBottom>
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
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            sx={{ mt: 2, py:2 }}
          >
            Create User
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default Signup;
