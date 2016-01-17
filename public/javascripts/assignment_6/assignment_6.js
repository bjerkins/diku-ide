
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
    logs,
    globe,
    countries,
    borders,
    voyage,
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

var lineFn = d3.svg.line()
    .x(function(l) { return globe_projection([l.Lon3, l.Lat3])[0]; } )
    .y(function(l) { return globe_projection([l.Lon3, l.Lat3])[1]; })
    .interpolate("cardinal");

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
    .defer(d3.csv, '/javascripts/assignment_6/data/james_cook.csv')
    .await(ready);

function ready (error, w, n, l) {
    world = w;
    names = n;
    logs = l;
    init();
}

function init () {
    globe = {type: "Sphere"};
    land = topojson.feature(world, world.objects.land);
    countries = topojson.feature(world, world.objects.countries).features;
    borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; });

    initVoyage();
    prepareCountries();
    drawGlobe();
    animate();
}

function animate () {
    // find Iceland
    var iceland = findCountry('Iceland');
    d3.timer(function() {
        var angle = VELOCITY * (Date.now() - THEN);
        moveGlobe([angle]);
        updateGlobe();
    });
}

function initVoyage() {
    voyage = [];
    logs.forEach(function (l) {
        if (!(isNaN(l.Lat3) || isNaN(l.Lon3))) {
            voyage.push({ Lon3: l.Lon3, Lat3: l.Lat3});
        }
    });

    svg.append("path")
        .attr("class", "voyage")        
        .attr("stroke", "#000000")
        .attr("stroke-opacity", 0.5)
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4,4")
        .attr("fill", "none")
        .attr("d", lineFn(voyage));
}

function testPoints() {

    // svg.selectAll('circle')
    //    .data(logs)
    //    .enter()
    //    .append('circle')
    //    .attr('r', 5)
    //    .attr("transform", function(l) {
    //         return "translate(" + globe_projection([
    //           l.Lon3,
    //           l.Lat3
    //         ]) + ")";
    //       })
    //    .attr("fill", "black")
}

function updateGlobe() {
    svg.select('.land')
       .attr('d', path);

    svg.select('.border')
       .attr('d', path);

    svg.select('.voyage')
       .attr('d', lineFn(voyage));
}

function drawGlobe() {
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

function moveGlobe(position) {
    globe_projection.rotate(position);
    path = d3.geo.path()
             .projection(globe_projection);
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
