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

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash new password and update
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error changing password', error: error.message });
    }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Find the user
        const user = await User.findOne({ email });
        if (!user) {
            // For security reasons, don't reveal if the email exists or not
            return res.status(200).json({ 
                message: 'If an account exists with this email, you will receive password reset instructions.' 
            });
        }

        // Generate a password reset token
        const resetToken = jwt.sign(
            { userId: user._id },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        // Store the reset token and its expiry in the user document
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
        await user.save();

        // In a real application, you would send an email here with the reset link
        // For now, we'll just return the token in the response
        res.status(200).json({
            message: 'If an account exists with this email, you will receive password reset instructions.',
            // Only include token in development
            ...(process.env.NODE_ENV === 'development' && { resetToken })
        });
    } catch (error) {
        res.status(500).json({ message: 'Error processing password reset request', error: error.message });
    }
};

// Reset password
exports.resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        // Find user with valid reset token
        const user = await User.findOne({
            resetToken,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Clear reset token fields
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;

        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting password', error: error.message });
    }
};