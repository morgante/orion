/* lifemap */
(function($) {
    var canvas;
    var animators = [];
    var tracks = {};
    var xOffset = 100;
    var yOffset = 100;
    var yearLength = 15;
    var speed = 200;

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

    var Track = function(opts) {
        opts = _.defaults(opts, {
            name: 'red',
            opacity: 0.5,
            y: yOffset,
            x: xOffset
        });

        this.name = opts.name;

        this.start = new paper.Point(opts.x, opts.y);

        this.path = new paper.Path();
        this.path.strokeColor = this.name; // change this later
        this.path.strokeWidth = 5;
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

    Track.prototype.addEnd = function(year) {
        var station = _.max(this.stations, function(station) {
            return station.year;
        });

        this.addPoint(new paper.Point(station.point.x + (station.duration * yearLength), this.start.y));

        var x = yearLength * year;
        var y = this.last.y;

        this.path.add(new paper.Point(x, y));
    };

    Track.prototype.makeCar = function(speed) {
        var path = this.path;

        var segments = path.segments;
        var target = path.firstSegment;

        var size = new paper.Size(10, 10);

        var car = new paper.Path.Rectangle(target.point, size);

        car.strokeColor = path.strokeColor;

        var steps;

        var dX;
        var dY;

        var goTowards = function(where) {
            target = where;

            steps = car.position.getDistance(target.point)/speed;

            dX = (target.point.x - car.position.x)/steps;
            dY = (target.point.y - car.position.y)/steps;

        };

        goTowards(target.next);

        animators.push(function() {
            if (car.position.getDistance(target.point) < 3) {
                if (target.next) {
                    goTowards(target.next);
                } else {
                    dX = 0;
                    dY = 0;
                }
            }

            // move it babe
            car.position.x += dX;
            car.position.y += dY;
        });
    };

    var Station = function(opts) {
        opts = _.defaults(opts, {
            tracks: [],
            year: 0,
            name: 'Some Event',
            duration: 2
        });

        this.tracks = opts.tracks;
        this.year = opts.year;
        this.name = opts.name;
        this.duration = opts.duration;
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

    Station.prototype.draw = function() {
        var point = this.getPoint();
        var color = {
            normal: 'orange',
            hover: 'purple'
        };

        // draw the station
        var station = new paper.Path.Circle(point, 5);
        station.strokeColor = color.normal;
        station.fillColor = color.normal;
        this.station = station;

        // when you hover on stations
        this.station.onMouseEnter = function(event) {
            station.strokeColor = color.hover;
            station.fillColor = color.hover;
            document.body.style.cursor = "pointer";
        };
        this.station.onMouseLeave = function(event) {
            station.strokeColor = color.normal;
            station.fillColor = color.normal;
            document.body.style.cursor = "default";
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

            track.makeCar(track.path.length / speed);
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