require('dotenv').config({ path: './keys.env' }); // Load environment variables from Key.env
console.log('JWT_SECRET:', process.env.JWT_SECRET);  // Debugging line

const express = require('express');
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Use bcryptjs for consistency
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(express.json());
const PORT = process.env.PORT || 3000;

// Middleware
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

// Create the User model from the schema
const User = mongoose.model('User', UserSchema);

app.use(express.static(path.join(__dirname, 'Chatshop AI Code')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Chatshop AI Code', 'Home.html'));
  });


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
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Invalid credentials: User not found');
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid credentials: Password mismatch');
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate JWT token using the secret from the .env file
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log('Login successful, token generated');
        res.json({ token, username: user.email.split('@')[0] }); // Assuming the username is the part before @ in the email
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Add the Forgot Password Route
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

        const resetURL = `https://localhost:5000/reset-password?token=${resetToken}&email=${email}`;
        await sendPasswordResetEmail(user.email, resetURL);

        res.send('Password reset link sent');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Dummy email sending function (implementation comes later)
async function sendPasswordResetEmail(email, resetURL) {
    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Replace with your email provider
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS // Your email password
        }
    });

    // Set up email data
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to: email, // List of receivers
        subject: 'Password Reset', // Subject line
        text: `You requested a password reset. Click the following link to reset your password: ${resetURL}`,
        html: `<p>You requested a password reset.</p>
               <p>Click the following link to reset your password:</p>
               <a href="${resetURL}">${resetURL}</a>`
    };

    // Send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully');
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
}


// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
