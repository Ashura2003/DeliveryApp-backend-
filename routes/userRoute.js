const router = require("express").Router();
const userController = require("../controllers/userController");
const authGuard = require("../middleware/auth");

//User Routes
router.post("/register", userController.userRegister);
router.post("/login", userController.userLogin);
router.get("/get_user", authGuard, userController.userProfile);
router.post("/edit_user", authGuard, userController.editUserProfile);
router.post("/delete_user", authGuard, userController.deleteUser);

//Export Router
module.exports = router;
