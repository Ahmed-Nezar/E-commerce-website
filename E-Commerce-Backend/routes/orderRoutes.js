const express = require('express');
const router  = express.Router();
const oc = require('../controllers/orderController');

router.get('/cart', oc.getCart);
router.post('/cart', oc.addToCart);
router.put('/cart/:productId', oc.updateCartItem);
router.delete('/cart/:productId', oc.removeCartItem);
router.post('/checkout', oc.checkout);

// APIs for Paid Orders
router.get('/history', oc.getOrderHistory); // View all paid orders (paginated)
router.put('/:orderId', oc.editPaidOrder);  // Edit a specific paid order

/*
    ----------------
    ** Fully Tested:
    ----------------
    √ GET /cart without token → error (12 ms)
    √ GET /cart → empty cart shell (86 ms)
    √ POST /cart add invalid product → 404 (82 ms)
    √ POST /cart → add prodA x2 (242 ms)
    √ POST /cart → add prodB x1 (235 ms)
    √ PUT /cart/:pid nonexistent → 404 (81 ms)
    √ PUT /cart/:pid → update prodA to qty=5 (234 ms)
    √ PUT /cart/:pid qty=0 → removes prodA (309 ms)
    √ DELETE /cart/:pid nonexistent → 404 (81 ms)
    √ DELETE /cart/:pid → remove prodB (468 ms)
    √ POST /checkout with empty cart → 400 (81 ms)
    √ Full flow: add then checkout (489 ms)
    √ GET /cart after checkout → empty shell again (81 ms)
*/

module.exports = router;
