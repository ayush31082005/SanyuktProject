const PRODUCT_CATEGORIES = [
    "Mobile",
    "Electronics",
    "Fashion/Clothes",
    "Beauty and cosmetic home based products",
    "Toys and baby toys",
    "Food & health",
    "Auto & accessories",
    "Sports & games",
    "Books & education",
    "Furniture",
    "Footwear",
    "Jwellery & accessories",
    "Appliances",
    "Pharmacy and household",
    "Everyday needs",
    "Grocery",
    "Ayurvedic",
    "Organic",
];

const PRODUCT_CATEGORY_ALIASES = {
    "fashion/clothes": "Fashion/Clothes",
    fashion: "Fashion/Clothes",
    "beauty & cosmetics": "Beauty and cosmetic home based products",
    cosmetics: "Beauty and cosmetic home based products",
    "beauty and cosmetic home based products": "Beauty and cosmetic home based products",
    aryubedik: "Ayurvedic",
    ayurbedik: "Ayurvedic",
    ayurbedik: "Ayurvedic",
    ayurvedik: "Ayurvedic",
    ayurvedic: "Ayurvedic",
    organic: "Organic",
};

const normalizeProductCategory = (value) => {
    if (typeof value !== "string") return value;

    const trimmed = value.trim();
    if (!trimmed) return trimmed;

    return PRODUCT_CATEGORY_ALIASES[trimmed.toLowerCase()] || trimmed;
};

module.exports = {
    PRODUCT_CATEGORIES,
    normalizeProductCategory,
};
