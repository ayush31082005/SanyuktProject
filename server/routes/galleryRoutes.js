const express = require("express");
const router = express.Router();
const { getAllImages, addImage, deleteImage, updateImage, getGallery } = require("../controllers/galleryController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Always store inside server/uploads/gallery so express.static('/uploads') can serve it.
        const dir = path.join(__dirname, "..", "uploads", "gallery");
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => { cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "-")) }
});
const upload = multer({ storage });

router.get("/all", getAllImages);
router.post("/add", upload.single("image"), addImage);
router.delete("/:id", protect, adminOnly, deleteImage);
// Adding aliases and extra routes for compatibility
router.delete("/delete/:id", protect, adminOnly, deleteImage);
router.put("/update/:id", upload.single("image"), updateImage);

module.exports = router;
