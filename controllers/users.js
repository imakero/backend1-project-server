const { Router } = require("express")
const { requireLogin, isAuthorized } = require("../middleware/auth")
const { Entry } = require("../models/entry")
const { User } = require("../models/user")
const multer = require("multer")

const upload = multer({
  storage: multer.diskStorage({
    destination: "./uploads",
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
  const entries = await Entry.find({ author: user._id }).sort({ createdAt: -1 })
  res.json({ user, entries })
})

userRouter.post(
  "/:username",
  isAuthorized,
  upload.single("profileImage"),
  async (req, res) => {
    const { username } = req.params
    const userToUpdate = await User.findOne({ username })
    userToUpdate.profileImageUrl = `/uploads/${req.file.filename}`
    userToUpdate.name = req.body.name
    userToUpdate.email = req.body.email
    userToUpdate.save()
    res.json(userToUpdate)
  }
)

module.exports = userRouter
