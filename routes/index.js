var Player = require('../scripts/player');

exports['/'] = function(req, res) {
	res.render('game', { player: new Player() });
};
