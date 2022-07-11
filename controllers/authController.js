const User = require("../models/userModule")
const Admin = require("../models/adminModule")
const { validationResult } = require("express-validator")
const passport = require("passport")
const mongoose = require("mongoose")

exports.loginGet = (req, res) => {
  res.render("login")
}

exports.loginPost = (req, res) => {
  //google author

  let token = req.body.token
  let username = req.body.username
  if (username == "diasAdmin") res.redirect("/admin")
  else {
    res.cookie("username", username)
    res.cookie("islog", "islog")

    async function verify() {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      })
      const payload = ticket.getPayload()
      const userid = payload["sub"]
      // If request specified a G Suite domain:
      // const domain = payload['hd'];
    }
    verify()
      .then(() => {
        res.cookie("session-token", token) //saving in cookie
        res.send("success")
      })
      .catch(console.error)

    res.redirect("/profile")
  }
}

exports.registerGet = (req, res) => {
  res.render("registration")
}

exports.registerPost = (req, res) => {
  //db
  var newUser = new User({
    username: req.body.username,
    email: req.body.email,
    city: req.body.city,
  })
  res.cookie("islog", "islog")
  const errors = validationResult(req)
  console.log(errors)

  if (!errors.isEmpty()) {
    const alert = errors.array()
    res.render("registration", {
      alert,
    })
  } else {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    const city = req.body.city

    //saving in cookie
    res.cookie("username", username)
    res.cookie("email", email)
    res.cookie("password", password)
    res.cookie("city", city)

    User.register(newUser, req.body.password, function (err, a) {
      if (err) return res.redirect("/registration")

      passport.authenticate("local")(req, res, function () {
        return res.redirect("/profile")
      })
    })
  }
}

exports.adminCheck = (req, res, next) => {
  const username = req.body.username

  if (username == "diasAdmin") res.redirect("/admin")
  else {
    next()
  }
}

exports.logOut = (req, res) => {
  req.logout()

  res.clearCookie("session-token")
  res.clearCookie("username")
  res.clearCookie("email")
  res.clearCookie("city")
  res.clearCookie("islog")

  var db = mongoose.connection.useDb("musicDB")

  db.collection("likedmusicinfos").drop()

  req.session.destroy(function (err) {
    res.redirect("/")
  })
}
