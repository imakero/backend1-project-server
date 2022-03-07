const { Router } = require("express")
const path = require("path")

const uploadsRouter = Router()

uploadsRouter.get("/:filename", (req, res) => {
  res.sendFile(path.join(process.cwd(), "uploads", req.params.filename))
})

module.exports = uploadsRouter
