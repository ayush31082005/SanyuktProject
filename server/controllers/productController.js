const Product = require("../models/Product");
const { normalizeProductCategory } = require("../utils/productCategory");

const getUploadedImages = (req) => {
    const directImages = Array.isArray(req.files?.images)
        ? req.files.images.map((file) => file.filename)
        : [];
    const legacyImage = Array.isArray(req.files?.image)
        ? req.files.image.map((file) => file.filename)
        : [];

    return (directImages.length ? directImages : legacyImage).slice(0, 2);
};

const parseExistingImages = (value) => {
    if (value === undefined) return undefined;
    if (Array.isArray(value)) return value.filter(Boolean).slice(0, 2);

    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed.filter(Boolean).slice(0, 2) : [];
        } catch (error) {
            return value ? [value].slice(0, 2) : [];
        }
    }

    return [];
};

// CREATE PRODUCT WITH IMAGE
exports.createProduct = async (req, res) => {
    try {
        const uploadedImages = getUploadedImages(req);
        const product = new Product({
            ...req.body,
            category: normalizeProductCategory(req.body.category),
            image: uploadedImages[0] || "",
            images: uploadedImages,
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET PRODUCTS
exports.getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { search, category } = req.query;

        // Build query
        let query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (category && category !== 'All') {
            const normalizedCategory = normalizeProductCategory(category);
            query.category = normalizedCategory === "Fashion/Clothes"
                ? { $in: ["Fashion", "Fashion/Clothes"] }
                : normalizedCategory;
        }

        const [products, total] = await Promise.all([
            Product.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Product.countDocuments(query)
        ]);

        res.json({
            success: true,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            limit,
            count: products.length,
            products
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
    try {
        const updateData = {
            ...req.body,
        };
        delete updateData.existingImages;
        updateData.category = normalizeProductCategory(req.body.category);

        const uploadedImages = getUploadedImages(req);
        const existingImages = parseExistingImages(req.body.existingImages);

        if (existingImages !== undefined || uploadedImages.length) {
            const mergedImages = [
                ...(existingImages || []),
                ...uploadedImages,
            ].filter(Boolean).slice(0, 2);

            updateData.image = mergedImages[0] || "";
            updateData.images = mergedImages;
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product Deleted" });
};
