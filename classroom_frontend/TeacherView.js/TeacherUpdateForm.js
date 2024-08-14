import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const Teacherupdateform = ({ teacheremail, teachername, userid, onClose }) => {
  const [email, setEmail] = useState(teacheremail);
  const [name, setName] = useState(teachername);
  const id = Number(userid);

  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      console.log(id);
      const response = await axios.put(`http://localhost:3000/api/auth/teachers/${id}`, { email, name });
      console.log(response);
      onClose();
    } catch (error) {
      alert('Update failed');
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
          Update Teacher
        </Typography>
        <form onSubmit={handleUpdate} style={{ width: '100%' }}>
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
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Update Account
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default Teacherupdateform;
