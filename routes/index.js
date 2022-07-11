const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
  res.render("index", {
    login: req.cookies.islog,
  })
})

module.exports = router
