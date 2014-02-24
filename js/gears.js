(function($, orion) {

	function Gear(parent, options) {
		options = options || {};

		this.options = _.defaults(options, {
			radius: 50,
			teeth: 10,
			color: "blue",
			x: 60,
			y: 60,
			addendum: 10
		});

		var datum = {
            x: options.x || 0,
            y: options.y || 0,
            speed: options.power || 5,
            angle: options.angle || 0,
            addendum: options.addendum,
            dedendum: options.dedendum || 0,
            thickness: options.thickness || 0.7,
            profileSlope: options.profileSlope || 0.5,
            holeRadius: options.holeRadius || (options.radius / 3),
            axisScale: options.axisScale || 1.5,
            dragEvent: 'dragend'
        };
        datum.radius = this.options.radius - Math.round((datum.addendum / 1.5));
        datum.teeth = options.teeth || Math.round(datum.radius / 4);
        datum.rootRadius = datum.radius - datum.dedendum;
        datum.outsideRadius = datum.radius + datum.addendum;
        datum.circularPitch = (1 - datum.thickness) * 2 * Math.PI / datum.teeth;
        datum.pitchAngle = datum.thickness * 2 * Math.PI / datum.teeth;
        datum.slopeAngle = datum.pitchAngle * datum.profileSlope * 0.5;
        datum.addendumAngle = datum.pitchAngle * (1 - datum.profileSlope);
        this.datum = datum;

        this.gear = parent.append('g')
            .attr('class', 'gear')
            .attr('transform', 'translate(' + datum.x + ', ' + datum.y + ')');

        this.path = this.gear.append("svg:path")
            .attr("d", makePath(datum))
            .style("stroke-width", 2)
            .style("stroke", options.color)
            .style("fill", options.color);

        for (var i = 0; i < datum.teeth; i++) {
            this.gear.append("svg:path")
                .data([i])
                .attr('class', 'spoke')
                .attr("d", makeSpoke(datum, i))
                .style("stroke-width", 0)
                .style("fill", options.color);
        }

        if (options.click) {
            parent.selectAll('.spoke').on("click", function(d,i) {
                options.click(i);
            });
        }
	}

    function makeSpoke(d, target) {
        var outsideRadius = d.outsideRadius;
        var slopeAngle = d.slopeAngle;
        var theta = (d.addendumAngle * 0.5 + d.slopeAngle);
        var radius = d.radius;
        var holeRadius = d.holeRadius;
        var rootRadius = d.rootRadius;
        var circularPitch = d.circularPitch;
        var teeth = d.teeth;
        var addendumAngle = d.addendumAngle;

        var path = [];

        path.push('M0,0');

        for (var i = 0; i < teeth; i++) {
            theta += circularPitch;

            if (i == target) {
                path.push(
                  'L', d.radius * Math.cos(theta), ',', d.radius * Math.sin(theta)
                );
            }
            
            
            theta += slopeAngle;
            if (i == target) {
                path.push('L', outsideRadius * Math.cos(theta), ',', outsideRadius * Math.sin(theta));
            }
            theta += addendumAngle;
            if (i == target) {
                path.push('A', outsideRadius, ',', outsideRadius, ' 0 0,1 ', outsideRadius * Math.cos(theta), ',', outsideRadius * Math.sin(theta));
            }
            theta += slopeAngle;

            if (i == target) {
                path.push(
                    'L', radius * Math.cos(theta), ',', radius * Math.sin(theta),
                    'L', rootRadius * Math.cos(theta), ',', rootRadius * Math.sin(theta)
                );
            }
        }

        return path.join('');
    }

	function makePath(d) {
        var outsideRadius = d.outsideRadius;
        var slopeAngle = d.slopeAngle;
        var theta = (d.addendumAngle * 0.5 + d.slopeAngle);
        var radius = d.radius;
        var holeRadius = d.holeRadius;
        var rootRadius = d.rootRadius;
        var circularPitch = d.circularPitch;
        var teeth = d.teeth;
        var addendumAngle = d.addendumAngle;

        var path = ['M', rootRadius * Math.cos(theta), ',', rootRadius * Math.sin(theta)];

        for (var i = 0; i < teeth; i++) {
            theta += circularPitch;

            path.push(
              'A', rootRadius, ',', rootRadius, ' 0 0,1 ', rootRadius * Math.cos(theta), ',', rootRadius * Math.sin(theta),
              'L', d.radius * Math.cos(theta), ',', d.radius * Math.sin(theta)
            );

            theta += slopeAngle;
            path.push('L', outsideRadius * Math.cos(theta), ',', outsideRadius * Math.sin(theta));
            theta += addendumAngle;
            path.push('A', outsideRadius, ',', outsideRadius, ' 0 0,1 ', outsideRadius * Math.cos(theta), ',', outsideRadius * Math.sin(theta));
            theta += slopeAngle;

            path.push(
                'L', radius * Math.cos(theta), ',', radius * Math.sin(theta),
                'L', rootRadius * Math.cos(theta), ',', rootRadius * Math.sin(theta)
            );
        }

        path.push('M0,', -holeRadius, 'A', holeRadius, ',', holeRadius, ' 0 0,0 0,', holeRadius, 'A', holeRadius, ',', holeRadius, ' 0 0,0 0,', -holeRadius, 'Z');

        return path.join('');
    }

	orion.gears = orion.gears || {
		create: Gear
	};
}(jQuery, orion));