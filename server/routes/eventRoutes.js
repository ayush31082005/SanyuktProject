const express = require("express")
const router = express.Router()
const multer = require("multer")
const fs = require("fs")
const eventController = require("../controllers/eventController")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "uploads/events";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => { cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "-")) }
})
const upload = multer({ storage })

router.post("/add", upload.single("image"), eventController.addEvent)
router.get("/all", eventController.getEvents)
router.delete("/delete/:id", eventController.deleteEvent)
router.put("/update/:id", upload.single("image"), eventController.updateEvent)

module.exports = router
