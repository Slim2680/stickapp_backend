var express = require('express');
var router = express.Router();

const uid2 = require('uid2');
const bcrypt = require('bcrypt');

const userModel = require('../models/users');
const stickerModel = require('../models/stickers');

router.post('/sign-up', async (req, res, next) => {
  var error = [];
  var result = false;
  var saveUser = null;
  var token = null;

  // console.log('/////error', error);
  // console.log('/////result', result);
  // console.log('/////saveUser', saveUser);
  // console.log('/////token', token);
  // console.log('/////req.body= ', req.body);
  // console.log('/////req.body.email= ', req.body.email);

  const data = await userModel.findOne({
    email: req.body.emailFromFront,
  });

  console.log('/////data', data);

  if (data != null) {
    error.push('utilisateur déjà présent');
  }

  if (
    req.body.usernameFromFront == '' ||
    req.body.emailFromFront == '' ||
    req.body.passwordFromFront == ''
  ) {
    error.push('champs vides');
  }

  if (error.length == 0) {
    const hash = bcrypt.hashSync(req.body.password, 10);

    const userSchema = new userModel({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      token: uid2(32),
    });

    saveUser = await userSchema.save();

    if (saveUser) {
      result = true;
      token = saveUser.token;
    }
  }

  res.json({ result, saveUser, error, token });
});

router.post('/log-in', async (req, res, next) => {
  var result = false;
  // var user = null;
  var error = [];
  var token = null;

  if (req.body.emailFromFront == '' || req.body.passwordFromFront == '') {
    error.push('champs vides');
  }

  console.log('-----ERROR', error);

  // if(error.length == 0){
  //   user = await userModel.findOne({
  //     email: req.body.emailFromFront,
  //   })

  //   if(user){
  //     if(bcrypt.compareSync(req.body.passwordFromFront, user.password)){
  //       result = true
  //       token = user.token
  //     } else {
  //       result = false
  //       error.push('mot de passe incorrect')
  //     }

  // } else {
  //   error.push('email incorrect')
  // }
  // }

  const user = await userModel.findOne({ email: req.body.email });
  console.log('+++++login req.body', req.body);
  console.log('-----user', user);

  console.log('-----req.body.password', req.body.password);

  if (user) {
    console.log('-----user.password', user.password);
    if (bcrypt.compareSync(req.body.password, user.password)) {
      res.json({ login: true, user, token: user.token });
    } else {
      error.push('wrong password');
      res.json({ login: false, error });
    }
  } else {
    error.push('wrong email');
    res.json({ login: false, error });
  }

  // res.json({result, user, error, token})
});

router.get('/funny', (req, res, next) => {
  const data = userModel.findOne({
    Categories: req.body.Categories,
  });

  const stickerSchema = new stickerModel({
    Value: req.body.Value,
    Categories: req.body.Categories,
    url: req.body.url,
    Name: req.body.Name,
  });

  console.log('req.body', req.body);
  console.log('req.body.Value', req.body.Value);
  console.log('req.body.categories', req.body.Categories);

  res.render({ response: true });
});

module.exports = router;
