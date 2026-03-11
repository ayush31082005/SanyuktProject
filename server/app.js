require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// const franchiseDashboardRoutes = require("./routes/franchiseDashboardRoutes");
// const memberRoutes = require("./routes/memberRoutes");
// const galleryRoutes = require("./routes/galleryRoutes")
// const eventRoutes = require("./routes/eventRoutes")

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use("/uploads", express.static("uploads"));


// Routes
app.use("/api", require("./routes/authRoutes"));
app.use("/api", require("./routes/contactRoutes"));

app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/admin/users", require("./routes/adminUserRoutes"));
app.use("/api/admin", require("./routes/adminStatsRoutes"));

app.use("/api/franchises", require("./routes/franchiseRoutes"));
// app.use("/api/franchise", franchiseDashboardRoutes);
// app.use("/api/members", memberRoutes);

app.use("/api/grievance", require("./routes/grievanceRoutes"));

app.use("/api/recharge", require("./routes/rechargeRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/mlm", require("./routes/mlmRoutes"));

// app.use("/api/gallery", galleryRoutes)
// app.use("/api/events", eventRoutes)


// Error handling for unknown routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

module.exports = app;
