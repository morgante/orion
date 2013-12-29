/* lifemap */
(function($) {
    var canvas;
    var animators = [];
    var tracks = {};
    var events = [
        {
            tracks: ['red'],
            year: 5
        },
        {
            tracks: ['red'],
            year: 6
        },
        {
            tracks: ['blue'],
            year: 9
        },
        {
            tracks: ['blue'],
            year: 10
        },
        {
            tracks: ['green'],
            year: 15
        },
        {
            tracks: ['red', 'blue'],
            year: 35
        },
        {
            tracks: ['blue', 'green'],
            year: 36
        },
        {
            tracks: ['red', 'green'],
            year: 40
        },
        {
            tracks: ['green'],
            year: 55
        },
        {
            tracks: ['red'],
            year: 45
        }
    ];
    var xOffset = 100;
    var yOffset = 100;
    var yearLength = 10;
    var speed = 200;

    var onFrame = function(event) {
        animators.forEach(function(animator) {
            animator();
        });
    };

    var Track = function(name) {
        this.name = name;

        if (_.size(tracks) > 0) {
            var last = _.max(tracks, function(trck) {
                return trck.start.y;
            });

            this.start = last.start.add([0, yOffset]);
        } else {
            this.start = new paper.Point(xOffset, yOffset);
        }

        this.path = new paper.Path();
        this.path.strokeColor = this.name; // change this later
        this.path.strokeWidth = 5;

        this.path.add(this.start);
        this.last = this.start;
    };

    Track.prototype.addEvent = function(event) {
        var point = event.point;

        if (point.y != this.last.y) {
            this.path.add(new paper.Point(point.x, this.last.y));
        }

        this.path.add(point);
        this.last = point;
    };

    Track.prototype.addEnd = function(year) {
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

    var init = function() {
        // hide the lifemap
        $('.lifemap').hide();

        canvas = document.getElementById('myLifemap');

        paper.setup(canvas);

        events.forEach(function(evt) {

            // ensure properness
            if (evt.duration === undefined) {
                evt.duration = 2;
            }

            // build proper event tracks
            var eventTracks = {};

            evt.tracks.forEach(function(trackName) {
                var track = tracks[trackName];

                if (track === undefined) {
                    track = tracks[trackName] = new Track(trackName);
                }

                eventTracks[trackName] = track;
            });

            evt.tracks = eventTracks;

            // determine the point for this event
            var y = _.reduce(_.map(evt.tracks, function(track) {
                return track.start.y;
            }), function(sum, y) {
                return sum + y;
            }, 0)/_.size(evt.tracks);
            var x = xOffset + (evt.year * yearLength);
            evt.point = new paper.Point(x, y);

            _.each(evt.tracks, function(track) {
                track.addEvent(evt);
            });

            evt.tracks = eventTracks;
        });

        _.each(tracks, function(track) {
            // they all need to end at the same place
            track.addEnd(75);

            track.makeCar(track.path.length / speed);
        });

        paper.view.onFrame = onFrame;

        // Draw the view now:
        paper.view.draw();

    };

    $(init);
}(jQuery));