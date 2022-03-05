const { Router } = require("express")
const { requireLogin } = require("../middleware/auth")
const { Entry } = require("../models/entry")
const { User } = require("../models/user")

const userRouter = Router()

userRouter.get("/:username", async (req, res) => {
  const { username } = req.params
  const user = await User.findOne({ username })
  const entries = await Entry.find({ author: user._id }).sort({ createdAt: -1 })
  res.json({ user, entries })
})

userRouter.put("/:username", requireLogin, async (req, res) => {
  const user = req.user
  const { username } = req.params
  if (user.username !== username) {
    return res.sendStatus(401)
  }

  const userToUpdate = await User.findOne({ username })
  const { email, name, profileImageUrl } = req.body
  userToUpdate.email = email
  userToUpdate.name = name
  userToUpdate.profileImageUrl = profileImageUrl
  userToUpdate.save()
  res.json(userToUpdate)
})

module.exports = userRouter
