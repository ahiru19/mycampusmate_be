const express = require("express");
require("dotenv").config();
const cookieParser = require('cookie-parser');
const {AuthToken} = require("./middleware/midware");
const app = express();
const cors = require('cors');
const path = require("path");

app.use(express.json()); // This is for the body to be recognized
app.use(cookieParser());
app.use(cors())
const { appRoutes } = require("./main_routes"); //This is the file for the whole part of your Routes
const fileupload = require("express-fileupload");//This is for the files to be recognized

app.use(fileupload({ //this is to use the file and give size of the file
    createParentPath: true,
    abortOnLimit: true,
    limitHandler: (req, res, next) => {
        res.status(413).send({ status: "Limit Reached", message: "Upload file limit reached, check your file size" });
    },
    limits: { fileSize: 10 * 1024 * 1024 },
}));

app.use("/public/profile", express.static(path.join(__dirname, '/public/profile/')));
app.use("/public/posts", express.static(path.join(__dirname, '/public/posts/')));

//register all routes
appRoutes.forEach((item) => {
      app[item.method](item.path, AuthToken, item.action);
  });


// listening
app.listen(process.env.APP_PORT, function () {
    console.log("LISTENING ON \x1b[4m%s\x1b[0m", `http://localhost:${process.env.APP_PORT}`);
});