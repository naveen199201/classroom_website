import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Typography,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';

const Studentupdateform = ({ studentemail, studentname, userid, classname, onClose }) => {
  const [email, setEmail] = useState(studentemail);
  const [name, setName] = useState(studentname);
  const [selectedClassroom, setSelectedClassroom] = useState(classname);
  const id = Number(userid);
  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await axios.get('https://classroom-website-1.onrender.com/api/auth/classroomnames');
        setClassrooms(response.data.classroomnames);
      } catch (error) {
        console.error('Error fetching classrooms:', error);
      }
    };

    fetchClassrooms();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://classroom-website-1.onrender.com/api/auth/students/${id}`, { email, name, classroomName: selectedClassroom });
      onClose();
    } catch (error) {
      alert('Update failed');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleUpdate}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: 400,
        p: 3,
        bgcolor: '#fefefe',
        boxShadow: 2,
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" component="h2" gutterBottom>
        Update Student
      </Typography>
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
      />
      <TextField
        label="Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
      />
      <FormControl fullWidth required>
        <InputLabel>Select Classroom</InputLabel>
        <Select
          value={selectedClassroom}
          onChange={(e) => setSelectedClassroom(e.target.value)}
        >
          <MenuItem value="" disabled>Select Classroom</MenuItem>
          {classrooms.map((classroom, index) => (
            <MenuItem key={index} value={classroom.classroom_name}>
              {classroom.classroom_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary" sx={{py:2}} fullWidth>
        Update Account
      </Button>
    </Box>
  );
};

export default Studentupdateform;
