require("./Config/config");
const express = require("express");
const mongoose = require("mongoose");
const socket = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
var clients = [];
const server = app.listen(process.env.PORT, () =>
  console.log(`listening on ${process.env.PORT}`)
);
const io = socket(server, {
  cors: {
    origin: "*",
  },
});

app.use(
  bodyParser.urlencoded({
    limit: "100mb",
    extended: false,
    parameterLimit: 50000,
  })
);
app.use(bodyParser.json({ limit: "100mb" }));

app.use(cors());
app.use(require("./Routes/index"));

mongoose.connect(
  process.env.URLDB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Base de datos conectada");
    }
  }
);

io.on("connection", (socket) => {
  socket.on("storeClientInfo", function (data) {
    var clientInfo = new Object();
    clientInfo.userId = data.customId;
    clientInfo.socket = socket;
    clientInfo.socketId = socket.id;
    clients.push(clientInfo);
  });
  socket.on("disconnect", function (data) {
    let userDisconect = clients.findIndex((x) => x.socketId === socket.id);
    clients.splice(userDisconect, 1);
  });
});
module.exports = { clients, io };
