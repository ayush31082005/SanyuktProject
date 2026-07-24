const Gallery = require("../models/Gallery");
const fs = require("fs");
const path = require("path");

// @desc    Get all gallery images
// @route   GET /api/gallery/all
// @access  Public
exports.getAllImages = async (req, res) => {
    try {
        const images = await Gallery.find().sort({ createdAt: -1 });
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

// Aliased for remote branch compatibility
exports.getGallery = exports.getAllImages;

// @desc    Add new image to gallery
// @route   POST /api/gallery/add
// @access  Admin
exports.addImage = async (req, res) => {
    try {
        if (!req.file) {
            console.warn("[GALLERY] Attempted to add image without file");
            return res.status(400).json({
                success: false,
                message: "Please upload an image file (PNG, JPG, or GIF)"
            });
        }

        const newImage = new Gallery({
            image: req.file.filename,
            heading: req.body.heading || "",
            content: req.body.content || ""
        });

        await newImage.save();
        res.status(201).json({ success: true, message: "Image Added Successfully", image: newImage });
    } catch (error) {
        console.error("[GALLERY] Error adding image:", error);
        res.status(500).json({ success: false, message: "Server error while saving gallery item: " + error.message });
    }
};

// @desc    Delete image from gallery
// @route   DELETE /api/gallery/:id
// @access  Admin
exports.deleteImage = async (req, res) => {
    try {
        const image = await Gallery.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }

        const filePath = path.join(__dirname, "../uploads/gallery", image.image);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await Gallery.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Image removed from gallery" });
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

// @desc    Update image in gallery
// @route   PUT /api/gallery/:id
// @access  Admin
exports.updateImage = async (req, res) => {
    try {
        const item = await Gallery.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Image not found" });

        if (req.file) {
            const oldPath = path.join(__dirname, "../uploads/gallery", item.image);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            item.image = req.file.filename;
        }

        if (req.body.heading !== undefined) item.heading = req.body.heading;
        if (req.body.content !== undefined) item.content = req.body.content;

        await item.save();
        res.json({ success: true, message: "Image updated successfully", image: item });
    } catch (error) {
        console.error("[GALLERY] Error updating image:", error);
        res.status(500).json({ message: "Server error while updating gallery item: " + error.message });
    }
};
