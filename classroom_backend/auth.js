const express = require('express');
const jwt = require('jsonwebtoken');
const { createUser, authenticateUser } = require('./user');
const { pool } = require('./db');

const router = express.Router();

const ClassroomTable = async () => {
    console.log("query");
    const queryClassroom = `
    CREATE TABLE IF NOT EXISTS classrooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    teacher_id INTEGER NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES teachers(user_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS schedules (
    id SERIAL PRIMARY KEY,
    classroom_id INTEGER NOT NULL,
    day VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE
    );
    `;
    console.log('classroom table created');
    await pool.query(queryClassroom);
}
const SubjectsTable = async () => {
    const querySubjects = `
    CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
    
);
`;
    await pool.query(querySubjects);
}

const PeriodsTable = async () => {
    const queryPeriods = `
    CREATE TABLE IF NOT EXISTS periods (
    id SERIAL PRIMARY KEY,
    classroom_id INTEGER NOT NULL,
    day VARCHAR(20) NOT NULL,
    index VARCHAR(255) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE,
    subject_id INTEGER,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL
);
    `;
    await pool.query(queryPeriods);
}


const verifyPrincipal = (req, res, next) => {
    console.log("tokens");
    const token = req.header('Authorization').replace('Bearer ', '');
    console.log(token);
    try {
        console.log("token connect")
        const decoded = jwt.verify(token, 'shhhhh');
        if (decoded.role === 'Principal') {
            req.user = decoded;
            console.log('access granted')
            next();
        } else {
            res.status(403).json({ message: 'Access denied' });
        }
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Middleware to verify the principal's or teacher's JWT token
const verifyRole = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, 'shhhhh'); // Use environment variable for secret in production
        req.user = decoded;

        if (decoded.role === 'Principal' || decoded.role === 'Teacher') {
            next();
        } else {
            res.status(403).json({ message: 'Access denied' });
        }
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Middleware to check if the user is a teacher and restrict them to creating students only
const restrictTeacher = (req, res, next) => {
    if (req.user.role === 'Teacher' && req.body.role !== 'Student') {
        return res.status(403).json({ message: 'Teachers can only create students' });
    }
    next();
};
const parseTime = (timeStr) => {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0); // Set hours, minutes, seconds, and milliseconds
    return date;
};

// Signup Route (for principal to create Teacher accounts and for teachers to create Student accounts)
router.post('/signup', verifyRole, restrictTeacher, async (req, res) => {
    const { email, password, role,name } = req.body;

    if (role !== 'Teacher' && role !== 'Student') {
        return res.status(400).json({ message: 'Invalid role' });
    }

    try {
        const newUser = await createUser(email, name,password, role);
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating user', error });
    }
});
router.get('/teachers', async (req, res) => {
    try {
        console
        const queryText = `
            SELECT 
                t.user_id, 
                u.email, 
                u.role
            FROM 
                teachers t
            INNER JOIN 
                users u ON t.user_id = u.id
        `;
        const result = await pool.query(queryText);
        res.json({ teachers: result.rows });
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ error: 'Failed to fetch teachers' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, 'shhhhh', {
            expiresIn: '1h',
        });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Error during login', error });
    }
});


router.post('/classrooms', verifyPrincipal, async (req, res) => {

    console.log('main body');
    ClassroomTable();
    const { name, teacher_id, schedules } = req.body;
    console.log('req.body');

    try {
        // Start a transaction
        console.log('begin')
        // await pool.query('BEGIN');
        console.log('begins')

        // Insert the classroom
        const classroomResult = await pool.query(
            'INSERT INTO classrooms (name, teacher_id) VALUES ($1, $2) RETURNING id;',
            [name, teacher_id]
        );

        const teacherResult = await pool.query(
            'UPDATE teachers SET is_class_assigned = TRUE WHERE user_id = $1;',
            [teacher_id]
        );
        console.log(teacherResult);
        const classroomId = classroomResult.rows[0].id;

        // Insert schedules
        const schedulePromises = schedules.map(schedule => {
            return pool.query(
                'INSERT INTO schedules (classroom_id, day, start_time, end_time) VALUES ($1, $2, $3, $4)',
                [classroomId, schedule.day, schedule.startTime, schedule.endTime]
            );
        });

        await Promise.all(schedulePromises);

        // Commit the transaction
        // await pool.queryClassroom('COMMIT');

        res.status(201).json({ message: 'Classroom created successfully', classroomId });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error creating classroom:', error);
        res.status(500).json({ error: 'Failed to create classroom' });
    }
});

