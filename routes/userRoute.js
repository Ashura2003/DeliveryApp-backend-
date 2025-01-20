const router = require("express").Router();
const userController = require("../controllers/userController");

//User Routes
router.post("/register", userController.userRegister);
router.post("/login", userController.userLogin);

//Export Router
module.exports = router;