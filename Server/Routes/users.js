const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const _ = require("underscore");
const User = require("../Models/user");
const Convertation = require("./../Models/convertation");
const { verification } = require("../Middlewares/autetication");
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
          "user2._photo": 1,
          "user1.photo": 1,
        },
      },
      { $sort : { "messages[0].date" : 1 } }
    ]).exec((err, data) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      return res.status(200).json({
        ok: true,
        data: data,
      });
    });
  });
});

app.get("/finduser/:id", (req, res) => {
  let id = req.params.id
User.find({$or:[{'user':{ $regex: id, $options: 'i'}},{'email':{ $regex: id, $options: 'i'}}]},{'user':1,'email':1},{limit: 50},(err,data)=>{
  if (err) {
    return res.status(400).json({
      ok:false,
      err
    })
 
  }
  return res.status(200).json({
    ok:true,
    data
  })
})

});

module.exports = app;
