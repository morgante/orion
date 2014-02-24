(function($, orion) {

	var canvas;
	var gear;
	var bounds = {
		x: 800,
		y: 800
	};
	var links = [];
	var $sections;
	var rotation = 45 / 180 * Math.PI;
	var circle = {
		radius: 100
	};

	function Link(el) {
		this.$el = $(el);

		this.index = this.$el.index();

		var angle = rotation * (this.index - 2);

		var x = (Math.cos(angle) * (bounds.x/2.2)) + (bounds.x / 2);
		var y = (Math.sin(angle) * (bounds.x/2.4)) + (bounds.x / 2);

		// compensate to use middle
		x -= this.$el.width() / 2;
		y -= this.$el.height() / 2;

		this.$el.css("left", x);
		this.$el.css("top", y);
	}

	function drawGear() {
		gear = orion.gears.create(canvas, {
			x: bounds.x / 2,
			y: bounds.y / 2,
			radius: bounds.x / 3,
			holeRadius: circle.radius,
			addendum: 80,
			teeth: 8,
			color: '#4EAB4E'
		});

		$sections.each(function(i, el) {
			links.push(new Link($(el)));
		});
	}

	function drawCircles() {
		var colors = d3.scale.category10();
		var hierarchy = {"dx": 0, "dy": 0, "children": []};
		var layout = d3.layout.pack()
            .sort(null)
            .size([circle.radius * 2, circle.radius * 2])
            .padding(5);

        var force = d3.layout.force()
			.gravity(0)
			.charge(0)
			.friction(1)
			.size([circle.radius * 2, circle.radius * 2]);

		for (var i = 0; i < 2; i++) {
			hierarchy.children.push({
				"value": Math.floor((Math.random()*10)+1),
				"color": colors(i),
				dx: 0,
				dy: 2
			});
		}

		var container = canvas.append("g")
			.attr('transform', 'translate(' + (bounds.x / 2 - circle.radius) + ', ' + (bounds.y / 2 - circle.radius) + ')');

		layout.nodes(hierarchy);

		force.nodes(layout.nodes(hierarchy)[0].children);

		var node = container.selectAll(".node")
            .data(force.nodes())
            .enter().append("g");
        
        var circles = node.append("circle")
			.attr("stroke", "black")
			.style("fill", function(d) { return d.color; })
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; })
			.attr("r", function(d) { return d.r; });

		// force.nodes(layout.nodes());
		
		function cTick() {
			circles.each(function(d) {
				d.px = d.x;
				d.py = d.y;
				d.y = d.y + d.dy;
				d.x = d.x + d.dx;
				d.pythag = pythag(d) + d.r + 2;

				if (d.pythag > circle.radius) {
					// outside the circle
					if (d.y > circle.radius) {
						// d.y -= (d.pythag - circle.radius);
					}

					// roll towards center
					if (d.x > circle.radius) {
						d.dx = -2;
					} else if (d.x < circle.radius) {
						d.dx = 2;
					}

					d.dy = 0;
				} else {
					d.dy = 2;
					d.dx = 0;
				}
			});

			var q = d3.geom.quadtree(force.nodes());

			circles.each(function(d) {
				q.visit(collide(d));
			});

			console.log('tick tock');

			// move them into new places
			circles
				.attr("cx", function (d) { return d.x; })
				.attr("cy", function (d) { return d.y; });

			
		}

		cTick();

		force.on("tick", cTick);

		force.start();

		// setTimeout(force.stop, 3000);
	}

	function collide(node) {
		var r = node.r + 16;
		var nx1 = node.x - r;
		var nx2 = node.x + r;
		var ny1 = node.y - r;
		var ny2 = node.y + r;

		return function(quad, x1, y1, x2, y2) {
			if (quad.point && (quad.point !== node)) {
				var x = node.x - quad.point.x,
				y = node.y - quad.point.y,
				l = Math.sqrt(x * x + y * y),
				r = node.radius + quad.point.radius;
				if (l < r) {
					l = (l - r) / l * .5;
					node.dx = x *= l;
					node.dy = y *= l;
					quad.point.dx = x;
					quad.point.dy = y;
				}
			}
			return x1 > nx2
				|| x2 < nx1
				|| y1 > ny2
				|| y2 < ny1;
		};
}

	function pythag(d) {
		var x = d.x - circle.radius;
		var y = d.y - circle.radius;
		// console.log(x, y);
		return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
	}

	function draw() {
		canvas = d3.select("#nav").append("svg")
			.attr("width", bounds.x)
			.attr("height", bounds.y);

		drawGear();
		drawCircles();
	}

	function init() {

		$sections = $('#nav ul li');

		draw();
	}

	orion.nav = orion.nav || {
		init: init
	};
}(jQuery, orion));