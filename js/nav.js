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

		positionate(0);
		onScroll();
		$(window).scroll(onScroll);
	}

	function drawBubbles() {
		canvas.append("circle")
            .attr("stroke", "black")
            .style("fill", "pink")
            .attr("cx", circle.radius)
            .attr("cy", circle.radius)
            .attr("r", circle.radius);

		orion.bubbles.draw(canvas, {});
	}

	function draw() {
		canvas = d3.select("#nav .contents").insert("svg", "ul")
			.attr("width", bounds.x)
			.attr("height", bounds.y);

		// drawGear();
		drawBubbles();
	}

	function onScroll() {
		var percent = $(window).scrollTop() / ($(document).height());

		positionate(percent);
	}

	function init() {

		$sections = $('#nav ul li');

		draw();
	}

	orion.nav = orion.nav || {
		init: init
	};
}(jQuery, orion));