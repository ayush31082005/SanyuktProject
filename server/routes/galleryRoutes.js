const express = require("express");
const router = express.Router();
const { getAllImages, addImage, deleteImage } = require("../controllers/galleryController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.get("/all", getAllImages);
router.post("/add", protect, adminOnly, upload.single("image"), addImage);
router.delete("/:id", protect, adminOnly, deleteImage);

module.exports = router;
