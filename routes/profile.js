const express = require("express")
const router = express.Router()
const { profileGet } = require("../controllers/profileController")
const { logOut } = require("../controllers/authController")
const likedMusic = require("../models/likedMusicModule")

router.get("/profile", (req, res) => {
  likedMusic.find({}, function (err, music) {
    if (err) console.log(err)

    res.render("profile", {
      musicInfo: music,
      login: req.cookies.islog,
    })
  })
})

router.get("/logout", logOut)

module.exports = router
