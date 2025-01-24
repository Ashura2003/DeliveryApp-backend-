const router = require("express").Router();
const cartController = require("../controllers/cartController");
const authGuard = require("../middleware/auth");

// Cart Routes
router.post("/addToCart", authGuard, cartController.addToCart);
router.post("/removeFromCart", authGuard, cartController.removeFromCart);
router.get("/getCart", authGuard, cartController.getCart);

module.exports = router;
