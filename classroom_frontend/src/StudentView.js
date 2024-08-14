import React from 'react';
import { Button, Box, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const StudentView = () => {
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
        onClick={() => handleNavigation('/classmates')}
      >
        Classmates
      </Button>
      <Button
        variant="contained"
        color="success"
        onClick={handleLogout}
      >
        Logout
      </Button>
      </Stack> 
    </Box>
  );
};

export default StudentView;