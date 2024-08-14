import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button,TableBody, Typography, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Studentupdateform from './Studentupdateform';
import './App.css';

const ClassList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('authtoken'); // Retrieve token from local storage
    //  const teacherid = localStorage.getItem('id');
    
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [id, setId] = useState();
    const [classroom, setClassroom] = useState();
  
  console.log(students);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`https://classroom-website-1.onrender.com/api/auth/studentlist`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add authorization header if needed
          },
        });
        console.log(response);
        setStudents(response.data.classroomstudents); // Assuming the response contains a 'students' array
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [token]);

  const handleOpenModal = (email, name, studentid, classroomname) => {
    setShowModal(true);
    setEmail(email);
    setName(name);
    setId(studentid);
    setClassroom(classroomname);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Do you want to delete this student?')) {
      try {
        await axios.delete(`https://classroom-website-1.onrender.com/api/auth/students/${studentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStudents(students.filter(student => student.user_id !== studentId));
      } catch (error) {
        alert('Delete failed');
        console.error('Error:', error);
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='main-container'>
        <Typography variant="h2" gutterBottom>Students List</Typography>

    <TableContainer component={Paper}>
      <Table>
        <TableHead className='table-header'>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Classroom</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student,index) => (
            <TableRow index={student.user_id}>
              <TableCell>{student.user_id}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.classroom_name}</TableCell>
              <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleOpenModal(student.email, student.name, student.user_id, student.classroom_name)}>
                    Update
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(student.user_id)} style={{ marginLeft: 8 }}>
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
            maxWidth: 600,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 6,
            borderRadius: 2,
          }}
        >
          <Studentupdateform
            studentemail={email}
            studentname={name}
            userid={id}
            onClose={handleCloseModal}
            classname={classroom}
          />
        </Box>
      </Modal>
      </div>
  );
};

export default ClassList;
