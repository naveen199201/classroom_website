import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const ClassroomForm = () => {
  const [teachers, setTeachers] = useState([]);
  const [classroomName, setClassroomName] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [schedules, setSchedules] = useState([{ day: '', startTime: '', endTime: '' }]);

  useEffect(() => {
    // Fetch teachers for the dropdown
    axios.get('http://localhost:3000/api/auth/teachers')
      .then(response => {
        const unassignedTeachers = response.data.teachers.filter(teacher => !teacher.is_class_assigned);
        setTeachers(unassignedTeachers);
      })
      .catch(error => {
        console.error('Error fetching teachers:', error);
      });
  }, []);

  const handleScheduleChange = (index, field, value) => {
    const newSchedules = schedules.map((schedule, i) => (
      i === index ? { ...schedule, [field]: value } : schedule
    ));
    setSchedules(newSchedules);
  };

  const addSchedule = () => {
    setSchedules([...schedules, { day: '', startTime: '', endTime: '' }]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      name: classroomName,
      teacher_id: parseInt(teacherId),
      schedules
    };

    axios.post('http://localhost:3000/api/auth/classrooms', data)
      .then(response => {
        alert('Classroom created successfully!');
      })
      .catch(error => {
        console.error('Error creating classroom:', error);
        alert('Failed to create classroom.');
      });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto', boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create a New Classroom
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <TextField
            label="Classroom Name"
            value={classroomName}
            onChange={(e) => setClassroomName(e.target.value)}
            required
          />
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Teacher</InputLabel>
          <Select
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            required
          >
            <MenuItem value="">
              <em>Select a teacher</em>
            </MenuItem>
            {teachers.map((teacher) => (
              <MenuItem key={teacher.user_id} value={teacher.user_id}>
                {teacher.email}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="h6" gutterBottom>
          Schedules:
        </Typography>

        {schedules.map((schedule, index) => (
          <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Day</InputLabel>
                <Select
                  value={schedule.day}
                  onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                  required
                >
                  <MenuItem value=""><em>Select a day</em></MenuItem>
                  <MenuItem value="Monday">Monday</MenuItem>
                  <MenuItem value="Tuesday">Tuesday</MenuItem>
                  <MenuItem value="Wednesday">Wednesday</MenuItem>
                  <MenuItem value="Thursday">Thursday</MenuItem>
                  <MenuItem value="Friday">Friday</MenuItem>
                  <MenuItem value="Saturday">Saturday</MenuItem>
                  <MenuItem value="Sunday">Sunday</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Start Time</InputLabel>
                <Select
                  value={schedule.startTime}
                  onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                  required
                >
                  <MenuItem value=""><em>Select start time</em></MenuItem>
                  {[...Array(24).keys()].slice(1).map(hour => (
                    <MenuItem key={hour} value={hour < 10 ? `0${hour}:00` : `${hour}:00`}>
                      {hour < 10 ? `0${hour}` : hour}:00
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>End Time</InputLabel>
                <Select
                  value={schedule.endTime}
                  onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                  required
                >
                  <MenuItem value=""><em>Select end time</em></MenuItem>
                  {[...Array(24).keys()].slice(1).map(hour => (
                    <MenuItem key={hour} value={hour < 10 ? `0${hour}:00` : `${hour}:00`}>
                      {hour < 10 ? `0${hour}` : hour}:00
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        ))}

        <Box textAlign="center" sx={{ mb: 2 }}>
          <IconButton color="primary" onClick={addSchedule}>
            <AddIcon />
          </IconButton>
        </Box>

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Create Classroom
        </Button>
      </form>
    </Box>
  );
};

export default ClassroomForm;
