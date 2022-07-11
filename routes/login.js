const express = require("express")
const router = express.Router()
const passport = require("passport")
const {
  loginPost,
  loginGet,
  adminCheck,
} = require("../controllers/authController")

router.get("/login", loginGet)

router.post("/login", adminCheck, passport.authenticate("local"), loginPost)

module.exports = router
