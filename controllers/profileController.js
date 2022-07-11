const User = require("../models/userModule")
const Music = require("../models/musicModule")
const likedMusic = require("../models/likedMusicModule")

exports.profileGet = (req, res) => {
  User.find({ username: req.cookies.username }, function (err, user) {
    res.render("profile", {
      login: req.cookies.islog,
    })
  })
}

exports.addingWish = (req, res) => {
  Music.findOne({ _id: req.params.id }, (err, music) => {
    if (err) console.log(err)
    else {
      var LikedMusic = new likedMusic({
        musicName: music.musicName,
        musicAuthor: music.musicAuthor,
        musicFile: music.musicFile,
        pictFile: music.pictFile,
      })

      LikedMusic.save()

      res.redirect("/collection")
    }
  })
}
