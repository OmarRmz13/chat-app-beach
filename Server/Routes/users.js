const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const _ = require("underscore");
const User = require("../Models/user");
const Convertation = require("./../Models/convertation");
const { verification } = require("../Middlewares/autetication");
const fs = require("fs");
const path = require("path");
app.post("/signup", (req, res) => {
  let body = req.body;
  let user = new User({
    user: body.user,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
  });

  user.save((err, data) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    return res.status(200).json({
      ok: true,
      msg: "Congratulations, you have created your account",
    });
  });
});

app.get("/getconvertations/", verification, (req, res) => {
  let id = req.user;
  console.log(id);
  User.findById(id, { convertations: 1, _id: 0 }, (err, data) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    Convertation.aggregate([
      {
        $match: {
          _id: { $in: data.convertations },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user1",
          foreignField: "_id",
          as: "user1",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user2",
          foreignField: "_id",
          as: "user2",
        },
      },
      {
        $project: {
          messages: {
            $slice: ["$messages", -1],
          },
          "user1._id": 1,
          "user2._id": 1,
          "user1.user": 1,
          "user2.user": 1,
          "user2.photo": 1,
          "user1.photo": 1,
        },
      },
    ]).exec((err, data) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      data.sort(function (a, b) {
        return new Date(b.messages[0].date) - new Date(a.messages[0].date);
      });
      return res.status(200).json({
        ok: true,
        data: data,
      });
    });
  });
});

app.get("/finduser/:id", (req, res) => {
  let id = req.params.id;
  User.find(
    {
      $or: [
        { user: { $regex: id, $options: "i" } },
        { email: { $regex: id, $options: "i" } },
      ],
    },
    { user: 1, email: 1 },
    { limit: 50 },
    (err, data) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      return res.status(200).json({
        ok: true,
        data,
      });
    }
  );
});

app.get("/findOneUser/:id", (req, res) => {
  let id = req.params.id;
  User.findById(id, (err, data) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    return res.status(200).json({
      ok: true,
      data,
    });
  });
});
app.put("/updateimage/:id", (req, res) => {
  let id = req.params.id;
  let body = req.body;
  let image = base64ToImage(body.image, "profilepic-" + id);
  User.findByIdAndUpdate(id, { 'photo':image }, (err, data) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err: { msg: "Error al subir la imagen al serivor", err },
      });
    }
    return res.status(200).json({
      ok:true,
      msg:'Se actualizo la imagen :)',
      data:data
    })
  });
});

const base64ToImage = (base64, nombre) => {
  const base64Data = base64.split(";base64,").pop();
  require("fs").writeFile(
    `./Images/Users/${nombre}.png`,
    base64Data,
    "base64",
    (err, data) => {
      if (err) {
        return err;
      }
    }
  );
  return `${nombre}.png`;
};
module.exports = app;
