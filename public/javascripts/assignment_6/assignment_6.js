
/**
 *  inspiration drawn from:
 *      http://bl.ocks.org/mbostock/4183330
 *  and
 *      http://bl.ocks.org/mbostock/4282586
 *
 *  Data from
 *      https://github.com/mbostock/topojson/tree/master/examples
 */

var world,
    WIDTH = 720,
    HEIGHT = 700,
    velocity = .01,
    then = Date.now();

var projection = d3.geo.orthographic()
    .translate([WIDTH / 2, HEIGHT / 2])
    .scale(WIDTH / 2 - 20)
    .clipAngle(90)
    .precision(0.6);

var canvas = d3
    .select("#map")
    .append("canvas")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

var path = d3
    .geo.path()
    .projection(projection);

d3.json("/javascripts/assignment_6/data/world-50m.json", function(countries) {
    world = countries;
    init();
});

function init () {
    var globe = {type: "Sphere"},
        land = topojson.feature(world, world.objects.land),
        countries = topojson.feature(world, world.objects.countries).features,
        borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; });

    d3.timer(function() {
        var angle = velocity * (Date.now() - then);
        var context = canvas.node().getContext("2d");
        projection.rotate(angle);
        context.clearRect(0, 0, WIDTH, HEIGHT);
        context.beginPath();
        path.context(context)(land);
        context.fill();
        context.beginPath();
        path(globe);
        context.stroke();
    });
}
