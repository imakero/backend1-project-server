const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema(
  {
    username: { type: String, lowercase: true, required: true, unique: true },
    password: { type: String, select: false, required: true },
    name: { type: String },
    email: { type: String },
    profileImageUrl: { type: String },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

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

userSchema.virtual("followersCount").get(function () {
  return this.followers.length
})

userSchema.virtual("followingCount").get(function () {
  return this.following.length
})

const User = mongoose.model("User", userSchema)

module.exports = { User }
