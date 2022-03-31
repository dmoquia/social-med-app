const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { mongoURI } = require("./config/keys");

require("./models/User");
require("./models/Post");

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));
mongoose.connect(mongoURI);
mongoose.connection.on("connected", () => {
  console.log("connected to mongo yeah");
});
mongoose.connection.on("error", (err) => {
  console.log("cannot connect to the db", err);
});
const PORT = process.env.PORT || 3004;

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
app.listen(PORT, () => {
  console.log(`port is running on ${PORT}`);
});
