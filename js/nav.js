(function($, orion) {

	var canvas;
	var gear;
	var bounds = {
		x: 600,
		y: 600
	};
	var links = [];
	var $sections;
	var rotation = 45 / 180 * Math.PI;

	function Link(el) {
		this.$el = $(el);

		this.index = this.$el.index();

		var angle = rotation * (this.index - 2);

		var x = (Math.cos(angle) * (bounds.x/2)) + (bounds.x / 2);
		var y = (Math.sin(angle) * (bounds.x/2)) + (bounds.x / 2);

		this.$el.css("left", x);
		this.$el.css("top", y);
	}

	function draw() {
		canvas = d3.select("#nav").append("svg")
			.attr("width", bounds.x)
			.attr("height", bounds.y);

		gear = orion.gears.create(canvas, {
			x: bounds.x / 2,
			y: bounds.y / 2,
			radius: bounds.x / 3,
			holeRadius: 60,
			addendum: 50,
			teeth: 8
		});

		var angle = (45 / 360) * Math.PI;

		$sections.each(function(i, el) {
			links.push(new Link($(el)));
		});
	}

	function init() {

		$sections = $('#nav ul li');

		draw();
	}

	orion.nav = orion.nav || {
		init: init
	};
}(jQuery, orion));