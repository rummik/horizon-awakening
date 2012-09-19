function System(options) {
	this.type = options.type || 0;

	this.name = options.name || 'System ' + Math.ceil(Math.random() * 100);

	this.player = options.player || {};

	var occupied = 1;

	Object.defineProperties(this, {
		occupied: {
			get: function() { return occupied; },

			set: function(v) {
				if (v > 0 && v <= this.capacity)
					occupied = v;
			}
		}
	});
}

Object.defineProperties(System.prototype, {
	mips: { get: function() {
		return System.types[this.type].mips * this.occupied;
	} },

	watts: { get: function() {
		return System.types[this.type].watts * this.occupied;
	} },

	ram: { get: function() {
		return System.types[this.type].ram * this.occupied;
	} },

	capacity: { get: function() {
		return System.types[this.type].capacity;
	} },

	cost: { get: function() {
		return System.types[this.type].cost;
	} },
});

// cost layout: money, instructions, hours, materials
System.types = [
	{ mips: 4600, watts: 250, ram: 2048, capacity: 1, cost: [ 300, 0, 5, 0 ] },
];


function SystemTree(options) {
	Object.defineProperty(this, 'player', { writable: false, value: options.player });

	for (var region in SystemTree.regions)
		this[region] = [];
}

SystemTree.prototype = [];

SystemTree.prototype.add = function(options) {
	options = options || {};
	options.type = options.type || 0;
	options.player = this.player;

	if (this.player.balance < System.types[options.type].cost[0])
		return;

	this.player.balance -= System.types[options.type].cost[0];

	if (!this[options.region])
		options.region = this.player.region;

	var system = new System(options),
	    id     = this.push(system) - 1,
	    rid    = this[options.region].push(system) - 1;

	Object.defineProperties(system, {
		id: { value: id, writable: false },
		rid: { value: rid, writable: false },
		region: { value: options.region, writable: false }
	});
};

Object.defineProperty(SystemTree.prototype, 'count', { get: function() {
	return this.map(function(system) {
		return system.occupied;
	}).reduce(function(a, b) {
		return a + b;
	});
} });

SystemTree.regions = {
	'af':    'Africa',
	'an':    'Antarctica',
	'as':    'Asia',
	'as-cn': 'China',
	'as-jp': 'Japan',
	'eu':    'Europe',
	'eu-gb': 'United Kingdom',
	'eu-ru': 'Russia',
	'na':    'North America',
	'na-ca': 'Canada',
	'na-mx': 'Mexico',
	'na-us': 'United States',
	'oc':    'Australia',
	'sa':    'South America',
	'sp-ma': 'Mars',
	'sp-mo': 'Moon',
	'sp-or': 'Low-Earth Orbit',
	'sp-rb': 'Reality Bubble'
};

module.exports = SystemTree;
