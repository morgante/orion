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
	var gColor = '#4EAB4E';
	var colors = d3.scale.category10();

	function Link(el) {
		var self = this;

		this.$el = $(el);

		this.index = this.$el.index();
		this.$link = $('a', this.$el);

		this.$link.data('label', this.$link.text());

		this.id = this.$link.data('section');

		this.label(2.3, bounds.x);

		this.spoke().classed(this.id, true);

		this.$link.mouseover(function(evt) {
			self.hover();
		});

		this.$link.mouseleave(function(evt) {
			self.unhover();
		});
	}

	Link.prototype.label = function(factor, r) {
		var self = this;

		var angle = rotation * (this.index - 2);

		var x = (Math.cos(angle) * (r/factor)) + (r / 2);
		var y = (Math.sin(angle) * (r/factor)) + (r / 2);

		// compensate to use middle
		x -= this.$el.width() / 2;
		y -= this.$el.height() / 2;

		this.$el.css("left", x);
		this.$el.css("top", y);

		this.$link.click(function(evt) {
			evt.preventDefault();
			self.click();
		});
	};

	Link.prototype.spoke = function() {
		var i = this.$el.index();

		i = i - 3;

		if (i < 0) {
			i = links.length + i;
		}
		return gear.fetch(i);
	};

	Link.prototype.click = function() {
		this.spoke().classed(this.id, true);
		console.log('I have been clicked', this.$el.text());

		$.smoothScroll({
			scrollTarget: this.$link.attr('href')
		});

		var angle = this.index / links.length * 360;
		gear.rotate(angle);
	};

	Link.prototype.hover = function() {
		this.spoke().classed(this.id, true);
		this.spoke().classed("hover", true);
	};

	Link.prototype.unhover = function() {
		this.spoke().classed(this.id, true);
		this.spoke().classed("hover", false);
	};

	function positionate(percent) {
		var h = Math.max(200, orion.layout.height() * (1 - (percent / (1 / links.length))));
		var scale = ((h / orion.layout.height()));

		$('#nav').height(h + 10)
		$('#nav .contents').css('transform', 'scale(' + scale + ')');
		$('#nav .contents a').css('font-size', 18 / scale);
		$('#nav .contents a').css('width', 120 / scale);

		_.each(links, function(link) {
			link.label(2.2, bounds.x);
		});

		if (scale < 0.5) {
			$('#nav .contents a').each(function(i, el) {
				$(el).text($(el).data('label')[0]);
			});
		} else {
			$('#nav .contents a').each(function(i, el) {
				$(el).text($(el).data('label'));
			});
		}

		gear.rotate(percent * 360, 1); // instantly rotate gear
	}

	function drawGear() {
		gear = orion.gears.create(canvas, {
			x: bounds.x / 2,
			y: bounds.y / 2,
			radius: bounds.x / 3,
			holeRadius: circle.radius,
			addendum: 80,
			teeth: 8,
			color: gColor,
			click: function(i) {
				i = i + 3;

				if (i >= links.length) {
					i = i - links.length;
				}
				
				links[i].click();
			},
			hover: function(i) {
				i = i + 3;

				if (i >= links.length) {
					i = i - links.length;
				}
				
				links[i].hover();
			},
			unhover: function(i) {
				i = i + 3;

				if (i >= links.length) {
					i = i - links.length;
				}

				links[i].unhover();
			}
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
            .padding(-1);

        var force = d3.layout.force()
			.gravity(0)
			.charge(0)
			.friction(1)
			.size([circle.radius * 2, circle.radius * 2]);

		for (var i = 0; i < 10; i++) {
			hierarchy.children.push({
				"value": Math.floor((Math.random()*10)+1),
				"color": colors(i),
				dx: 0,
				dy: 2
			});
		}

		var container = canvas.append("g")
			.attr('transform', 'translate(' + (bounds.x / 2 - circle.radius) + ', ' + (bounds.y / 2 - circle.radius) + ')');

		var rotator = container.append("g");

		layout.nodes(hierarchy);

		force.nodes(layout.nodes(hierarchy)[0].children);

		var node = rotator.selectAll(".node")
            .data(layout.nodes(hierarchy))
            .enter().append("g");
        
        var circles = node.append("circle")
			.attr("stroke", "black")
			.style("fill", function(d) { return d.color; })
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; })
			.attr("r", function(d) { return d.r; });

		d3.timer(function() {
			// rotator.attr('transform', 'rotate(30)');
		});

	}

	function draw() {
		canvas = d3.select("#nav .contents").insert("svg", "ul")
			.attr("width", bounds.x)
			.attr("height", bounds.y);

		drawGear();
		drawCircles();
	}

	function onScroll() {
		var percent = $(window).scrollTop() / ($(document).height());

		positionate(percent);
	}

	function init() {

		$sections = $('#nav ul li');

		draw();

		positionate(0);
		onScroll();
		$(window).scroll(onScroll);
	}

	orion.nav = orion.nav || {
		init: init
	};
}(jQuery, orion));