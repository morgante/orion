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
		radius: 200
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
			holeRadius: circle.radius / 2,
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
		var hierarchy = {"children": []};
		var layout = d3.layout.pack()
            .sort(null)
            .size([circle.radius, circle.radius])
            .padding(0);

		for (var i = 0; i < Math.floor((Math.random()*5)+5); i++) {
			hierarchy.children.push({
				"value": Math.floor((Math.random()*10)+1),
				"color": colors(i),
			});
		}

		var container = canvas.append("g")
			.attr('transform', 'translate(' + (bounds.x / 2 - circle.radius / 2) + ', ' + (bounds.y / 2 - circle.radius / 2) + ')');

		var node = container.selectAll(".node")
            .data(layout.nodes(hierarchy))
            .enter().append("g");
        
        gears = node.append("circle")
            .attr("stroke", "black")
            .style("fill", function(d) { return d.color; })
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .attr("r", function(d) { return d.r; });


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