const User = require("../models/userModule")
const upload = require("../uploadFile")
const Music = require("../models/musicModule")
const passport = require("passport")

exports.adminGet = (req, res) => {
  User.find({}, function (err, user) {
    res.render("admin", {
      userInfo: user,
    })
  })
}

exports.adminUpdGet = (req, res) => {
  res.render("admin_update")
}

exports.addUser = (req, res) => {
  var newUser = new User({
    username: req.body.username,
    email: req.body.email,
  })

  User.register(newUser, req.body.password, function (err, a) {
    if (err) {
      console.log(err)
    }
    passport.authenticate("local")(req, res, function () {
      res.redirect("/admin")
    })
  })
}

exports.deleteUser = (req, res) => {
  const username = req.body.username1
  User.deleteOne({ username: username }, function (err) {
    if (err) console.log(err)
  })

  res.redirect("/admin")
}

exports.updateUsername = (req, res) => {
  var userEdit = req.body.username2
  res.cookie("userEdit", userEdit)

  if (
    ({ username: req.body.username },
    function (err) {
      if (err) console.log(err)
    })
  )
    res.render("admin_update")
}

exports.updateUser = (req, res) => {
  User.findOneAndUpdate(
    { username: req.body.username2 },
    { username: req.body.username, city: req.body.city, city: req.body.city },
    { new: true },
    function (err, data) {
      if (err) console.log(err)
    }
  )

  User.find({}, function (err, user) {
    res.render("admin", {
      userInfo: user,
    })
  })
}

exports.sortName = (req, res) => {
  User.find(
    {},
    null,
    { sort: { username: 1 }, collation: { locale: "en" } },
    function (err, user) {
      res.render("admin", {
        userInfo: user,
      })
    }
  )
}

exports.sortCity = (req, res) => {
  User.find(
    {},
    null,
    { sort: { city: 1 }, collation: { locale: "en" } },
    function (err, user) {
      res.render("admin", {
        userInfo: user,
      })
    }
  )
}

exports.uploadPost = (req, res) => {
  upload(req, res, (err) => {
    if (err) console.log(err)
    else {
      const newMusicModel = new Music({
        musicName: req.body.musicName,
        musicAuthor: req.body.musicAuthor,
        musicFile: req.body.musicFile,
      })

      newMusicModel.save()
    }
  })
  res.redirect("/admin")
}
