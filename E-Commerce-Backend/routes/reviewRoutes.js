const express = require('express');
const router = express.Router();

router.get('/review', (req, res) => {
    res.send('Review Router');
});

module.exports = router;

