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
  await entry.save()
  const savedEntry = await entry.populate("author")

  const user = await User.findOne({ _id: userId })
  const realtime = req.app.get("realtime")
  const followerIds = user.followers.map((follower) => follower.toString())

  const socketsToNotify = realtime.getSockets(followerIds)

  socketsToNotify.forEach((socketId) => {
    realtime.io.to(socketId).emit("newPost", savedEntry)
  })
  // console.log(socketsToNotify)
  res.json(entry)
})

entriesRouter.get("/", async (req, res) => {
  const entries = await Entry.find()
    .populate("author")
    .populate("tags")
    .sort({ createdAt: -1 })
  res.json(entries)
})

entriesRouter.get("/:username", async (req, res) => {
  const { username } = req.params
  const user = await User.findOne({ username })
  const entries = await Entry.find({
    $or: [{ author: { $in: user.following } }, { author: req.user.userId }],
  })
    .populate("author")
    .sort({ createdAt: -1 })
  res.json(entries)
})

module.exports = entriesRouter
