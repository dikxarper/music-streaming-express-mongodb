const MusicDB = require("../models/musicModule")

exports.collectGet = (req, res) => {
  res.render("collection", { login: req.cookies.islog })
}

exports.collectPost = (req, res) => {}
