require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// Routes

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5001",
    "https://sanyuktparivarrichlifefamily.com",
    "https://www.sanyuktparivarrichlifefamily.com",
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use("/uploads", express.static("uploads"));

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});



// Health Check
app.get("/api/health", (req, res) => {
    res.json({
        status: "alive",
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || "development"
    });
});

// Routes
app.use("/api/mlm", require("./routes/mlmRoutes"));
app.use("/api", require("./routes/authRoutes"));
app.use("/api", require("./routes/contactRoutes"));

app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/admin/users", require("./routes/adminUserRoutes"));
app.use("/api/admin", require("./routes/adminStatsRoutes"));

app.use("/api/franchises", require("./routes/franchiseRoutes"));
app.use("/api/members", require("./routes/memberRoutes"))
app.use("/api/franchise", require("./routes/franchiseDashboardRoutes"))

app.use("/api/mlm", require("./routes/Matchingbonusroutes"));
app.use("/api/package", require("./routes/PackageRoutes"));
app.use("/api/repurchase", require("./routes/repurchaseRoutes"))
app.use('/api/wallet', require('./routes/walletRoutes'));

app.use("/api/grievance", require("./routes/grievanceRoutes"));

app.use("/api/recharge", require("./routes/rechargeRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));



// Error handling for unknown routes
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] 404 - Not Found: ${req.method} ${req.url}`);
    next();
});
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

module.exports = app;
