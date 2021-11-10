const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
var multer = require("multer");

const cors = require("cors");

// const logger = require("morgan");

const app = express();
mongoose.set("useFindAndModify", false);

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

const dbConfig = require("./config/secret");

const server = require("http").createServer(app);
const io = require("socket.io").listen(server);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");

  res.header(
    "Access-Control-Allow-Methods",
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "OPTIONS",
    "PATCH"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

// File upload settings
const PATH = "./uploads";

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PATH);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

let upload = multer({
  storage: storage,
});

// POST File
app.post("/api/upload", upload.single("image"), function (req, res) {
  if (!req.file) {
    console.log("No file is available!");
    return res.send({
      success: false,
    });
  } else {
    console.log("file", req.file);
    console.log("File is available!");
    return res.send({
      success: true,
    });
  }
});

// get File
app.get("/image/:name", function (req, res, next) {
  console.log("image name");
  var options = {
    root: __dirname + "/uploads/",
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };

  var fileName = req.params.name;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent:", fileName);
    }
  });
});

app.use(bodyParser.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//app.use(logger("dev"));

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

require("./socket/streams")(io);
const auth = require("./routes/authRoutes");
const training = require("./routes/trainingRoutes");
const trainingSession = require("./routes/trainingSessionRoutes");

app.use("/api", auth);
app.use("/api", training);
app.use("/api", trainingSession);

server.listen(process.env.PORT || 3000, () => {
  console.log("Running on port 3000");
});
