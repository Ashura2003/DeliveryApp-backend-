const orderController = require("../controllers/orderController");
const router = require("express").Router();
const authGuard = require("../middleware/auth");

// Order Routes
router.post("/placeOrder", authGuard, orderController.placeOrder);
router.post('/verify' , orderController.verifyOrder);

module.exports = router;
