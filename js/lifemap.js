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
        }
    ];
    var xOffset = 100;
    var yOffset = 100;
    var yearLength = 10;


    var makeCar = function(path) {
        var segments = path.segments;
        var target = path.firstSegment;

        var size = new paper.Size(10, 10);

        var car = new paper.Path.Rectangle(target.point, size);

        car.strokeColor = 'black';

        var speed = 2;
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

    var init = function() {
        // hide the lifemap
        $('.lifemap').hide();

        canvas = document.getElementById('myLifemap');

        paper.setup(canvas);

        events.forEach(function(evt) {

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
                return track.last.y;
            }), function(sum, y) {
                return sum + y;
            }, 0)/_.size(evt.tracks);
            var x = xOffset + (evt.year * yearLength);
            evt.point = new paper.Point(x, y);

            console.log();

            _.each(evt.tracks, function(track) {
                track.addEvent(evt);
            });

            evt.tracks = eventTracks;
        });

        paper.view.onFrame = onFrame;

        // Draw the view now:
        paper.view.draw();

    };

    $(init);
}(jQuery));