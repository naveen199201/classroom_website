import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table,TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

import './App.css';

const Classmates = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('authtoken'); // Retrieve token from local storage

  
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
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className='main-container'>
                <Typography variant="h2" gutterBottom>Classmates</Typography>

    <TableContainer component={Paper}>
      <Table>
        <TableHead className='table-header'>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student,index) => (
            <TableRow index={student.user_id}>
              <TableCell>{student.user_id}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
       
      </div>
  );
};

export default Classmates;
