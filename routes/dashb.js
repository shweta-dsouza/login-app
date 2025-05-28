var express = require ('express');
var router = express.Router ();

// Get Dashboard
router.get ('/', ensureAuthenticated, function (req, res) {
	res.render ('dashb');
});

// Validation
function ensureAuthenticated (req, res, next) {
	if (req.isAuthenticated ()) {
		return next();
	} else {
		req.flash ('error_msg', 'You need to Login first');
		res.redirect ('/users/login');
	}
}

module.exports = router;
