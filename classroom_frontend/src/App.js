import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import ClassroomForm from './ClassroomForm';
import StudentsList from './StudentList';
import TeachersList from './TeacherList';
import PrincipalView from './PrincipalView';
import ClassList from './ClassList';
import TeacherView from './TeacherView';
import StudentView from './StudentView';
import Classmates from './Classmates';
// import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/studentlist" element={<StudentsList />} />
        <Route path="/teacherlist" element={<TeachersList />} />
        <Route path="/classrooms" element={<ClassroomForm />} />
        <Route path="/principalview" element={<PrincipalView />} />
        <Route path="/teacherview" element={<TeacherView />} />
        <Route path="/studentview" element={<StudentView />} />
        <Route path="/classlist" element={<ClassList />} />
        <Route path="/classmates" element={<Classmates />} />

        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
