const router = require("express").Router();
const foodController = require("../controllers/foodController");
const multer = require("multer");

//Image Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

//Food Routes
router.post("/addFood", upload.single("image"), foodController.addFood);
router.get("/getFood", foodController.getFood);
router.delete("/removeFood/:id", foodController.removeFood);
router.put("/editFood/:id", upload.single("image"), foodController.editFood);

router.get("/get_food/:id", foodController.getSingleFood);

module.exports = router;