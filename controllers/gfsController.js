const path = require("path")
const mongoose = require("mongoose")
const Grid = require("gridfs-stream")
const crypto = require("crypto")
const multer = require("multer")
const GridFsStorage = require("multer-gridfs-storage").GridFsStorage
const methodOverride = require("method-override")

const musicDB = mongoose.connection.useDb("musicDB")

let gfs, gridFsBucket
//init stream
musicDB.once("open", () => {
  gridFsBucket = new mongoose.mongo.GridFSBucket(musicDB.db, {
    bucketName: "uploads",
  })
  gfs = Grid(musicDB.db, mongoose.mongo)
  gfs.collection("uploads")
})

const storage = new GridFsStorage({
  url: "mongodb+srv://dias:dias@diascluster.pduxp.mongodb.net/musicDB?retryWrites=true&w=majority",
  file: (req, file) => {
    return new Promise((resolve, rejects) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return rejects(err)
        }
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

const upload = multer({ storage })
