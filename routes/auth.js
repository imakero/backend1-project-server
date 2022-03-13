const jwt = require("jsonwebtoken")
const { Router } = require("express")
const { User } = require("../models/user")
const { catchErrors } = require("../catchErrors")

const authRouter = Router()

authRouter.post(
  "/tokens",
  catchErrors(async (req, res) => {
    const { username, password } = req.body
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
  })
)

authRouter.post(
  "/users",
  catchErrors(async (req, res) => {
    const { username, password } = req.body
    const user = new User({ username, password })
    await user.save()
    res.statusCode = 201
    res.json({ username })
  })
)

module.exports = authRouter
