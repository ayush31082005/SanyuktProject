const Gallery = require("../models/Gallery")
const fs = require("fs")
const path = require("path")

exports.addImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "Image is required" })
        const newImage = new Gallery({ image: req.file.filename })
        await newImage.save()
        res.json({ success: true, message: "Image Added", image: newImage })
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error: " + error.message })
    }
}

exports.getGallery = async (req, res) => {
    try {
        const data = await Gallery.find().sort({ createdAt: -1 })
        res.json(data)
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

exports.deleteImage = async (req, res) => {
    try {
        const item = await Gallery.findById(req.params.id)
        if (!item) return res.status(404).json({ message: "Image not found" })
        const filePath = path.join(__dirname, "../uploads/gallery", item.image)
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
        await Gallery.findByIdAndDelete(req.params.id)
        res.json({ success: true, message: "Image deleted" })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

exports.updateImage = async (req, res) => {
    try {
        const item = await Gallery.findById(req.params.id)
        if (!item) return res.status(404).json({ message: "Image not found" })
        if (req.file) {
            const oldPath = path.join(__dirname, "../uploads/gallery", item.image)
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
            item.image = req.file.filename
        }
        await item.save()
        res.json({ success: true, message: "Image updated", image: item })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}
