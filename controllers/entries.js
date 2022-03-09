const { Router } = require("express")
const mongoose = require("mongoose")
const { requireLogin } = require("../middleware/auth")
const { Entry } = require("../models/entry")
const { User } = require("../models/user")

const entriesRouter = Router()

entriesRouter.post("/", requireLogin, async (req, res) => {
  const { text } = req.body
  const { userId } = req.user
  const entry = new Entry({ text, author: userId })
  entry.save()
  res.json(entry)
})

entriesRouter.get("/", async (req, res) => {
  const entries = await Entry.find().populate("author").sort({ createdAt: -1 })
  res.json(entries)
})

entriesRouter.get("/:username", async (req, res) => {
  const { username } = req.params
  const user = await User.findOne({ username })
  const entries = await Entry.find({ author: { $in: user.following } })
    .populate("author")
    .sort({ createdAt: -1 })
  res.json(entries)
})

module.exports = entriesRouter
