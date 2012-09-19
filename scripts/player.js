var ProcessTree = require('./process'),
    SystemTree  = require('./system');

function Player(options) {
	var now = Date.now();
	options = options || {};
	options.systems = options.systems || {};
	options.processes = options.processes || {};

	var player = this;

	options.player           =
	options.systems.player   =
	options.processes.player = this;

	this.name = options.name || 'Singularity';

	this.now  = options.now  || now;
	this.last = options.last || now;

	this.minScale = options.minScale || 5;
	this.maxScale = options.maxScale || 150;

	this.currency = options.currency || '$';
	this.balance  = options.balance  || 300;

	this.processes = new ProcessTree(options.processes);
	this.systems   = new SystemTree(options.systems);

	this.region  = options.region || 'na-us';
	this.regions = SystemTree.regions;

	if (this.systems.length == 0)
		this.systems.add();


	var scale  = 5,
	    mips   = 0,
	    lastsc = 0; // last system count

	function update() {
		if (lastsc == player.systems.count)
			return;

		lastsc = player.systems.count;

		var stat = {
			mips: 0
		};

		player.systems.forEach(function(system) {
			stat.mips += system.mips;
		});

		mips = stat.mips;
	}

	Object.defineProperties(this, {
		scale: {
			set: function(value) {
				if (value >= this.minScale && value <= this.maxScale)
					scale = value;
			},

			get: function() {
				return scale;
			}
		},

		mips: { get: function() { update(); return mips; } }
	});

	this.scale = options.scale || scale;

	this._tick = [];

	this.processes.add();
}

Player.prototype.tick = function() {
	var delta = {},
	    now   = Date.now(),
	    d     = (now - this.last) * Math.pow(this.scale, 3);

	this.last = now;
	this.now += d;

	delta.raw    = d;
	delta.minute = d / 60000;
	delta.hour   = delta.minute / 60;
	delta.day    = delta.hour / 24;
	delta.week   = delta.day / 7;

	this._tick.forEach(function(fn) {
		fn(delta);
	});
};

Player.prototype.ontick = function(fn) {
	if (typeof fn == 'function')
		this._tick.push(fn);
};

module.exports = Player;
