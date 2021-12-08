var mongoose = require('mongoose');

const url =
  'mongodb+srv://Stick:Stick123@cluster0.ux4tz.mongodb.net/Stickapp?retryWrites=true&w=majority';

mongoose.connect(
  url,
  {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log('DB connect failed. Error: ', err);
      return;
    }
    console.log('DB connected');
  }
);

module.exports = mongoose;
