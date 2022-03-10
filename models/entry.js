const mongoose = require("mongoose")
const HASHTAGS = require("../constants")
const { Tag } = require("./tag")

const entrySchema = mongoose.Schema(
  {
    text: { type: String, required: true, maxLength: 140 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  },
  { timestamps: true }
)

entrySchema.pre("save", async function (next) {
  const tags = [...this.text.matchAll(HASHTAGS)].map((match) => match[1])
  const uniqueTags = [...new Set(tags.map((tag) => tag.toLowerCase()))]

  this.tags = await Promise.all(
    uniqueTags.map(async (tag) => {
      const savedTag = await Tag.findOneAndUpdate(
        { text: tag },
        { $set: { text: tag } },
        { upsert: true, returnDocument: "after" }
      )
      return savedTag._id
    })
  )

  next()
})

const Entry = mongoose.model("Entry", entrySchema)

module.exports = { Entry }
