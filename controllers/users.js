const { Router } = require("express")
const { requireLogin, isAuthorized } = require("../middleware/auth")
const { Entry } = require("../models/entry")
const { User } = require("../models/user")
const multer = require("multer")
const mongoose = require("mongoose")

const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => {
      cb(
        null,
        `${req.params.username}-profile-picture.${
          file.originalname.split(".").slice(-1)[0]
        }`
      )
    },
  }),
})

const userRouter = Router()

userRouter.get("/:username", async (req, res) => {
  const { username } = req.params
  const user = await User.findOne({ username })
  const entries = await Entry.find({ author: user._id })
    .populate("author")
    .sort({ createdAt: -1 })
  res.json({ user, entries })
})

userRouter.post("/:username", isAuthorized, async (req, res) => {
  const { username } = req.params
  const userToUpdate = await User.findOne({ username })
  const { name, email } = req.body
  userToUpdate.name = name ? name : userToUpdate.name
  userToUpdate.email = email ? email : userToUpdate.email
  userToUpdate.save()
  res.json(userToUpdate)
})

userRouter.post(
  "/:username/profile-image",
  isAuthorized,
  upload.single("profileImage"),
  async (req, res) => {
    const { username } = req.params
    const userToUpdate = await User.findOne({ username })
    userToUpdate.profileImageUrl = `/uploads/${req.file.filename}`
    userToUpdate.save()
    res.json(userToUpdate)
  }
)

userRouter.post("/:username/follow", requireLogin, async (req, res) => {
  const { username } = req.params
  const userToFollow = await User.findOne({ username })

  if (userToFollow._id === req.user.userId) {
    res.statusCode = 400
    return res.json({ error: "A user cannot follow itself." })
  }

  await User.updateOne(
    { username },
    { $addToSet: { followers: mongoose.Types.ObjectId(req.user.userId) } }
  )
  await User.updateOne(
    { _id: req.user.userId },
    {
      $addToSet: { following: userToFollow._id },
    }
  )
  res.sendStatus(200)
})

userRouter.post("/:username/unfollow", requireLogin, async (req, res) => {
  const { username } = req.params
  const userToUnfollow = await User.findOne({ username })

  if (userToUnfollow._id === req.user.userId) {
    res.statusCode = 400
    return res.json({ error: "A user cannot unfollow itself." })
  }

  await User.updateOne(
    { username },
    { $pull: { followers: mongoose.Types.ObjectId(req.user.userId) } }
  )
  await User.updateOne(
    { _id: req.user.userId },
    {
      $pull: { following: userToUnfollow._id },
    }
  )
  res.sendStatus(200)
})

module.exports = userRouter
