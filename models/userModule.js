var mongoose = require("mongoose")
var passportLocalMongoose = require("passport-local-mongoose")

var userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String },
  password: { type: String },
  city: { type: String },
  role: {
    type: String,
    default: "user",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
})

userSchema.plugin(passportLocalMongoose)
const userDB = mongoose.connection.useDb("diasDB")
const User = userDB.model("us   er", userSchema)

module.exports = User
