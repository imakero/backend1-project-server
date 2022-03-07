const jwt = require("jsonwebtoken")

const authorizeUser = (req, res, next) => {
  const authHeader = req.header("Authorization")
  if (authHeader) {
    const token = authHeader.split(" ")[1]
    req.user = jwt.verify(token, process.env.JWT_SECRET)
  }
  next()
}

const requireLogin = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.sendStatus(401)
  }
}

const isAuthorized = (req, res, next) => {
  const user = req.user
  const { username } = req.params
  if (user.username !== username) {
    return res.sendStatus(401)
  }
  next()
}

module.exports = {
  authorizeUser,
  requireLogin,
  isAuthorized,
}
