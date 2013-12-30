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

        // _.each(this.route, function(seg) {
        //     var circle = new paper.Path.Circle(seg.point, 8);
        //     circle.strokeColor = 'red';
        // });

        this.moveTowards(route[0]);
    };

    Car.prototype.moveTowards = function(target) {
        this.target = target;

        steps = this.car.position.getDistance(this.target.point)/this.speed;

        this.dX = (this.target.point.x - this.car.position.x)/steps;
        this.dY = (this.target.point.y - this.car.position.y)/steps;
    };

    Car.prototype.animate = function() {
        if (this.car.position.getDistance(this.target.point) < 6) {
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

        this.addPoint(new paper.Point(x, y));
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

    var compareTime = function(start, end) {
        var firstDate = new Date(start.getTime());
        var secondDate = new Date(end.getTime());

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
        var stations = [];

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
                time: compareTime(start, time)
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
            track.addEnd(compareTime(start, new Date()));

            track.makeCar({
                speed: track.path.length / 200
            });
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