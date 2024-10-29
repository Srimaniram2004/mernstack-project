// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: Date, required: true },
    mobile: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('Register', userSchema);

// Check username availability
app.get('/check-username/:username', async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username });
    res.json({ available: !user });
});

// Register endpoint
app.post('/register', async (req, res) => {
    const { firstName, lastName, dob, mobile, username, password } = req.body;

    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ firstName, lastName, dob, mobile, username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error (username or mobile already exists)
            res.status(400).json({ message: 'Username or mobile number already exists.' });
        } else {
            res.status(500).json({ message: 'Error registering user.' });
        }
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid username or password' });
        }

        res.json({ msg: 'Login Success' });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Add this to your existing server.js code




// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
