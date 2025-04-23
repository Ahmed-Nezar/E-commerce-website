const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../config/db');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { name, email, password, profilePic, isAdmin } = req.body;

        // Create a new user
        const newUser = await User.create({
            name,
            email,
            password, 
            profilePic,
            isAdmin
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: newUser,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

// Login a user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a token
        const token = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.SECRET_KEY, {
            expiresIn: '1h',
        });

        res.status(200).json({
            message: 'Login successful',
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};