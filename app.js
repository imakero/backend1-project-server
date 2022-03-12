const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const { authorizeUser } = require("./middleware/auth")
const dotenv = require("dotenv")
const authRouter = require("./controllers/auth")
const entriesRouter = require("./controllers/entries")
const userRouter = require("./controllers/users")
const tagsRouter = require("./controllers/tags")
const { Server } = require("socket.io")
const http = require("http")
const { init } = require("./realtime/init")

dotenv.config()

const PORT = 5000
const app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer, { cors: { origin: "http://localhost:3000" } })

const realtime = init(io)

app.set("realtime", realtime)
app.use(cors())
app.use(express.json())
app.use(express.static("./public"))
app.use(authorizeUser)

app.use("/auth", authRouter)
app.use("/entries", entriesRouter)
app.use("/tags", tagsRouter)
app.get("/favicon.ico", (_req, res) => res.sendStatus(404))
app.use("/", userRouter)

mongoose.connect("mongodb://localhost/backend1project")

httpServer.listen(PORT, () => {
  console.log(`Started server on port: ${PORT}`)
})
