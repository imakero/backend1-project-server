const express = require("express")
const mongoose = require("mongoose")
const { authorizeUser } = require("./middleware/auth")
const dotenv = require("dotenv")
const authRouter = require("./controllers/auth")
const entriesRouter = require("./controllers/entries")

dotenv.config()

const PORT = 5000
const app = express()

app.use(express.json())
app.use(authorizeUser)

app.use("/auth", authRouter)
app.use("/entries", entriesRouter)

mongoose.connect("mongodb://localhost/backend1project")

app.listen(PORT, () => {
  console.log(`Started server on port: ${PORT}`)
})
