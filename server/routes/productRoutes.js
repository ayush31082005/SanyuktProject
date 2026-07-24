const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");

router.post(
    "/",
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "images", maxCount: 2 },
    ]),
    createProduct
);
router.get("/", getProducts);
router.put(
    "/:id",
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "images", maxCount: 2 },
    ]),
    updateProduct
);
router.delete("/:id", deleteProduct);

module.exports = router;
