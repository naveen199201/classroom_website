import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Modal,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import Teacherupdateform from './TeacherUpdateForm';

const TeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('authtoken');
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [id, setId] = useState();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/teachers'); 
        setTeachers(response.data.teachers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeachers();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  const handleOpenModal = (email, name, teacherid) => {
    setShowModal(true);
    setEmail(email);
    setName(name);
    setId(teacherid);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDelete = async (teacherId) => {
    if (window.confirm('Do you want to delete this teacher?')) {
      try {
        await axios.delete(`http://localhost:3000/api/auth/teachers/${teacherId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeachers(teachers.filter((teacher) => teacher.user_id !== teacherId));
      } catch (error) {
        alert('Delete failed');
        console.error('Error:', error);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Teachers List
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.user_id}>
                <TableCell>{teacher.user_id}</TableCell>
                <TableCell>{teacher.name}</TableCell>
                <TableCell>{teacher.email}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleOpenModal(teacher.email, teacher.name, teacher.user_id)}
                    sx={{ mr: 1 }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => handleDelete(teacher.user_id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        open={showModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Teacherupdateform
            teacheremail={email}
            teachername={name}
            userid={id}
            onClose={handleCloseModal}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default TeachersList;
