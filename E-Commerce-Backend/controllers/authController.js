const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../config/db');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { name, email, gender, password, isAdmin } = req.body;

        // 1) If they requested isAdmin=true, manually verify their token:
        let adminFlag = false;
        if (isAdmin) {
            const authHeader = req.headers['authorization'];
            if (!authHeader) {
                return res
                    .status(401)
                    .json({ message: 'Admin token required to create admin users' });
            }

            let decoded;
            try {
                decoded = jwt.verify(authHeader, process.env.SECRET_KEY);
            } catch (err) {
                return res
                    .status(401)
                    .json({ message: 'Invalid or expired token' });
            }

            // 2) Ensure the token belongs to an existing admin:
            if (!decoded.isAdmin) {
                return res
                    .status(403)
                    .json({ message: 'Only admins can create other admins' });
            }

            adminFlag = true;
        }

        // Check if the user already exists
        const userExist = await User.find({ email });
        if (userExist.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 3) Build the user object, only setting isAdmin if adminFlag==true
        const newUser = new User({
            name,
            email,
            password,
            gender,
            isAdmin: adminFlag
        });
        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id:         newUser._id,
                name:       newUser.name,
                email:      newUser.email,
                gender:     newUser.gender,
                isAdmin:    newUser.isAdmin,
                profilePic: newUser.profilePic
            }
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