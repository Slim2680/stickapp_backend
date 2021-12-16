var express = require('express');
var router = express.Router();

const uid2 = require('uid2');
const bcrypt = require('bcrypt');

const userModel = require('../models/users');
const stickerModel = require('../models/stickers');
const couponsModel = require('../models/coupons');

const ObjectId = require('mongoose').Types.ObjectId;

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
			stickers: req.body.stickers,
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

router.post('/users/stickers/add-to-favorite', async (req, res, next) => {
	const user = await userModel.findOne({ token: req.body.token });
	const sticker = await stickerModel.findById(req.body.stickerId);
	// console.log('/////user === ', user);
	// console.log('/////sticker === ', req.body.stickerId);
	// console.log('sticker', sticker);

	user.stickers.push(sticker);

	const userSaved = await user.save();
	console.log('-----userSaved', userSaved);

	res.json({ result: true });
});

router.post('/users/stickers/delete-from-favorite', async (req, res, next) => {
	const deleteSticker = await userModel.updateOne(
		{ token: req.body.token },
		{ $pull: { stickers: { _id: ObjectId(req.body.stickerId) } } }
	);

	res.json({ result: true });
});

router.get('/users/stickers/show-favorites', async (req, res, next) => {
	console.log('------req.query', req.query);
	const user = await userModel.findOne({ token: req.query.token });

	console.log('///////---USER', user);

	res.json({ stickers: user.stickers });
});

router.get('/categories/new', async (req, res, next) => {
	const data = await stickerModel.find({
		Categories: 'New',
	});

	// console.log('---data', data);

	res.json({ data });
});

router.get('/categories/popular', async (req, res, next) => {
	const data = await stickerModel.find({
		Categories: 'Popular',
	});

	// console.log('---data', data);

	res.json({ data });
});

router.get('/categories/funny', async (req, res, next) => {
	const data = await stickerModel.find({
		Categories: 'Funny',
	});

	// console.log('---data', data);

	res.json({ data });
});

router.get('/categories/food', async (req, res, next) => {
	const data = await stickerModel.find({
		Categories: 'Food',
	});

	// console.log('---data', data);

	res.json({ data });
});

router.get('/categories/sports', async (req, res, next) => {
	const data = await stickerModel.find({
		Categories: 'Sports',
	});

	// console.log('---data', data);

	res.json({ data });
});

router.get('/categories/animals', async (req, res, next) => {
	const data = await stickerModel.find({
		Categories: 'Animals',
	});

	// console.log('---data', data);

	res.json({ data });
});

router.get('/categories/landmark', async (req, res, next) => {
	const data = await stickerModel.find({
		Categories: 'Landmark',
	});

	// console.log('---data', data);

	res.json({ data });
});

router.get('/cashback', async (req, res, next) => {
	const data = await couponsModel.find({});

	// console.log("---data", data);

	res.json({ data });
});

module.exports = router;
