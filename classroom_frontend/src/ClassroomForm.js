import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { json } from 'react-router-dom';

const ClassroomForm = () => {
  const [teachers, setTeachers] = useState([]);
  const [classroomName, setClassroomName] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [schedules, setSchedules] = useState([{ day: '', startTime: '', endTime: '' }]);

  useEffect(() => {
    // Fetch teachers for the dropdown
    axios.get('http://localhost:3000/api/auth/teachers')
      .then(response => {
        setTeachers(response.data.teachers);
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
    // console.log(data)
    const data = {
      name: classroomName,
      teacher_id: parseInt(teacherId), // Adjust key to match JSON format
      schedules
    };
    const classdata= JSON.stringify(data)
    console.log(classdata);
    console.log(data.schedules[0])

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
    <div>
      <h1>Create a New Classroom</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Classroom Name:</label>
          <input 
            type="text" 
            value={classroomName} 
            onChange={(e) => setClassroomName(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Teacher:</label>
          <select 
            value={teacherId} 
            onChange={(e) => setTeacherId(e.target.value)} 
            required
          >
            <option value="">Select a teacher</option>
            {teachers.map(teacher => (
              <option key={teacher.user_id} value={teacher.user_id}>
                 {teacher.email}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h2>Schedules:</h2>
          {schedules.map((schedule, index) => (
            <div key={index}>
              <label>Day:</label>
              <select 
                value={schedule.day} 
                onChange={(e) => handleScheduleChange(index, 'day', e.target.value)} 
                required
              >
                <option value="">Select a day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>

              <label>Start Time:</label>
              <select 
                value={schedule.startTime} 
                onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)} 
                required
              >
                <option value="">Select start time</option>
                {[...Array(24).keys()].slice(1).map(hour => (
                  <option key={hour} value={hour < 10 ? `0${hour}:00` : `${hour}:00`}>
                    {hour < 10 ? `0${hour}` : hour}:00
                  </option>
                ))}
              </select>

              <label>End Time:</label>
              <select 
                value={schedule.endTime} 
                onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)} 
                required
              >
                <option value="">Select end time</option>
                {[...Array(24).keys()].slice(1).map(hour => (
                  <option key={hour} value={hour < 10 ? `0${hour}:00` : `${hour}:00`}>
                    {hour < 10 ? `0${hour}` : hour}:00
                  </option>
                ))}
              </select>
            </div>
          ))}
          <button type="button" onClick={addSchedule}>Add Another Schedule</button>
        </div>
        <button type="submit">Create Classroom</button>
      </form>
    </div>
  );
};

export default ClassroomForm;
