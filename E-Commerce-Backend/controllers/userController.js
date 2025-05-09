const { default: mongoose } = require('mongoose');
const { User } = require('../config/db');

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, email, gender, password } = req.body;
        const loggedInUser = req.user;

        const user = await User.findById(loggedInUser._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // check name is correct (no numbers or special characters)
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (name && !nameRegex.test(name)) {
            return res.status(400).json({ message: 'Name can only contain letters and spaces' });
        }

        // check email is correct (valid email format)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // check gender is correct (male, female)
        const genderRegex = /^(Male|Female)$/;
        if (gender && !genderRegex ) {
            return res.status(400).json({ message: 'Invalid Gender format' });
        }


        if (name) user.name = name;
        if (email) user.email = email;
        if (gender) user.gender = gender;
        if (password) user.password = password; 

        await user.save();

        

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                gender: user.gender,
                profilePic: user.profilePic,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { name, email, gender, password } = req.body;

        
        const userID = req.params.id;
        if (!userID  || !mongoose.Types.ObjectId.isValid(userID)) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // check name is correct (no numbers or special characters)
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (name && !nameRegex.test(name)) {
            return res.status(400).json({ message: 'Name can only contain letters and spaces' });
        }

        // check email is correct (valid email format)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // check gender is correct (male, female)
        const genderRegex = /^(Male|Female)$/;
        if (gender && !genderRegex ) {
            return res.status(400).json({ message: 'Invalid Gender format' });
        }


        // Update fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (gender) user.gender = gender;
        if (password) user.password = password; // Will be hashed in the pre-save hook

        await user.save();

        res.status(200).json({
            message: 'User updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                gender: user.gender,
                profilePic: user.profilePic,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, editAddMode = false } = req.query;
        const skip = (page - 1) * limit;

        let query = User.find()
            .select('-password')
            .populate({
                    path: 'wishList'
                });

        if (!editAddMode) {
            query = query.skip(skip).limit(parseInt(limit));
        }

        // Execute the query
        const users = await query.exec();

        const totalUsers = await User.countDocuments();

        res.status(200).json({
            data: users,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalUsers / limit),
            totalNumberOfItems: totalUsers
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message:'Invalid user ID' });

    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message:'User not found' });

    res.status(204).json();
  } catch (err) {
    res.status(500).json({ message:'Error deleting user', error: err.message });
  }
};

