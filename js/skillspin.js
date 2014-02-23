/*
    Spinning skill gears.

    Based on: https://github.com/liabru/gears-d3-js

 */

var skillspin = (function($, d3, undefined) {
    var skills = {};
    var allStations = [];
    var tracks = {};
    var bounds = {
        x: 200,
        y: 200
    };
    var layout;
    var canvas;
    var gears;
    var colors = d3.scale.category10();

    function Skill(opts) {
        opts = _.defaults(opts, {
            name: 'sam',
            stations: []
        });

        this.options = opts;
        this.stations = opts.stations;
        this.name = opts.name;
        this.max = 0;
    }

    Skill.prototype.addStation = function(station) {
        this.stations.push(station);

        station.skills[this.name] = this;

        if (station._skills[this.name] > this.max) {
            this.max = station._skills[this.name];
        }
    };

    function mesh(a, b) {
        console.log(a.radius, b.radius);
        var theta = Math.atan2(b.y - a.y, b.x - a.x);
        if (theta <= 0) {
            theta = 2 * Math.PI + theta;
        }

        var pitch = b.circularPitch + b.slopeAngle * 2 + b.addendumAngle;
        var radiusRatio = a.radius / b.radius;

        var angle = -(a.angle % (2 * Math.PI)) * radiusRatio + theta + theta * radiusRatio + pitch * 0.5;
        angle = angle * 2; // why? I do not know...
        return angle;
    }

    Skill.prototype.animate = function() {
        this.datum.angle = this.datum.angle + this.datum.speed;
        this.rotate();
    };

    Skill.prototype.rotate = function() {
        this.path.attr('transform', 'rotate(' + this.datum.angle * (360 / Math.PI) + ')');
    };

    Skill.prototype.mesh = function(otherSkill) {
        this.datum.angle = mesh(this.datum, otherSkill.datum);
        this.rotate();
    };

    Skill.prototype.makePath = function(d) {
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
    };

    Skill.prototype.draw = function(node) {
        var options = this.options;

        var datum = {
            x: node.x || 0,
            y: node.y || 0,
            speed: options.power || 5,
            power: options.power || 0,
            angle: options.angle || 0,
            addendum: options.addendum || 10,
            dedendum: options.dedendum || 0,
            thickness: options.thickness || 0.7,
            profileSlope: options.profileSlope || 0.5,
            holeRadius: options.holeRadius || 5,
            axisScale: options.axisScale || 1.5,
            dragEvent: 'dragend'
        };
        datum.radius = node.r - Math.round((datum.addendum / 1.5));
        datum.teeth = options.teeth || Math.round(datum.radius / 4);
        datum.rootRadius = datum.radius - datum.dedendum;
        datum.outsideRadius = datum.radius + datum.addendum;
        datum.circularPitch = (1 - datum.thickness) * 2 * Math.PI / datum.teeth;
        datum.pitchAngle = datum.thickness * 2 * Math.PI / datum.teeth;
        datum.slopeAngle = datum.pitchAngle * datum.profileSlope * 0.5;
        datum.addendumAngle = datum.pitchAngle * (1 - datum.profileSlope);

        this.datum = datum;

        this.gear = canvas.append('g')
            .attr('class', 'gear')
            .attr('transform', 'translate(' + node.x + ', ' + node.y + ')');

        this.path = this.gear.append("svg:path")
            .attr("d", this.makePath(datum))
            .style("stroke-width", 2)
            .style("stroke", node.color)
            .style("fill", node.color);
    };

    Skill.prototype.highlight = function() {
        var skill = this;

        _.each(this.stations, function(station) {
            station.inflate(skill.color);
        });

        // unhighlight other stations
        _.each(_.difference(allStations, this.stations), function(station) {
            station.unhighlight();
        });
    };

    function addStation(station) {
        _.each(station._skills, function(value, skill) {
            if (!(skill in skills)) {
                skills[skill] = new Skill({name: skill});
            }

            skills[skill].addStation(station);
        });
    }

    function redraw(seconds) {
        _.each(hierarchy.children, function(child) {
            child.size = Math.floor(Math.random()*30);
        });

        // trigger recalculation
        layout.nodes(hierarchy);

        gears.transition()
            .duration(500)
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .attr("r", function(d) { return d.r; });
    }

    function draw() {
        // set up colors
        _.each(_.values(skills), function(skill, i) {
            skill.color = colors(i);
        });

        layout = d3.layout.pack()
            .sort(null)
            .size([bounds.x, bounds.y])
            .padding(0);

        canvas = d3.select("#skillspinner").append("svg")
            .attr("width", bounds.x)
            .attr("height", bounds.y)
            .attr("class", "bubble");

        var hierarchy = {"children": []};

        _.each(skills, function(skill) {
            hierarchy.children.push({
                "skill": skill,
                "size": skill.max,
                "name": skill.name,
                "color": skill.color
            });
        });

        layout.value(function(d) {
            return d.size;
        });

        var node = canvas.selectAll(".node")
            .data(layout.nodes(hierarchy))
            // .enter().append("g");
        
        _.each(layout.nodes(hierarchy), function(node) {
            if (node.depth < 1) {
                return; // do not draw root node
            }
            node.skill.draw(node);
        });

        skills.love.mesh(skills.him);

        // console.log(layout.nodes(hierarchy));

        // gears = node.append("circle")
        //     .attr("stroke", "black")
        //     // .style("fill", function(d) { return d.color; })
        //     .attr("cx", function(d) { return d.x; })
        //     .attr("cy", function(d) { return d.y; })
        //     .attr("r", function(d) { return d.r; });
        
        // var nGears = node.enter().append('g')
        //         .attr('class', 'gear')
        //         .attr('transform', function(d) {
        //             return 'translate(' + d.x + ', ' + d.y + ')';
        //         });

        // nGears.append("svg:path")
        //     .attr("d", drawGear)
        //     .style("stroke-width", 2)
        //     .style("stroke", "steelblue")
        //     .style("fill", "none");

        // gears.on("click", function(skillRep) {
        //     var gear = this;
        //     var skill = skills[skillRep.name];

        //     skill.highlight();
        // });

        // _.invoke(skills, 'draw');
    }

    function animate() {
        d3.timer(function () {
            _.invoke(skills, 'animate');
        });
    }

    function setup(stations) {
        allStations = stations;

        _.each(stations, addStation);

        draw();
        animate();
    }

    return {
        setup: setup
    };
}($, d3));