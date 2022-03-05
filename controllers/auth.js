const jwt = require("jsonwebtoken")
const { Router } = require("express")
const { User } = require("../models/user")

const authRouter = Router()

authRouter.post("/tokens", async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await User.login(username, password)

    if (user) {
      const userId = user._id.toString()
      const token = jwt.sign(
        { userId, username: user.username },
        process.env.JWT_SECRET,
        {
          expiresIn: "24 h",
          subject: userId,
        }
      )
      res.json({ token })
    } else {
      res.sendStatus(401)
    }
  } catch (error) {
    return res.sendStatus(400)
  }
})

authRouter.post("/users", async (req, res) => {
  const { username, password } = req.body
  const user = new User({ username, password })
  await user.save()
  res.json({ username })
})

module.exports = authRouter
