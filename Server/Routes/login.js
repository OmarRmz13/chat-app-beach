const express = require("express");
const app = express();
const Users = require("../Models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

app.post("/login", (req, res) => {
  let body = req.body;

  Users.findOne(
    { $or: [{ email: body.email }, { user: body.email }] },
    (err, data) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      if (!data) {
        return res.status(400).json({
          ok: false,
          msg: "Usuario y/o Contraseña Incorrectos",
        });
      }
      if (!bcrypt.compareSync(body.password, data.password)) {
        return res.status(400).json({
          ok: false,
          msg: "Usuario y/o Contraseña Incorrectos",
        });
      }
      let token = jwt.sign(
        {
          user: data._id,
        },
        process.env.SEED,
        { expiresIn: process.env.CADUCIDAD_TOKEN }
      );

      return res.status(200).json({
        ok: true,
        token: token,
      });
    }
  );
});

module.exports = app;
