const Gallery = require("../models/Gallery")

exports.addImage = async (req, res) => {

    const newImage = new Gallery({

        image: req.file.filename

    })

    await newImage.save()

    res.json({ message: "Image Added" })

}

exports.getGallery = async (req, res) => {

    const data = await Gallery.find().sort({ createdAt: -1 })

    res.json(data)

}
