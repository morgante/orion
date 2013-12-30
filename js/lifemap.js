/* lifemap */
(function($) {
    var canvas;
    var animators = [];
    var tracks = {};
    var xOffset = 100;
    var yOffset = 100;
    var timeLength = 10;

    var onFrame = function(event) {
        animators.forEach(function(animator) {
            animator();
        });
    };

    var Car = function(path, opts) {
        var self = this;
        opts = _.defaults(opts, {
            size: 10,
            speed: 100
        });

        this.path = path;

        this.speed = this.path.length / (10000 / opts.speed);
        this.offset = 0;
        this.dOffset = this.speed;
        this.direction = 1; // going forwards or backwards?

        var size = new paper.Size(opts.size, opts.size);
        this.car = new paper.Path.Rectangle(this.path.firstSegment.point, size);
        this.car.strokeColor = path.strokeColor;
        this.car.fillColor = path.strokeColor;

        this.goTo(this.path.lastSegment.point);

        animators.push(function() {
            self.animate();
        });
    };

    Car.prototype.goTo = function(dest) {
        if ((this.destination && this.destination.equals(dest))) {
            return;
        }

        var location = this.path.getLocationOf(dest);
        this.destination = dest;

        if (location.offset > this.offset) {
            // move forwards
            this.direction = 1;
        } else if (location.offset < this.offset) {
            // move backwards
            this.direction = -1;
        } else {
            // move nowhere
            this.direction = 0;
        }
    };

    Car.prototype.teleport = function(point) {
        this.destination = point;
        this.car.position = point;
        this.stop();
    };

    Car.prototype.stop = function() {
        this.direction = 0;
    };

    Car.prototype.animate = function() {
        if (this.direction !== 0) {
            if (this.car.position.getDistance(this.destination) < this.dOffset) {
                this.car.position = this.destination;
                this.stop();
            }

            this.offset = this.offset + (this.direction * this.dOffset);
            var pt = this.path.getPointAt(this.offset);

            if (pt !== null) {
                // move it babe
                this.car.position = pt;
            } else {
                this.stop();
            }
        }
    };

    var Track = function(opts) {
        opts = _.defaults(opts, {
            name: 'red',
            color: 'red',
            opacity: 0.5,
            y: yOffset,
            x: xOffset,
            width: 5
        });

        this.name = opts.name;

        this.start = new paper.Point(opts.x, opts.y);

        this.path = new paper.Path();
        this.path.strokeColor = opts.color; // change this later
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
        if (this.stations.length > 0) {
            var station = _.max(this.stations, function(station) {
                return station.time;
            });

            this.addPoint(new paper.Point(station.point.x + (station.duration * timeLength), this.start.y));
        }
    };

    Track.prototype.addEnd = function(time) {
        this.realign();

        var x = xOffset + (timeLength * time);
        var y = this.last.y;

        this.timeSpan = time;

        this.addPoint(new paper.Point(x, y));
    };

    Track.prototype.setTime = function(x) {
        var point = this.getPoint(x);

        if (point) {
            this.car.teleport(point);
        }
    };

    Track.prototype.goTime = function(x) {
        var point = this.getPoint(x);

        if (point) {
            this.car.goTo(point);
        }
    };

    Track.prototype.getPoint = function(x) {
        var line = new paper.Path();
        line.add(new paper.Point(x, 0));
        line.add(new paper.Point(x, 1000));
        line.visible = false;

        var intersect = this.path.getIntersections(line);

        // TODO: round towards stations

        if (intersect.length  == 1) {
            return intersect[0].point;
        } else {
            // do we need to handle this?
            console.log(intersect);
        }
    };

    Track.prototype.makeCar = function(opts) {
        this.car = new Car(this.path, opts);
    };

    var Station = function(opts) {
        opts = _.defaults(opts, {
            tracks: [],
            time: 0,
            name: 'Some Event',
            duration: 2,
            colors: {
                normal: 'orange',
                hover: 'purple'
            },
            label: {},
        });

        this.tracks = opts.tracks;
        this.time = opts.time;
        this.name = opts.name;
        this.duration = opts.duration;
        this.colors = opts.colors;

        this.labeling = _.defaults(opts.label, {
            xOffset: 5,
            yOffset: 10,
            fontSize: 15,
            width: 100,
            height: 10
        });

        var lTest = this.drawLabel(new paper.Point(0, 0));
        this.labeling.width = lTest.bounds.width;
        this.labeling.height = lTest.bounds.height;
        lTest.remove();
    };

    Station.prototype.setPoint = function() {
        // determine the point for this event
        var y;
        if (this.tracks.length > 1) {
            y = _.reduce(_.map(this.tracks, function(track) {
                return track.start.y;
            }), function(sum, y) {
                return sum + y;
            }, 0)/_.size(this.tracks);
        } else {
            y = _.first(this.tracks).start.y;
        }

        var t = this.time;

        var x = xOffset + (t * timeLength);

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
            track.car.goTo(self.getPoint());
        });

        // we could move others if we wanted to...

        // var oTracks = _.values(tracks);
        // oTracks = _.difference(oTracks, this.tracks);

        // _.each(oTracks, function(track) {
        //     track.setTime(self.getPoint().x);
        // });
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

        //     path.add(point.add([self.duration * timeLength, 0]));
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
        var lPoint = point.add([this.labeling.xOffset, this.labeling.yOffset]);
        if (this.testDraw(lPoint)) {
            // okay, bottom right works
            lPoint = lPoint.add([0, this.labeling.yOffset]);
        } else {
            lPoint = point.add([this.labeling.xOffset, -1 * (this.labeling.yOffset + this.labeling.height)]);
            if (this.testDraw(lPoint)) {
                // okay, top right works
                lPoint = lPoint.add([0, this.labeling.height]);
            } else {
                lPoint = point.add([-1 * (this.labeling.width + (1 * this.labeling.xOffset)), -1 * (this.labeling.yOffset + this.labeling.height)]);
                if (this.testDraw(lPoint)) {
                    // okay, top left works
                    lPoint = lPoint.add([0, this.labeling.height]);
                } else {
                    lPoint = point.add([-1 * (this.labeling.width + (this.labeling.xOffset)), (this.labeling.yOffset)]);
                    if (this.testDraw(lPoint)) {
                        // okay, bottom left works
                        lPoint = lPoint.add([0, this.labeling.yOffset]);
                    } else {
                        // back to basics (bottom right)
                        lPoint = point.add([this.labeling.xOffset, this.labeling.yOffset * 2]);
                    }
                }
            }
        }

        var rect = new paper.Path.Rectangle(lPoint.add([0, -1 * this.labeling.height]), new paper.Size(this.labeling.width, this.labeling.height));
        rect.strokeColor = 'black';
        rect.visible = false;

        this.label = this.drawLabel(lPoint);
    };

    Station.prototype.drawLabel = function(point) {
        return new paper.PointText({
            point: point,
            content: this.name,
            fillColor: 'black',
            fontFamily: 'Courier New',
            fontWeight: 'bold',
            fontSize: this.labeling.fontSize
        });
    };

    Station.prototype.testDraw = function(point) {
        var layer = paper.project.activeLayer;
        var paths = layer.children;

        var rect = new paper.Path.Rectangle(point, new paper.Size(this.labeling.width, this.labeling.height));
        rect.strokeColor = 'black';
        // rect.visible = false;

        var noConflict = _.every(paths, function(path) {
            if (!path.equals(rect) && path.getIntersections !== undefined) {
                var intersect = path.getIntersections(rect);
                if (intersect.length > 0) {
                    return false;
                }
            }
            return true;
        });

        // delete the rectangle
        rect.remove();

        return noConflict;
    };

    Station.prototype.direct = function() {
        var station = this;

        _.each(this.tracks, function(track) {
            track.addStation(station);
            oTracks = _.omit(oTracks, track);
        });

        var oTracks = _.values(tracks);
        oTracks = _.difference(oTracks, this.tracks);

        _.each(oTracks, function(track) {
            if (track.last.y === station.getPoint().y) {
                console.log(station, station.getPoint().y, track.last.y);
                track.realign();
            }
        });
    };

    function Timeline(opts, start, end) {
        var self = this;

        _.defaults(opts, {
            xOffset: 100,
            yOffset: 50,
            color: 'black',
            opacity: 0.5,
            timeSize: 10,
            width: 10
        });

        this.start = start;
        this.end = end;

        this.xOffset = opts.xOffset;
        this.yOffset = opts.yOffset;
        this.timeSize = opts.timeSize;
        this.timeLength = this.convertTime(end);


        this.path = new paper.Path();
        this.path.strokeColor = opts.color;
        this.path.strokeWidth = opts.width;
        this.path.opacity = opts.opacity;

        this.path.add(this.getPoint(start));
        this.path.add(this.getPoint(end));

        this.path.onClick = function(event) {
            self.click(event);
        };
    }

    Timeline.prototype.drag = function(event) {
        var point = this.path.getNearestPoint(event.point);

        this.car.teleport(point);

        _.each(tracks, function(track) {
            track.setTime(point.x);
        });
    };

    Timeline.prototype.click = function(event) {
        var point = this.path.getNearestPoint(event.point);

        _.each(tracks, function(track) {
            track.goTime(point.x);
        });

        this.car.goTo(point);
    };

    Timeline.prototype.convertTime = function(time) {
        var firstDate = new Date(this.start.getTime());
        var secondDate = new Date(time.getTime());

        var fm = firstDate.getMonth();
        var fy = firstDate.getFullYear();
        var sm = secondDate.getMonth();
        var sy = secondDate.getFullYear();
        var months = Math.abs(((fy - sy) * 12) + fm - sm);
        var firstBefore = firstDate > secondDate;
        firstDate.setFullYear(sy);
        firstDate.setMonth(sm);
        firstBefore ? firstDate < secondDate ? months-- : 0 : secondDate < firstDate ? months-- : 0;

        // transform months
        if (months < 60) {
            if (months < 10) {
                months = months;
            } else {
                months = months / 2 + 5;
            }
        } else {
            months = (months - 60)*3 + 30;
        }

        return months;
    };

    Timeline.prototype.getPoint = function(date) {
        var time = this.convertTime(date);

        var point = new paper.Point(xOffset + (time * this.timeSize), this.yOffset);

        return point;
    };

    Timeline.prototype.makeCar = function(opts) {
        var self = this;
        this.car = new Car(this.path, opts);

        this.car.car.onMouseDrag = function(event) {
            self.drag(event);
        };
    };

    var init = function() {
        var $scopes = $('.lifemap .scopes');
        var $items = $('.lifemap .items');

        $scopes.hide();
        $items.hide();

        canvas = document.getElementById('myLifemap');

        paper.setup(canvas);

        var i = 0;
        $scopes.children().each(function(i, scope) {
            var $scope = $(scope);
            var name = $scope.data('scope-name');
            var color = $scope.data('scope-color');

            tracks[name] = new Track({
                name: name,
                color: color,
                y: yOffset + (i*yOffset)
            });

            i++;
        });

        var start = new Date('January 14, 2007');
        var end = new Date();

        var stations = [];

        var timeline = new Timeline({
            xOffset: xOffset,
            yOffset: 50
        }, start, end);

        $items.children().each(function(i, item) {
            var $item = $(item);
            var sTracks = [];
            var time = new Date($item.data('start')*1000);
            var name = $('h3', item).text();

            _.each($item.data('life-scopes').split(' '), function(track) {
                sTracks.push(tracks[track]);
            });

            stations.push(new Station({
                tracks: sTracks,
                name: name,
                time: timeline.convertTime(time)
            }));
        });

        // sort our stations
        stations = _.sortBy(stations, function(station) {
            return station.time;
        });

        _.each(stations, function(station) {
            station.direct();
        });

        _.each(tracks, function(track) {
            // they all need to end at the same place
            track.addEnd(timeline.convertTime(end));

            track.makeCar({
                speed: 50
            });
        });

        timeline.makeCar({
            speed: 50,
            size: 20
        });

        _.each(stations.reverse(), function(station) {
            station.draw();
        });

        paper.view.onFrame = onFrame;

        // Draw the view now:
        paper.view.draw();

    };

    $(init);
}(jQuery));