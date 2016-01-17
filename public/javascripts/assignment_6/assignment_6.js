
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
    slider,
    WIDTH       = 720,
    HEIGHT      = 700,
    VELOCITY    = 0.005,
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

var tip = d3
    .tip()
    .attr('class', 'tip')
    .html(function(d) {
        return "<span>" + d.name + "</span>";
    });

svg.call(tip);

// request files

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
    globe = { type: "Sphere" };
    land = topojson.feature(world, world.objects.land);
    countries = topojson.feature(world, world.objects.countries).features;
    borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; });

    slider = Slider('#slider', [new Date('2012-01-02'), new Date('2013-01-01')]);
    slider.setDate(new Date('2012-03-20'));

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
        //testPoints();
    });
}

function testPoints() {
    var lineFn = d3.svg.line()
        .x(function(d) { return globe_projection([l.Lon3, l.Lat3]); })
        .y(function(d) { return globe_projection(d[1]); })
        .interpolate("cardinal");

    svg.selectAll('circle')
       .data(logs)
       .enter()
       .append('circle')
       .attr('r', 5)
       .attr("transform", function(l) {
            return "translate(" + globe_projection([
              l.Lon3,
              l.Lat3
            ]) + ")";
          })
       .attr("fill", "black");
}

function updateGlobe() {
    svg.selectAll('.countries').attr('d', path);
}

function drawGlobe() {

    // draw countries
    svg.selectAll('countries')
        .data(countries)
        .enter()
        .insert('path')
        .attr('fill', '#ccc')
        .attr('stroke', '#fff')
        .attr('class', 'countries')
        .on('mouseover', function (d) {
            d3.select(this).attr('fill', '#b000b5');
            tip.show(d);
        })
        .on('mouseout', function (d) {
            d3.select(this).attr('fill', '#ccc');
            tip.hide(d);
        })
        .attr('d', path);

    // draw the outline of the globe
    svg.insert('path')
        .datum(globe)
        .attr('class', 'globe')
        .attr('stroke', '#000')
        .attr('fill', 'none')
        .attr('d', path);
}

function moveGlobe(position) {
    globe_projection.rotate(position);
    path = d3.geo.path().projection(globe_projection);
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
