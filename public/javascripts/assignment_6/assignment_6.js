
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
    names,
    globe,
    countries,
    borders,
    WIDTH       = 720,
    HEIGHT      = 700,
    VELOCITY    = .005,
    THEN        = Date.now();

var globe_projection = d3.geo.orthographic()
    .translate([WIDTH / 2, HEIGHT / 2])
    .scale(WIDTH / 2 - 20)
    .clipAngle(90)
    .precision(0.1);

var canvas = d3
    .select("#map")
    .append("canvas")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

var context = canvas.node().getContext('2d');

var path = d3
    .geo.path()
    .projection(globe_projection)
    .context(context);


d3.json('/javascripts/assignment_6/data/world-110m.json', function(w) {
    world = w;
    d3.tsv('/javascripts/assignment_6/data/world-country-names.tsv', function (n) {
        names = n;
        init();
    });
});

function init () {
    globe = {type: "Sphere"};
    land = topojson.feature(world, world.objects.land);
    countries = topojson.feature(world, world.objects.countries).features;
    borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; });

    prepareCountries();
    animate();
}

function animate () {
    // find Iceland
    var iceland = findCountry('Iceland');

    d3.timer(function() {
        var angle = VELOCITY * (Date.now() - THEN);
        moveGlobe(angle);
        drawCountries();
        drawCountry(iceland);
    });
}

function moveGlobe(angle) {
    globe_projection.rotate([angle]);
}

function drawCountries() {
    // clear what was drawn before
    context.clearRect(0, 0, WIDTH, HEIGHT);
    // draw the land
    context.fillStyle = "#ccc"; context.beginPath(); path(land); context.fill();
    // draw the globe
    context.strokeStyle = "#000"; context.lineWidth = 2; context.beginPath(); path(globe); context.stroke();
    // draw the countries' borders
    context.strokeStyle = "#fff"; context.lineWidth = 0.5; context.beginPath(); path(borders); context.stroke();
}

// use this if you want to draw a country in some special way
function drawCountry (country) {
    context.fillStyle = "#b000b5"; context.beginPath(); path(country); context.fill();
}

function prepareCountries () {
    countries = countries.filter(function(d) {
        return names.some(function(n) {
            if (d.id == n.id) return d.name = n.name;
        });
    }).sort(function(a, b) {
        return a.name.localeCompare(b.name);
    });
}

function findCountry (name) {
    return countries.find(function (country) {
        return country.name === name;
    });
}
