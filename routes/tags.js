const mongoose = require("mongoose")
const { Router } = require("express")
const { Tag } = require("../models/tag")
const { Entry } = require("../models/entry")
const { catchErrors } = require("../catchErrors")

const tagsRouter = Router()

tagsRouter.get(
  "/:tag",
  catchErrors(async (req, res) => {
    const tag = await Tag.findOne({ text: req.params.tag })
    if (!tag) {
      return res.json([])
    }
    const entries = await Entry.find({ tags: tag._id })
      .populate("author")
      .sort({ createdAt: -1 })
    res.json(entries)
  })
)

module.exports = tagsRouter
