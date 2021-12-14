const mongoose = require('mongoose');

const stickerSchema = mongoose.Schema({
	Value: String,
	Categories: String,
	url: String,
	Name: String,
});

const stickerModel = mongoose.model('stickers', stickerSchema);

module.exports = stickerModel;
