var mongoose = require("mongoose");

var options = {
  connectTimeoutMS: 5000,
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

mongoose.connect(
  "mongodb+srv://Stick:Stick123@cluster0.ux4tz.mongodb.net/Stickapp?retryWrites=true&w=majority",
  options,
  function (err) {
    console.log(err);
  }
);

module.exports = mongoose;
