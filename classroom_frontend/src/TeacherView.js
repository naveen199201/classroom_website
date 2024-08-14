import React from 'react';
import { Button, Box, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TeacherView = () => {
  const navigate = useNavigate();
  const handleNavigation = (path) => {
    navigate(path);
  };
  const handleLogout = () => {
    // Clear the authentication token
    localStorage.removeItem('authtoken');
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection:'column', alignItems: 'center', px: 2, py: '10%' }}>
     <Stack spacing={3}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleNavigation('/classlist')}
      >
        Class
      </Button>

      <Button
        variant="contained"
        color="warning"
        onClick={() => handleNavigation('/signup')}
      >
        Create User
      </Button>
      <Button
        variant="contained"
        color="success"
        onClick={() => handleLogout('/classrooms')}
      >
        Logout
      </Button>
      </Stack> 
    </Box>
  );
};

export default TeacherView;