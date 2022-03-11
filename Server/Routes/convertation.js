const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const _ = require("underscore");
const User = require("../Models/user");
const Convertation = require("./../Models/convertation");
const { verification } = require("../Middlewares/autetication");
const { io, clients } = require("./../server");
app.post("/createconvertation", (req, res) => {
  let body = req.body;
  let convertation = new Convertation({
    user1: body.user1,
    user2: body.user2,
    messages: body.message,
  });

  convertation.save((err, data) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    User.findByIdAndUpdate(
      body.user1,
      { $push: { convertations: data._id } },
      { new: true, runValidators: true, context: "query" },
      (err, data) => {
        if (err) {
          console.log(err);
        }
        console.log(data);
      }
    );
    User.findByIdAndUpdate(
      body.user2,
      { $push: { convertations: data._id } },
      { new: true, runValidators: true, context: "query" },
      (err, data) => {
        if (err) {
          console.log(err);
        }
        console.log(data);
      }
    );
    // let user1 = clients.findIndex((x) => x.userId == data.user1);
    // let user2 = clients.findIndex((x) => x.userId == data.user2);
    // io.sockets.to(clients[user1].socket.id).emit("message", body.message);
    // io.sockets.to(clients[user2].socket.id).emit("message", body.message);
    return res.status(200).json({
      ok: true,
      data,
    });
  });
});

app.put("/sendmessage", (req, res) => {
  let body = req.body;
  Convertation.findByIdAndUpdate(
    body.idConvertation,
    { $push: { messages: body.message } },
    { new: true, runValidators: true, context: "query" },
    (err, data) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      // let user1 = clients.findIndex((x) => x.userId == data.user1);
      // let user2 = clients.findIndex((x) => x.userId == data.user2);
      // io.sockets.to(clients[user1].socket.id).emit("message", body.message);
      // io.sockets.to(clients[user2].socket.id).emit("message", body.message);
      return res.status(200).json({
        ok: true,
        msg: "Message was send successfuly",
      });
    }
  );
});

app.get("/getmessages/:idConvertation", (req, res) => {
  let idConvertation = req.params.idConvertation;

  Convertation.findById(idConvertation)
    .populate("user1", "email user _id photo")
    .populate("user2", "email user _id photo")
    .exec((err, data) => {
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

module.exports = app;
