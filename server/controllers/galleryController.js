const Gallery = require("../models/Gallery");

// @desc    Get all gallery images
// @route   GET /api/gallery/all
// @access  Public
exports.getAllImages = async (req, res) => {
    try {
        const images = await Gallery.find().sort({ createdAt: -1 });
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add new image to gallery
// @route   POST /api/gallery/add
// @access  Admin
exports.addImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload an image" });
        }

        const newImage = new Gallery({
            image: req.file.filename,
            title: req.body.title || "",
            description: req.body.description || ""
        });

        await newImage.save();
        res.status(201).json(newImage);
    } catch (error) {
        res.status(500).json({ message: error.message });
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

        await image.deleteOne();
        res.status(200).json({ message: "Image removed from gallery" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
