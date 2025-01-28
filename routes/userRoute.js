const router = require("express").Router();
const userController = require("../controllers/userController");
const authGuard = require("../middleware/auth");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/profile/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

//User Routes
router.post("/register", userController.userRegister);
router.post("/login", userController.userLogin);
router.get("/get_user", authGuard, userController.userProfile);
router.post(
  "/edit_user",
  upload.single("image"),
  authGuard,
  userController.editUserProfile
);
router.post("/delete_user", authGuard, userController.deleteUser);
router.post("/forgot_password", userController.forgotPassword);
router.post("/reset_password", userController.resetPassword);

//Export Router
module.exports = router;
