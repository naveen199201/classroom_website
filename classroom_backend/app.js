const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./auth');
const { pool } = require('./db');
const { createUsersTable, createPrincipalAccount } = require('./user');

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Test database connection
pool.connect((err) => {
    if (err) {
        console.error('Database connection error', err.stack);
    } else {
        console.log('Connected to PostgreSQL');
    }
});

// Create users table and principal account on startup
(async () => {
    await createUsersTable();
    await createPrincipalAccount();
})();

// Routes
app.use('/api/auth', authRoutes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
