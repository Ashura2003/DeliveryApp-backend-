const orderController = require("../controllers/orderController");
const router = require("express").Router();
const authGuard = require("../middleware/auth");

// Order Routes
router.post("/placeOrder", authGuard, orderController.placeOrder);
router.post("/verify", orderController.verifyOrder);
router.get("/userOrders", authGuard, orderController.userOrders);

module.exports = router;
