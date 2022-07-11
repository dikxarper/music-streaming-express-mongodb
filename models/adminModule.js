const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String },
  password: { type: String },
  city: { type: String },
  isAdmin: {
    type: Boolean,
    default: true,
  },
})

const userDB = mongoose.connection.useDb("userDB")
const Admin = userDB.model("admin", adminSchema)

module.exports = Admin
  