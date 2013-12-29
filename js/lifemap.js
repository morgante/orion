/* lifemap */
(function($) {
    var canvas;
    var animators = [];

    var makeCar = function(path) {
        var segments = path.segments;
        var target = path.firstSegment;

        var size = new paper.Size(10, 10);

        var car = new paper.Path.Rectangle(target.point, size);

        car.strokeColor = 'black';

        var speed = 2;
        var steps = speed;

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

    var init = function() {
        // hide the lifemap
        $('.lifemap').hide();

        canvas = document.getElementById('myLifemap');

        paper.setup(canvas);

        // Move to start and draw a line from there
        var start = new paper.Point(100, 100);
        var path = new paper.Path();
        path.strokeColor = 'black';

        path.add(start);
        path.add(start.add([ 200, 0 ]));
        path.add(start.add([ 200, -50 ]));
        path.add(start.add([ 300, -50 ]));
        path.add(start.add([ 300, 0 ]));

        makeCar(path);

        var start = new paper.Point(100, 300);
        var path = new paper.Path();
        path.strokeColor = 'black';

        path.add(start);
        path.add(start.add([ 100, 0 ]));
        path.add(start.add([ 100, 50 ]));
        path.add(start.add([ 200, 50 ]));
        path.add(start.add([ 200, 0 ]));
        path.add(start.add([ 300, 0 ]));
        path.add(start.add([ 300, 50 ]));

        // path.add(start.add([ 100, 50 ]));

        makeCar(path);

        paper.view.onFrame = onFrame;

        // Draw the view now:
        paper.view.draw();

    };

    $(init);
}(jQuery));