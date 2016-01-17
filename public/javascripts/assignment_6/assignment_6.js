
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

var path = d3
    .geo.path()
    .projection(globe_projection);

var svg = d3
    .select('#map')
    .append('svg')
    .attr('width', WIDTH)
    .attr('height', HEIGHT);

svg.append('defs')
    .append('path')
    .datum({ type: 'Sphere' })
    .attr('id', 'sphere')
    .attr('d', path);

queue()
    .defer(d3.json, '/javascripts/assignment_6/data/world-110m.json')
    .defer(d3.tsv, '/javascripts/assignment_6/data/world-country-names.tsv')
    .await(ready);

function ready (error, w, n) {
    world = w;
    names = n;
    init();
}

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
        moveGlobe([angle]);
        drawCountries();
    });
}

function moveGlobe(position) {
    globe_projection.rotate(position);
}

function drawCountries() {

    // todo, remove everything first

    svg.insert('path')
      .datum(land)
      .attr('class', 'land')
      .attr('fill', '#ccc')
      .attr('d', path);

    svg.insert('path')
      .datum(borders)
      .attr('class', 'border')
      .attr('stroke', '#fff')
      .attr('fill', 'none')
      .attr('d', path);

    svg.insert('path')
        .datum(globe)
        .attr('class', 'globe')
        .attr('stroke', '#000')
        .attr('fill', 'none')
        .attr('d', path);
}

function clearSVG () {

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
