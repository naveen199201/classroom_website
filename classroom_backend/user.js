const { pool } = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create tables
const createUsersTable = async () => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(300) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('Principal', 'Teacher', 'Student'))
    );

    CREATE TABLE IF NOT EXISTS teachers (
        id SERIAL PRIMARY KEY,
        is_class_assigned BOOLEAN NOT NULL DEFAULT FALSE,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
    
    CREATE TABLE IF NOT EXISTS students (
        user_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        CONSTRAINT classroom_foreign_key FOREIGN KEY (classroom_id)
        REFERENCES classrooms(id)
    );
    `;
    await pool.query(queryText);
};

// Create a principal account on startup
const createPrincipalAccount = async () => {
    const queryText = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(queryText, ['principal3@classroom.com']);
    if (result.rows.length === 0) {
        const hashedPassword = await bcrypt.hash('Admin', 10);
        const insertText = `
        INSERT INTO users (email, password, role) 
        VALUES ($1, $2, $3)
        RETURNING id, email, role
        `;
        const newUser = await pool.query(insertText, ['principal3@classroom.com', hashedPassword, 'Principal']);

        // Generate JWT token for the principal
        const token = jwt.sign(
            { id: newUser.rows[0].id, email: newUser.rows[0].email, role: newUser.rows[0].role },
            'shhhhh', // Use environment variable for secret in production
            { expiresIn: '1h' }
        );

        console.log('Principal account created');
        console.log('JWT Token for Principal:', token);
    }
};

// Create a new user (only by principal)
const createUser = async (email,name, password, role) => {
    // Ensure that the role is valid
    
    if (!['Teacher', 'Student'].includes(role)) {
        throw new Error('Invalid role');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertText = `
    INSERT INTO users (email,name, password, role) 
    VALUES ($1, $2, $3, $4)
    RETURNING id, name,email, role
    `;
    
    const result = await pool.query(insertText, [email,name, hashedPassword, role]);
    const userId = result.rows[0].id;

    if (role === 'Teacher') {
        const insertTeacherText = `
        INSERT INTO teachers (user_id)
        VALUES ($1)
        `;
        await pool.query(insertTeacherText, [userId]);
    } else if (role === 'Student') {
        const insertStudentText = `
        INSERT INTO students (user_id)
        VALUES ($1)
        `;
        await pool.query(insertStudentText, [userId]);
    }

    return result.rows[0];
};

// Authenticate user
const authenticateUser = async (email, password) => {
    const queryText = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(queryText, [email]);

    if (result.rows.length > 0) {
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            return { id: user.id, email: user.email, role: user.role };
        }
    }
    return null;
};

module.exports = { createUsersTable, createPrincipalAccount, createUser, authenticateUser };

