const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
app.get("/images/:path/:name", (req, res) => {
  let pathFolder = req.params.path;
  let name = req.params.name;
  const pathImage = path.join(__dirname, `../../Images/${pathFolder}/${name}`);
  const pathImageNotFound = path.join(__dirname, `../../Images/noImage.png`);

  fs.stat(pathImage, function (err, stat) {
    if (err == null) {
      res.sendFile(pathImage);
    } else if (err.code === "ENOENT") {
      // file does not exist
      res.sendFile(pathImageNotFound);
    } else {
      console.log("Some other error: ", err.code);
    }
  });
});

module.exports = app;