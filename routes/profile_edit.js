const express = require("express")
const router = express.Router()

const User = require("../models/userModule")

router.get("/profile_edit", (req, res) => {
  User.find({ username: req.cookies.username }, function (err, user) {
    res.render("profile_edit", {
      login: req.cookies.islog,
      userInfo: user,
    })
  })
})

router.post("/profile_edit", (req, res) => {
  User.findOneAndUpdate(
    { username: req.cookies.username },
    { username: req.body.username, city: req.body.city, city: req.body.city },
    { new: true },
    function (err, data) {
      if (err) console.log(err)
    }
  )
  res.redirect("/profile")
})
module.exports = router
