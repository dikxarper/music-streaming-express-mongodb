const express = require("express")
const router = express.Router()

router.get("/files", displayFiles)

module.exports = router
