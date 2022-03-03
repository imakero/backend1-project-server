const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, select: false, required: true },
})

userSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 10)
  this.password = hash
  next()
})

userSchema.statics.login = async function (username, password) {
  const user = await this.findOne({ username })
  if (user && (await bcrypt.compare(password, user.password))) {
    return user
  }
  return null
}

const User = mongoose.model("User", userSchema)

module.exports = { User }
