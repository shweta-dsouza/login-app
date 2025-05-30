var mongoose = require ('mongoose');
var bcrypt = require ('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema ({
	username: {
		type: String,
		index: true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	}
});

// Export schema var outside this file
var User = module.exports = mongoose.model ('User', UserSchema);

// Create a new user
module.exports.createUser = function (newUser, callback) {
	bcrypt.genSalt (10, function (err, salt) {
		bcrypt.hash (newUser.password, salt, function (err, hash) {
			newUser.password = hash;
			newUser.save (callback);
		});
	});
}

// Get Username from db
module.exports.getUserByUsername = function (username, callback) {
	var query = {username: username};
	User.findOne (query, callback);
}

// Get User id from db
module.exports.getUserById = function (id, callback) {
	User.findById (id, callback);
}

// Compare password
module.exports.comparePassword = function (candidatePassword, hash, callback) {
	bcrypt.compare (candidatePassword, hash, function (err, isMatch) {
		if (err) throw err;
		callback (null, isMatch);
	});
}

