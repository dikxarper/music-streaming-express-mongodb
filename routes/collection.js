const express = require("express")
const router = express.Router()
const { collectGet, collectPost } = require("../controllers/collectController")

router.get("/collection", collectGet)

router.post("/collection", collectPost)

module.exports = router
