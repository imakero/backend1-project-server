const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const { authorizeUser } = require("./middleware/auth")
const dotenv = require("dotenv")
const authRouter = require("./controllers/auth")
const entriesRouter = require("./controllers/entries")
const userRouter = require("./controllers/users")
const uploadsRouter = require("./controllers/uploads")
const tagsRouter = require("./controllers/tags")

dotenv.config()

const PORT = 5000
const app = express()

app.use(cors())
app.use(express.json())
app.use(authorizeUser)

app.use("/auth", authRouter)
app.use("/entries", entriesRouter)
app.use("/uploads", uploadsRouter)
app.use("/tags", tagsRouter)
app.get("/favicon.ico", (_req, res) => res.sendStatus(404))
app.use("/", userRouter)

mongoose.connect("mongodb://localhost/backend1project")

app.listen(PORT, () => {
  console.log(`Started server on port: ${PORT}`)
})
