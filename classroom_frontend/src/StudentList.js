import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/students'); // Replace with your API endpoint
        setStudents(response.data.students);
        console.log(response.data)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, []);
//   console.log(response.data)

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Students List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            {/* <th>Name</th> */}
            <th>Email</th>
            
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.user_id}>
              <td>{student.user_id}</td>
              {/* <td>{student.name}</td> */}
              <td>{student.email}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsList;
