import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/teachers'); // Replace with your API endpoint
        setTeachers(response.data.teachers); // Adjust according to your API response structure
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeachers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Teachers List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            {/* <th>Name</th> */}
            <th>Email</th>
            {/* Add more columns if needed */}
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.user_id}>
              <td>{teacher.user_id}</td>
              {/* <td>{teacher.name}</td> */}
              <td>{teacher.email}</td>
              {/* Add more cells if needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeachersList;

