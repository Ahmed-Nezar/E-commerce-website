const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('List of products');
});

module.exports = router;
