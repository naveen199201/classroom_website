import React, { useState } from 'react';
import axios from 'axios';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('teacher');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:3000/api/auth/signup',
        { email, password, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('User created successfully');
    } catch (error) {
      alert('Signup failed');
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <h2>Signup</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="teacher">Teacher</option>
        <option value="student">Student</option>
      </select>
      <button type="submit">Create Account</button>
    </form>
  );
}

export default Signup;