router.post('/update-subjects', async (req, res) => {
    try {
        update_query = ""
    // const body = [{'period_id':'1',
    //     'subject_name':'Hindi'
    // },{
    //     'period_id':'2',
    //     'subject_name':'Telugu'
    // }];
    for (const data of req.body){
        const { period_id, subject_name } = data;
        update_query = update_query+"update periods set subject_name='"+subject_name+"' where period_id="+period_id+";"
    }
    console.log(update_query)
    await pool.query(update_query);
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error updating subjects:', error);
        res.status(500).json({ error: 'Failed to update subjects' });
    }
})
router.post('/generate-periods', async (req, res) => {
    try {
        // Fetch all schedules
        const schedules = await pool.query('SELECT * FROM schedules');
        console.log('schedules');
        SubjectsTable();
        PeriodsTable();

        for (const schedule of schedules.rows) {
            const { classroom_id, day, start_time, end_time } = schedule;

            // Parse start and end times
            let currentStartTime = parseTime(start_time);
            const endTime = parseTime(end_time);

            // Generate periods of 1 hour each
            index = 1
            while (currentStartTime < endTime) {
                const currentEndTime = new Date(currentStartTime.getTime() + 60 * 60 * 1000);

                // Insert period into periods table
                await pool.query(
                    'INSERT INTO periods (classroom_id, day, index,start_time, end_time) VALUES ($1, $2, $3, $4, $5)',
                    [
                        classroom_id,
                        day,
                        'period-' + index,
                        currentStartTime.toTimeString().slice(0, 8),
                        currentEndTime.toTimeString().slice(0, 8),
                    ]
                );
                console.log(index, 'created')
                // Move to the next period
                currentStartTime = currentEndTime;
                index = index + 1;
            }
        }

        // Commit the transaction
        await pool.query('COMMIT');
        res.status(201).json({ message: 'Periods generated successfully' });

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error generating periods:', error);
        res.status(500).json({ error: 'Failed to generate periods' });
    }
})

module.exports = router;








// const express = require('express');
// const jwt = require('jsonwebtoken');
// const { createUser, authenticateUser } = require('./user');

// const router = express.Router();

// // Middleware to verify the principal's JWT token
// const verifyPrincipal = (req, res, next) => {
//     console.log("tokens");
//     const token = req.header('Authorization').replace('Bearer ', '');
//     console.log(token);
//     try {
//         console.log("token connect")
//         const decoded = jwt.verify(token, 'shhhhh');
//         if (decoded.role === 'Principal') {
//             req.user = decoded;
//             next();
//         } else {
//             res.status(403).json({ message: 'Access denied' });
//         }
//     } catch (err) {
//         res.status(401).json({ message: 'Invalid token' });
//     }
// };

// // Signup Route (only for principal to create Teacher accounts)
// router.post('/signup', verifyPrincipal, async (req, res) => {
//     const { email, password, role } = req.body;

//     if (role !== 'Teacher' && role !== 'Student') {
//         return res.status(400).json({ message: 'Invalid role' });
//     }

//     try {
//         const newUser = await createUser(email, password, role);
//         res.status(201).json({ message: 'User created successfully', user: newUser });
//     } catch (error) {
//         res.status(500).json({ message: 'Error creating user', error });
//     }
// });

// // Login Route
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await authenticateUser(email, password);
//         if (!user) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }

//         const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, 'shhhhh', {
//             expiresIn: '1h',
//         });

//         res.json({ message: 'Login successful', token });
//     } catch (error) {
//         res.status(500).json({ message: 'Error during login', error });
//     }
// });

// module.exports = router;
