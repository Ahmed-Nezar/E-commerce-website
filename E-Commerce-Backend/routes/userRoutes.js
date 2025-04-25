const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const VerifyToken = require('../middlewares/VerifyToken');

// Routes
router.get('/getProfile', VerifyToken("user"), userController.getUserProfile);
router.put('/updateProfile', VerifyToken("user"), userController.updateProfile);
router.put('/:id', VerifyToken("admin"), userController.updateUser); // Admin updates any user
router.get('/getAll', VerifyToken("admin"), userController.getAllUsers); // Admin gets all users
router.delete('/:id', VerifyToken("admin"), userController.deleteUser); // Admin deletes a user

module.exports = router;