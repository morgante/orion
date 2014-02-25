(function($, orion) {
    var canvas;
    var container;
    var colors;
    var hierarchy = {"dx": 0, "dy": 0, "children": []};
    var layout;
    var force;
    var options;
    var bubbles;
    var bounds = {};

	function make(parent, opts) {
        canvas = parent;

        options = _.defaults(opts, {
            radius: 100
        });

        bounds = {
            center: {x: options.radius, y: options.radius},
            top: 0,
            bottom: options.radius * 2,
            left: 0,
            right: options.radius * 2
        };

        drawbubbles();
    }

    function drawbubbles() {
        colors = d3.scale.category10();
        
        layout = d3.layout.pack()
            .sort(null)
            .size([options.radius * 2, options.radius * 2])
            .padding(10);

        force = d3.layout.force()
            .gravity(0)
            .charge(0)
            .friction(1)
            .size([options.radius * 2, options.radius * 2]);

        for (var i = 0; i < 5; i++) {
            hierarchy.children.push({
                "value": Math.floor((Math.random()*10)+1),
                "color": colors(i),
                dx: 0,
                dy: 2
            });
        }

        canvas.append("circle")
                    .attr("stroke", "black")
                    .style("fill", "orange")
                    .attr("cx", bounds.center.x)
                    .attr("cy", bounds.center.y)
                    .attr("r", 5);

        container = canvas.append("g");

        layout.nodes(hierarchy);

        force.nodes(layout.nodes(hierarchy)[0].children);

        var node = container.selectAll(".node")
            .data(force.nodes())
            .enter().append("g");
        
        bubbles = node.append("circle")
            .attr("stroke", "black")
            .attr("stroke-width", 0)
            .style("fill", function(d) { return d.color; })
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .attr("r", function(d) { return d.r; });

        d3.timer(tick);

        // force.on("tick", tick);

        force.start();

        // setTimeout(force.stop, 3000);
    }

    function tick() {
        bubbles.each(function(d) {
            d.theta = angle(d);
            d.px = d.x;
            d.py = d.y;
            d.y = d.y + d.dy;
            d.x = d.x + d.dx;
            d.distance = distance(d, bounds.center) + d.r;

            if (d.distance > options.radius) {
                if (d.x < options.radius) {
                    d.dx = 2;
                } else {
                    d.dx = -2;
                }

                if (d.y < options.radius) {
                    d.dy = 2;
                } else {
                    d.dy = -2;
                }
            } else {
                d.dx = 0;
                d.dy = 1;
            }
        });

        var q = d3.geom.quadtree(force.nodes());

        bubbles.each(function(d) {
            q.visit(collide(d));
        });

        // move them into new places
        bubbles
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });

    }

    function angle(d) {
        return Math.atan2(d.y - bounds.center.y, d.x - bounds.center.x);
    }

    function collide(node) {
        var r = node.r + 16;
        var nx1 = node.x - r;
        var nx2 = node.x + r;
        var ny1 = node.y - r;
        var ny2 = node.y + r;

        return function(quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== node)) {
                if (distance(quad.point, node) < (node.r + quad.point.r)) {
                    if (quad.point.x > node.x) {
                        node.dx = -1;
                    } else {
                        node.dx = 1;
                    }

                    if (quad.point.y > node.y) {
                        node.dy = -1;
                    } else {
                        node.dy = 1;
                    }
                }
            }
            return false;
        };
    }

    function distance(d1, d2) {
        var x = d2.x - d1.x;
        var y = d2.y - d1.y;

        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    }

	orion.bubbles = orion.bubbles || {
		draw: make
	};
}(jQuery, orion));