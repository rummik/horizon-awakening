var $ = require('jquery-browserify');

// array shuffler
function shuffle(items) {
	var i, tmp = [];

	while (items.length > 0)
		tmp.push(items.splice(Math.floor(Math.random() * items.length), 1)[0]);

	return tmp;
}

// blooming effect
$.fn.bloom = function(style, n1, n2) {
	var $this   = $(this),
	    cb      = typeof n1 == 'function' ? n1 : n2,
	    reverse = (typeof n1 == 'function' ? n2 : n1) === true,
	    stack   = [].concat(shuffle($this.find('input, button, span')),
				shuffle($this.find('img')),
				shuffle($this));

	if (reverse === true)
		stack.reverse();

	$.each(stack, function(i) {
		var $this = $(this);
		setTimeout($this.animate.bind($this, style, 200), (1000 / stack.length) * i);
	});

	if (typeof cb == 'function')
		setTimeout(cb.bind(this), 1200);
};
