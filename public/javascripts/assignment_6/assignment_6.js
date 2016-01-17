
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
    voyage,
    WIDTH       = 720,
    HEIGHT      = 700,
    VELOCITY    = 200,
    THEN        = Date.now();

var globe_projection = d3.geo.orthographic()
    .translate([WIDTH / 2, HEIGHT / 2])
    .rotate([0,0])
    .scale(WIDTH / 2 - 20)
    .clipAngle(90)
    .precision(0.1);

var path = d3
    .geo.path()
    .projection(globe_projection);

var lineFn = d3.svg.line()
    .x(function(l) { return globe_projection([l.lon, l.lat, 0])[0]; } )
    .y(function(l) { return globe_projection([l.lon, l.lat, 0])[1]; })
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
    voyage = [];
    globe = { type: "Sphere" };
    land = topojson.feature(world, world.objects.land);
    countries = topojson.feature(world, world.objects.countries).features;
    borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; });

    logs.forEach(function (l) {
        if (!(isNaN(l.Lat3) || isNaN(l.Lon3))) {
            voyage.push({
                lon: l.Lon3,
                lat: l.Lat3
            });
        }
    });

    slider = Slider('#slider', [new Date('2012-01-02'), new Date('2013-01-01')]);
    slider.setDate(new Date('2012-03-20'));

    globe_projection.rotate([-voyage[0].lon, -voyage[0].lat]);

    prepareCountries();
    drawGlobe();
    initVoyage();

    animate();
}

function animate () {
    var num_pos = voyage.length;
    var counter = 0;

    (function transition() {
    d3.transition()
        .duration(VELOCITY)
        .each("start", function() {
        })
        .tween("rotate", function() {
            var p = [voyage[counter].lon, voyage[counter].lat];
            var r = d3.interpolate(globe_projection.rotate(), [-p[0], -p[1]]);
            return function(t) {
                globe_projection.rotate(r(t));
                updateGlobe();
            };
        })
        .transition()
        .each("end", function () {
            counter++;
            if (counter >= num_pos) {
                counter = 0;
            }
            return transition();
        });
    })();
}

function updateGlobe() {

    svg.select('.voyage')
       .attr('d', lineFn(voyage));
    svg.selectAll('.countries').attr('d', path);
}

function initVoyage() {
    var voyage_line = lineFn(voyage);

    svg.append("path")
        .attr("class", "voyage")
        .attr("stroke", "#000000")
        .attr("stroke-opacity", 0.5)
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4,4")
        .attr("fill", "none")
        .attr("d", voyage_line);
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
