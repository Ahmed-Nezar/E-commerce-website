const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../config/db');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { name, email, gender, password, isAdmin, _id } = req.body;

        // Check if the user already exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user document
        const newUser = new User({
            ..._id && { _id }, // Only include _id if provided
            name,
            email,
            password, // Will be hashed by the pre-save middleware
            gender,
            isAdmin: isAdmin || false,
            profilePic: `${process.env.VITE_BACKEND_URL}/avatar/34` // For Frank Miller specifically
        });

        await newUser.save();

        // Don't send password back in response
        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json({
            message: 'User registered successfully',
            user: userResponse
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

// Login a user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // delete user.password;
        user = user.toObject();
        delete user.password; // Remove password from the user object

        // Generate a token
        const token = jwt.sign({
            ...user
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