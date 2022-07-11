const express = require("express")
const router = express.Router()
const { adminUpdGet } = require("../controllers/adminController")

const { addingWish } = require("../controllers/profileController")

router.get("/admin_update", adminUpdGet)

router.get("/addingWish/:id", addingWish)

module.exports = router
