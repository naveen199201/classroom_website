import React from 'react';
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PrincipalView = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', p: 2 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleNavigation('/studentlist')}
      >
        Students
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleNavigation('/teacherlist')}
      >
        Teachers
      </Button>
      <Button
        variant="contained"
        color="success"
        onClick={() => handleNavigation('/classrooms')}
      >
        create Classroom
      </Button>
      <Button
        variant="contained"
        color="warning"
        onClick={() => handleNavigation('/signup')}
      >
        Create User
      </Button>
    </Box>
  );
};

export default PrincipalView;
