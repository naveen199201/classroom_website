import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import ClassroomForm from './ClassroomForm';
import StudentsList from './StudentList';
import TeachersList from './TeacherList';
// import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClassroomForm />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/studentlist" element={<StudentsList />} />
        <Route path="/teacherlist" element={<TeachersList />} />

        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
