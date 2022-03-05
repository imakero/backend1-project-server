const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
  username: { type: String, lowercase: true, required: true, unique: true },
  password: { type: String, select: false, required: true },
  name: { type: String },
  email: { type: String },
  profileImageUrl: { type: String },
})

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next()
  }
  const hash = await bcrypt.hash(this.password, 10)
  this.password = hash
  next()
})

userSchema.statics.login = async function (username, password) {
  const user = await this.findOne({ username }).select("+password")

  if (user && (await bcrypt.compare(password, user.password))) {
    return user
  }
  return null
}

const User = mongoose.model("User", userSchema)

module.exports = { User }
