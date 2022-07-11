var mongoose = require("mongoose")

var musicSchema = new mongoose.Schema({
  musicName: { type: String },
  musicAuthor: { type: String },
  musicFile: { type: String },
  pictFile: { type: String },
})

const musicDB = mongoose.connection.useDb("musicDB")
const Music = musicDB.model("musicInfo", musicSchema)

module.exports = Music
