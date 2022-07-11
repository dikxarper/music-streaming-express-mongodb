const mongoose = require("mongoose")

const path = require("path")
const crypto = require("crypto")
const multer = require("multer")
const GridFsStorage = require("multer-gridfs-storage").GridFsStorage
const Grid = require("gridfs-stream")

const conn = mongoose.connection.useDb("musicDB")
//init gfs
let gfs

conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo)
  gfs.collection("uploads")
})

//create storage eng
const storage = new GridFsStorage({
  url: "mongodb+srv://dias:dias@diascluster.pduxp.mongodb.net/musicDB?retryWrites=true&w=majority",
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err)
        const filename = buf.toString("hex") + path.extname(file.originalname)
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        }
        resolve(fileInfo)
      })
    })
  },
})

const upload = multer({ storage: storage }).any("musicFile", "pictFile")

module.exports = upload
