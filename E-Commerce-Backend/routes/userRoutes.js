const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const VerifyToken   = require('../middlewares/VerifyToken');

/* ---------- current user (role = "user") ---------- */
router.get('/me',           VerifyToken('user'),  userController.getUserProfile);
router.put('/me',           VerifyToken('user'),  userController.updateProfile);

/* ---------- admin only ---------- */
router.route('/')                                   //  GET /api/users
      .get(VerifyToken('admin'), userController.getAllUsers);

router.route('/:id')                                //  PUT /api/users/:id
      .put(VerifyToken('admin'), userController.updateUser)
      .delete(VerifyToken('admin'), userController.deleteUser);

module.exports = router;
