require('dotenv').config({ path: './keys.env' }); // Load environment variables from Key.env
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios'); // Import axios

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// MongoDB Config
const db = process.env.MONGO_URI; // Replace with your MongoDB connection string

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// User Schema
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetToken: String,
    resetTokenExpiration: Date
});

const User = mongoose.model('User', UserSchema);

app.use(express.static(path.join(__dirname, 'Chatshop AI Code')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Chatshop AI Code', 'Home.html'));
});

// Route to handle chat requests directly
app.post('/api/chat/product-chat', async (req, res) => {
    const { session_key, email, message } = req.body;
    console.log('Chat route hit');
    console.log('Received:', { session_key, email, message });

    try {
        const response = await axios.post('http://104.209.179.162/v1/chat/product-chat', {
            session_key,
            email,
            message
        });

        // Send the response back to the client
        res.json(response.data);
    } catch (error) {
        console.error('Error during chat request:', error.message);
        console.error('Error details:', error.response ? error.response.data : error.message);
        res.status(error.response?.status || 500).json({ msg: 'Server error', details: error.message });
    }
});

// Register Route
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    console.log('Register route hit');
    console.log('Received:', { email, password });

    if (!email || !password) {
        console.log('Missing fields');
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('User already exists');
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password: hashedPassword
        });

        await newUser.save();
        console.log('User registered successfully');
        res.json({ msg: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Login route hit');
    console.log('Received:', { email, password });

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Invalid credentials: User not found');
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid credentials: Password mismatch');
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Login successful, token generated');
        res.json({ token, username: user.email.split('@')[0] });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Forgot Password Route
app.post('/api/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send('User not found');
        }
        
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpiration = Date.now() + 3600000; // 1 hour from now

        await user.save();

        const url = new URL(window.location.href);

        const resetURL = `https://${url.origin}/reset-password?token=${resetToken}&email=${email}`;
        await sendPasswordResetEmail(user.email, resetURL);

        res.send('Password reset link sent');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Dummy email sending function
async function sendPasswordResetEmail(email, resetURL) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset',
        text: `You requested a password reset. Click the following link to reset your password: ${resetURL}`,
        html: `<p>You requested a password reset.</p>
               <p>Click the following link to reset your password:</p>
               <a href="${resetURL}">${resetURL}</a>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully');
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
}

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
