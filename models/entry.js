const mongoose = require("mongoose")

const entrySchema = mongoose.Schema(
  {
    text: { type: String, required: true, maxLength: 140 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
)

const Entry = mongoose.model("Entry", entrySchema)

module.exports = { Entry }
