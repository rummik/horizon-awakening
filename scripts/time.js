function Time() {
	var scale = 5;

	this.now = 0;

	Object.defineProperties(this, {
		scale: {
			set: function(val) {
				if (val > minScale && val < maxScale)
					scale = val;
			},

			get: function() {
				return scale;
			}
		}
	});
}

Time.prototype.tick = function(time) {
};
