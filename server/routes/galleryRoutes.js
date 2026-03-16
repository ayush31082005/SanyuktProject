const express = require("express")
const router = express.Router()
const multer = require("multer")
const galleryController = require("../controllers/galleryController")

const storage = multer.diskStorage({
    destination: "uploads/gallery",
    filename: (req, file, cb) => { cb(null, Date.now() + "-" + file.originalname) }
})
const upload = multer({ storage })

router.post("/add", upload.single("image"), galleryController.addImage)
router.get("/all", galleryController.getGallery)
router.delete("/delete/:id", galleryController.deleteImage)
router.put("/update/:id", upload.single("image"), galleryController.updateImage)

module.exports = router
