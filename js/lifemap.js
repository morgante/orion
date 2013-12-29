/* lifemap */
(function($) {
    var canvas;
    var animators = [];
    var tracks = {};
    var xOffset = 100;
    var yOffset = 100;
    var yearLength = 15;

    var labeling = {
        height: 20,
        width: 100,
        offset: {
            x: 5,
            y: 10
        }
    };

    var onFrame = function(event) {
        animators.forEach(function(animator) {
            animator();
        });
    };

    var Car = function(path, opts) {
        var self = this;
        opts = _.defaults(opts, {
            width: 10,
            height: 10
        });

        this.path = path;

        this.segments = this.path.segments;
        this.last = this.path.firstSegment;
        this.target = this.path.firstSegment;

        var size = new paper.Size(opts.width, opts.height);
        this.car = new paper.Path.Rectangle(this.target.point, size);
        this.car.strokeColor = path.strokeColor;

        this.speed = opts.speed;

        this.dX = 0;
        this.dY = 0;

        this.goTo(_.last(this.segments));

        animators.push(function() {
            self.animate();
        });
    };

    Car.prototype.goTo = function(dest) {
        if ((this.destination && this.destination.equals(dest))) {
            return;
        }

        var route = [];
        var self = this;
        this.destination = dest;

        if (this.destination.index > this.last.index) {
            // we are going forwards
            _.each(this.segments, function(segment) {
                if (dest.index >= segment.index && segment.index > self.last.index) {
                    route.push(segment);
                }
            });
        } else {
            // going backwards, yay
            var segs = _.clone(this.segments);
            segs.reverse();
            _.each(segs, function(segment) {
                if (dest.index <= segment.index && segment.index < self.last.index) {
                    route.push(segment);
                }
            });
        }

        this.route = route;
        this.i = 0;

        this.moveTowards(route[0]);
    };

    Car.prototype.moveTowards = function(target) {
        this.target = target;

        steps = this.car.position.getDistance(this.target.point)/this.speed;

        this.dX = (this.target.point.x - this.car.position.x)/steps;
        this.dY = (this.target.point.y - this.car.position.y)/steps;
    };

    Car.prototype.animate = function() {
        if (this.car.position.getDistance(this.target.point) < 5) {
            this.last = this.target;
            if (this.route[this.i + 1]) {
                this.i++;
                this.moveTowards(this.route[this.i]);
            } else {
                this.dX = 0;
                this.dY = 0;
            }
        }

        // move it babe
        this.car.position.x += this.dX;
        this.car.position.y += this.dY;
    };

    var Track = function(opts) {
        opts = _.defaults(opts, {
            name: 'red',
            opacity: 0.5,
            y: yOffset,
            x: xOffset,
            width: 5
        });

        this.name = opts.name;

        this.start = new paper.Point(opts.x, opts.y);

        this.path = new paper.Path();
        this.path.strokeColor = this.name; // change this later
        this.path.strokeWidth = opts.width;
        this.path.opacity = opts.opacity;

        this.path.add(this.start);
        this.stations = [];
        this.last = this.start;
    };

    Track.prototype.addPoint = function(point) {
        if (point.y != this.last.y) {
            this.path.add(new paper.Point(point.x, this.last.y));
        }

        this.path.add(point);
        this.last = point;
    };

    Track.prototype.addStation = function(station) {
        this.stations.push(station);

        var point = station.getPoint();

        this.addPoint(point);
    };

    Track.prototype.realign = function() {
        var station = _.max(this.stations, function(station) {
            return station.year;
        });

        this.addPoint(new paper.Point(station.point.x + (station.duration * yearLength), this.start.y));
    };

    Track.prototype.addEnd = function(year) {
        this.realign();

        var x = yearLength * year;
        var y = this.last.y;

        this.path.add(new paper.Point(x, y));
    };

    Track.prototype.makeCar = function(opts) {
        this.car = new Car(this.path, opts);
    };

    Track.prototype.getSegment = function(point) {
        var rSeg;

        _.each(this.path.segments, function(segment) {
            if (segment.point.equals(point)) {
                rSeg = segment;
            }
        });

        return rSeg;
    };

    var Station = function(opts) {
        opts = _.defaults(opts, {
            tracks: [],
            year: 0,
            name: 'Some Event',
            duration: 2,
            colors: {
                normal: 'orange',
                hover: 'purple'
            }
        });

        this.tracks = opts.tracks;
        this.year = opts.year;
        this.name = opts.name;
        this.duration = opts.duration;
        this.colors = opts.colors;
    };

    Station.prototype.setPoint = function() {
        // determine the point for this event
        var y = _.reduce(_.map(this.tracks, function(track) {
            return track.last.y;
        }), function(sum, y) {
            return sum + y;
        }, 0)/_.size(this.tracks);

        var x = xOffset + (this.year * yearLength);
        this.point = new paper.Point(x, y);
    };

    Station.prototype.getPoint = function() {
        if (this.point === undefined) {
            this.setPoint();
        }

        return this.point;
    };

    Station.prototype.enter = function(event) {
        this.station.strokeColor = this.colors.hover;
        this.station.fillColor = this.colors.hover;
        document.body.style.cursor = "pointer";
    };

    Station.prototype.exit = function(event) {
        this.station.strokeColor = this.colors.normal;
        this.station.fillColor = this.colors.normal;
        document.body.style.cursor = "default";
    };

    Station.prototype.click = function(event) {
        var self = this;

        _.each(this.tracks, function(track) {
            var segment = track.getSegment(self.getPoint());
            track.car.goTo(segment);
        });
    };

    Station.prototype.draw = function() {
        var self = this;
        var point = this.getPoint();

        // draw the trail
        // _.each(this.tracks, function(track) {
        //     path = new paper.Path();
        //     path.strokeColor = track.path.strokeColor;
        //     path.strokeWidth = 5;
        //     path.opacity = 0.8;

        //     path.add(point);

        //     path.add(point.add([self.duration * yearLength, 0]));
        // });

        // draw the station
        var station = new paper.Path.Circle(point, 5);
        station.strokeColor = this.colors.normal;
        station.fillColor = this.colors.normal;
        this.station = station;

        // when you hover on stations
        this.station.onMouseEnter = function(event) {
            self.enter(event);
        };
        this.station.onMouseLeave = function(event) {
            self.exit(event);
        };
        this.station.onClick = function(event) {
            self.click(event);
        };

        // label the station
        var lPoint = point.add([labeling.offset.x, labeling.offset.y]);
        if (this.testDraw(lPoint)) {
            lPoint = lPoint.add([0, labeling.offset.y]);
        } else {
            lPoint = point.add([labeling.offset.x, -1 * labeling.offset.y]);
        }

        this.label = new paper.PointText({
            point: lPoint,
            content: this.name,
            fillColor: 'black',
            fontFamily: 'Courier New',
            fontWeight: 'bold',
            fontSize: 15
        });
    };

    Station.prototype.testDraw = function(point) {
        var layer = paper.project.activeLayer;
        var paths = layer.children;

        var rect = new paper.Path.Rectangle(point, new paper.Size(labeling.width, labeling.height));
        rect.strokeColor = 'black';
        rect.visible = false;

        var noConflict = _.every(paths, function(path) {
            if (!path.equals(rect) && path.getIntersections !== undefined) {
                var intersect = path.getIntersections(rect);
                if (intersect.length > 0) {
                    return false;
                }
            }
            return true;
        });

        return noConflict;
    };

    Station.prototype.direct = function() {
        var station = this;

        _.each(this.tracks, function(track) {
            track.addStation(station);
        });
    };

    var init = function() {
        // hide the lifemap
        $('.lifemap').hide();

        canvas = document.getElementById('myLifemap');

        paper.setup(canvas);

        tracks = {
            'red': new Track({
                name: 'red',
                y: yOffset
            }),
            'green': new Track({
                name: 'green',
                y: yOffset*2
            }),
            'blue': new Track({
                name: 'blue',
                y: yOffset*3
            }),
        };

        stations = [
            new Station({
                tracks: [tracks.red],
                year: 5
            }),
            new Station({
                tracks: [tracks.green],
                year: 5,
                duration: 3
            }),
            new Station({
                tracks: [tracks.green],
                year: 15
            }),
            new Station({
                tracks: [tracks.green, tracks.red],
                year: 7
            }),
            new Station({
                tracks: [tracks.blue],
                year: 5,
                duration: 5
            }),
            new Station({
                tracks: [tracks.blue, tracks.green],
                year: 30,
                duration: 5
            }),
            new Station({
                tracks: [tracks.blue, tracks.green, tracks.red],
                year: 40,
                duration: 10
            })
        ];

        // sort our stations
        stations = _.sortBy(stations, function(station) {
            return station.year;
        });

        _.each(stations, function(station) {
            station.direct();
        });

        _.each(tracks, function(track) {
            // they all need to end at the same place
            track.addEnd(75);

            track.makeCar({
                speed: track.path.length / 200
            });
        });

        _.each(stations, function(station) {
            station.draw();
        });

        paper.view.onFrame = onFrame;

        // Draw the view now:
        paper.view.draw();

    };

    $(init);
}(jQuery));