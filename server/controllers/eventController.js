const Event = require("../models/Event")

exports.addEvent = async (req, res) => {

    const newEvent = new Event({

        title: req.body.title,

        content: req.body.content,

        image: req.file.filename

    })

    await newEvent.save()

    res.json({ message: "Event Added" })

}

exports.getEvents = async (req, res) => {

    const data = await Event.find().sort({ createdAt: -1 })

    res.json(data)

}
