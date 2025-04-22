const express = require('express');
const router = express.Router();

router.get('/coupon', (req, res) => {
    res.send('Coupon Router');
});

module.exports = router;

