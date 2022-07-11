const express = require("express")
const router = express.Router()
const { check } = require("express-validator")
const { registerGet, registerPost } = require("../controllers/authController")

router.get("/registration", registerGet)

router.post(
  "/registration",
  [
    check("password", "Password must be at least 7 characters")
      .exists()
      .matches(/.{7,}/),
    check("password", "Password must have at least one special character")
      .exists()
      .matches(/^(?=.*[!@#$&*])/),
    check("password", "Password must have at least one uppercase letter")
      .exists()
      .matches(/(?=.*[A-Z])/),
    check("password", "Password must have at least one lowercase letter")
      .exists()
      .matches(/(?=.*[a-z])/),
    check("email", "Email is not valid").isEmail().normalizeEmail(),
  ],
  registerPost
)

module.exports = router
