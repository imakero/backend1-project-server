const mongoose = require("mongoose")

const tagSchema = mongoose.Schema({
  text: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    maxLength: 140,
  },
})

const Tag = mongoose.model("Tag", tagSchema)

module.exports = { Tag }
