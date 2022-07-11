const express = require("express")

const router = express.Router()
const {
  adminGet,
  addUser,
  deleteUser,
  updateUser,
  updateUsername,
  sortCity,
  sortName,
  uploadPost,
} = require("../controllers/adminController")

router.get("/admin", adminGet)

router.post("/addUser", addUser)

router.post("/deleteUser", deleteUser)

router.post("/updateUsername", updateUsername)

router.post("/updateUser", updateUser)

router.post("/sortCity", sortCity)

router.post("/sortName", sortName)

router.post("/upload", uploadPost)

module.exports = router
