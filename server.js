const express = require("express")
const cookie = require("cookie-parser")
const bodyParser = require("body-parser")
const session = require("express-session")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const path = require("path")
const mongoose = require("mongoose")
const Grid = require("gridfs-stream")
const crypto = require("crypto")
const multer = require("multer")
const GridFsStorage = require("multer-gridfs-storage").GridFsStorage
const methodOverride = require("method-override")

const User = require("./models/userModule")
const Music = require("./models/musicModule")
const app = express()

//port
const PORT = process.env.PORT || 8000

//connect to mongodb
const mongoURI =
  "mongodb+srv://dias:dias@diascluster.pduxp.mongodb.net/?retryWrites=true&w=majority"
mongoose
  .connect(mongoURI)
  .then((result) => console.log("MongoDB database connected"))
  .catch((err) => console.log(err))

//init gfs
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

//create storage object
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

//@route GET /files
//@desc Display all files in JSON
app.get("/files", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        error: "No files exist",
      })
    }

    return res.json(files)
  })
})

//@route GET /image/:filename
//@desc Display image
app.get("/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      })
    }

    //check img
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      //read ouput
      const readstream = gridFsBucket.openDownloadStream(file._id)
      readstream.pipe(res)
    } else {
      res.status(404).json({
        err: "Not an image",
      })
    }
  })
})

app.get("/audio/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      })
    }

    //check img
    if (file.contentType === "audio/mpeg") {
      //read ouput
      const readstream = gridFsBucket.openDownloadStream(file._id)
      readstream.pipe(res)
    } else {
      res.status(404).json({
        err: "Not an image",
      })
    }
  })
})

//Googleauthorization

const { OAuth2Client } = require("google-auth-library")
const CLIENT_ID =
  "15007661587-6de9351j41ea21u0eudt0vor4rhm74fc.apps.googleusercontent.com"
const client = new OAuth2Client(CLIENT_ID)

//Middleware
app.set("view engine", "/views")
app.set("view engine", "ejs")

app.use(cookie())
app.use(
  express.urlencoded({
    extended: false,
  })
)
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
)
app.use(methodOverride("_method"))

app.use(express.static("public"))
app.use(express.json())
app.use("/css", express.static(__dirname + "public/css"))
app.use("/img", express.static(__dirname + "public/img"))
app.use("/js", express.static(__dirname + "public/js"))

app.post("/uploadInfo", (req, res) => {
  const name = req.body.musicName
  const author = req.body.musicAuthor

  const newMusic = new Music({
    musicName: name,
    musicAuthor: author,
  })

  res.cookie("musicName", name)

  newMusic.save()
  res.redirect("/admin")
})

app.post("/uploadPict", upload.single("pictFile"), (req, res) => {
  Music.findOneAndUpdate(
    { musicName: req.cookies.musicName },
    {
      pictFile: req.file.filename,
    },
    (err, music) => {
      if (err) console.log(err)

      res.redirect("/admin")
    }
  )
})

app.post("/uploadMusic", upload.single("musicFile"), (req, res) => {
  Music.findOneAndUpdate(
    { musicName: req.cookies.musicName },
    {
      musicFile: req.file.filename,
    },
    (err, music) => {
      if (err) console.log(err)

      res.redirect("/admin")
    }
  )
})

app.get("/collection", (req, res) => {
  Music.find({}, (err, music) => {
    if (err) console.log(err)
    res.render("collection", { musicInfo: music, login: req.cookies.islog  })
  })
})

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//import the routes
const indexRout = require("./routes/index")
const loginRout = require("./routes/login")
const registRout = require("./routes/registration")
const adminRout = require("./routes/admin")
const adminUpdRout = require("./routes/admin_update")
const profileRout = require("./routes/profile")
const collectRout = require("./routes/collection")
const profileEditRout = require("./routes/profile_edit")
const { resolve } = require("path")
const { rejects } = require("assert")

//app.use routes
app.use(
  indexRout,
  loginRout,
  registRout,
  adminRout,
  adminUpdRout,
  collectRout,
  profileRout,
  profileEditRout
)

app.get("/profileG", checkAuthenticated, (req, res) => {
  let user = req.user
  res.render("profileG", {
    user,
  })
})

//checking authenticated function (google)
function checkAuthenticated(req, res, next) {
  let token = req.cookies["session-token"]

  let user = {} //variable for saving all data
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token, //passing the token from cookie
      audience: CLIENT_ID, //Specify Client_id to the app
    })

    const payload = ticket.getPayload() //getting access to the name and email, storing them in 'user'
    user.name = payload.name
    user.email = payload.email
    user.picture = payload.picture
  }
  verify() //verifying to be sure
    .then(() => {
      req.user = user
      next() //next if it is verified
    })
    .catch((err) => {
      res.redirect("/login") //otherwise it redirects to '/login'
    })
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
