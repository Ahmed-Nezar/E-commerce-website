const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.status(201).json({ message: `Login Route`, data: {} });
});

router.post('/register', (req, res) => {
    res.send('Register route');
});

module.exports = router;
