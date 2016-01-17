
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
    .x(function(l) { return globe_projection([l.Lon3, l.Lat3])[0]; } )
    .y(function(l) { return globe_projection([l.Lon3, l.Lat3])[1]; })
    .interpolate("cardinal");

var svg = d3
    .select('#map')
    .append('svg')
    .attr('id', 'svg_map')
    .attr('width', WIDTH)
    .attr('height', HEIGHT);

svg.append('defs')
    .append('path')
    .datum({ type: 'Sphere' })
    .attr('id', 'sphere')
    .attr('d', path);

var map = svg.append("g").attr('id', 'map_group');

var tip = d3
    .tip()
    .attr('class', 'tip')
    .html(function(d) {
        return "<span>" + d.name + "</span>";
    });

svg.call(tip);

var cross = svg.append("g").attr('id', 'cross_icon');
var ship  = svg.append("g").attr('id', 'ship_icon');

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
    countries = topojson.feature(world, world.objects.countries).features;

    voyage = [];
    logs.forEach(function (l) {
        if (!(isNaN(l.Lat3) || isNaN(l.Lon3))) {
            voyage.push({ Lon3: l.Lon3, Lat3: l.Lat3});
        }
    });

    globe_projection.rotate([-voyage[0].Lon3, -voyage[0].Lat3]);
    initIcons();
    prepareCountries();
    drawGlobe();
    initVoyage();

    animate();
}

function animate () {
    // find Iceland
    var iceland = findCountry('Iceland');
    var num_pos = voyage.length;
    var counter = 0;

    (function transition() {
    d3.transition()
        .duration(VELOCITY)
        .each("start", function() {
        })
        .tween("rotate", function() {
            var p = [voyage[counter].Lon3, voyage[counter].Lat3];
            var r = d3.interpolate(globe_projection.rotate(), [-p[0], -p[1]]);
            return function(t) {
                globe_projection.rotate(r(t));
                updateGlobe(p);
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

function updateGlobe(p) {
    var end_pos = globe_projection([voyage[voyage.length - 1].Lon3, 
                                    voyage[voyage.length - 1].Lat3]);
    p = globe_projection(p);

    map.select('.voyage')
       .attr('d', lineFn(voyage));
    map.selectAll('.countries').attr('d', path);

    ship.select('svg')
        .transition()
        .duration(VELOCITY)
        .attr("x", p[0] - 24)
        .attr("y", p[1] - 24);

    cross.select('#Layer_1')
         .attr("x", end_pos[0] - 6)
         .attr("y", end_pos[1] - 6);
}

function initIcons() {
    var start_pos = globe_projection([voyage[0].Lon3, 
                                      voyage[0].Lat3]);
    var end_pos = globe_projection([voyage[voyage.length - 1].Lon3, 
                                    voyage[voyage.length - 1].Lat3]);
    
    d3.xml("/images/cross.svg", "image/svg+xml", function(error, xml) {
        if (error) throw error;
        document.getElementById("cross_icon").appendChild(xml.documentElement);

        cross.select('#Layer_1')
             .attr("width", 12)
             .attr("height", 12)   
             .attr("fill", "#66666")
             .attr("x", end_pos[0] - 6)
             .attr("y", end_pos[1] - 6);
    });

    d3.xml("/images/ship.svg", "image/svg+xml", function(error, xml) {
        if (error) throw error;
        document.getElementById("ship_icon").appendChild(xml.documentElement);

        ship.select('svg')
            .attr("width", 48)
            .attr("height", 48)
            .attr("fill", "#333333")
            .attr("x", start_pos[0] - 24)
            .attr("y", start_pos[1] - 24);
    });
}

function initVoyage() {
    var voyage_line = lineFn(voyage);

    map.append("path")
        .attr("class", "voyage")        
        .attr("stroke", "#666666")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4,4")
        .attr("fill", "none")
        .attr("d", voyage_line);    
}

function drawGlobe() {
    // draw countries
    map.selectAll('countries')
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
    map.insert('path')
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
