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

    Skill.prototype.draw = function() {
        // happens down below
        
        // var p = new paper.Point(50, 50);
                
        // var outerCircle = new paper.Path.Circle(p, 10);
        // outerCircle.fillColor = 'blue';
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

    function drawGear(d) {
        var options = {};

        var addendum = options.addendum || 10;
        var radius = d.r - addendum;


        var dedendum = options.dedendum || 0,
            thickness = options.thickness || 0.7,
            profileSlope = options.profileSlope || 0.5,
            holeRadius = options.holeRadius || 5,
            teeth = options.teeth || 16,
            rootRadius = radius - dedendum,
            outsideRadius = radius + addendum,
            circularPitch = (1 - thickness) * 2 * Math.PI / teeth,
            pitchAngle = thickness * 2 * Math.PI / teeth,
            slopeAngle = pitchAngle * profileSlope * 0.5,
            addendumAngle = pitchAngle * (1 - profileSlope),
            theta = (addendumAngle * 0.5 + slopeAngle),
            path = ['M', rootRadius * Math.cos(theta), ',', rootRadius * Math.sin(theta)];

        for(var i = 0; i < teeth; i++) {
            theta += circularPitch;

            path.push(
              'A', rootRadius, ',', rootRadius, ' 0 0,1 ', rootRadius * Math.cos(theta), ',', rootRadius * Math.sin(theta),
              'L', radius * Math.cos(theta), ',', radius * Math.sin(theta)
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
            .enter().append("g");
        
        // gears = node.append("circle")
        //     .attr("stroke", "black")
        //     // .style("fill", function(d) { return d.color; })
        //     .attr("cx", function(d) { return d.x; })
        //     .attr("cy", function(d) { return d.y; })
        //     .attr("r", function(d) { return d.r; });
        
        var nGears = node.append('g')
                .attr('class', 'gear')
                .attr('transform', function(d) {
                    return 'translate(' + d.x + ', ' + d.y + ')';
                });

        nGears.append("svg:path")
            .attr("d", drawGear)
            .style("stroke-width", 2)
            .style("stroke", "steelblue")
            .style("fill", "none");

        // gears.on("click", function(skillRep) {
        //     var gear = this;
        //     var skill = skills[skillRep.name];

        //     skill.highlight();
        // });

        // _.invoke(skills, 'draw');
    }

    function setup(stations) {
        allStations = stations;

        _.each(stations, addStation);

        draw();
    }

    return {
        setup: setup
    };
}($, d3));