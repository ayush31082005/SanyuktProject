const mongoose = require("mongoose")

const gallerySchema = new mongoose.Schema({
    image: String,
    heading: {
        type: String,
        default: ""
    },
    content: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Gallery", gallerySchema)
