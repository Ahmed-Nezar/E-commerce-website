const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../config/db');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const ResetPasswordEmailTemplate = require('../components/EmailTemplates/ResetPasswordEmailTemplate');

// Configure nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // App Password generated from Google Account
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Verify transporter connection
transporter.verify(function(error, success) {
    if (error) {
        console.log("Error verifying email configuration:", error);
    } else {
        console.log("Email server is ready to send messages");
    }
});

// Register a new user
exports.register = async (req, res) => {
    try {
        const { name, email, gender, password, isAdmin, _id } = req.body;

        // Check if the user already exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ error: 'User already exists' });
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
            data: userResponse
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error registering user', message: error.message });
    }
};

// Login a user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
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
        res.status(500).json({ error: 'Error logging in', message: error });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        // Validate password requirements
        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({ 
                error: 'New password must be at least 8 characters long'
            });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Check if new password is different from current
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ 
                error: 'New password must be different from current password' 
            });
        }

        // Update password
        user.password = newPassword; // Will be hashed by pre-save hook
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ 
            error: 'Error changing password', 
            message: error.message 
        });
    }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        // If no user found with this email
        if (!user) {
            return res.status(404).json({
                error: 'No account found with this email address'
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // Save hashed token
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

        try {
            await user.save();

            // Create reset URL - make sure FRONTEND_URL is correct in your .env
            const resetUrl = `${process.env.VITE_FRONTEND_URL}/reset-password/${resetToken}`;

            // Send email using the new template
            await transporter.sendMail({
                from: {
                    name: 'E-Commerce Support',
                    address: process.env.EMAIL_USER
                },
                to: user.email,
                subject: 'Password Reset Request',
                html: ResetPasswordEmailTemplate(resetUrl)
            });

            res.status(200).json({
                message: 'Password reset instructions have been sent to your email'
            });
        } catch (error) {
            console.error('Email sending error:', error);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();

            return res.status(500).json({
                error: 'Error sending email. Please try again later.',
                details: error.message
            });
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            error: 'An error occurred while processing your request'
        });
    }
};

// Reset password
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Hash token
        const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with token and check if expired
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                error: 'Invalid or expired reset token. Please request a new password reset.'
            });
        }

        // Update password and clear reset token fields
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            message: 'Password has been reset successfully'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            error: 'An error occurred while resetting your password. Please try again.'
        });
    }
};