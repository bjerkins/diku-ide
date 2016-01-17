
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
    slider,
    WIDTH       = 420,
    HEIGHT      = 400,
    VELOCITY    = 500,
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
    .x(function(l) { return globe_projection([l.lon, l.lat])[0]; } )
    .y(function(l) { return globe_projection([l.lon, l.lat])[1]; })
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
    .html(function(t) {
        return "<span>" + t + "</span>";
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
    voyage      = [];
    globe       = { type: "Sphere" };
    countries   = topojson.feature(world, world.objects.countries).features;

    var range = [];

    prepareVoyage(voyage);
    range = voyageDateRange(voyage);

    slider = Slider('#slider', range);
    slider.setDate(voyage[0].date);

    globe_projection.rotate([-voyage[0].lon, -voyage[0].lat]);

    initWelcomeMessage();
    initIcons();
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
                var date = voyage[counter].date;
                return function(t) {
                    globe_projection.rotate(r(t));
                    updateGlobe(p);
                    slider.setDate(date);
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
    var end_pos = globe_projection([voyage[voyage.length - 1].lon,
                                    voyage[voyage.length - 1].lat]);
    p = globe_projection(p);

    map.select('.voyage')
       .attr('d', lineFn(voyage));

    map.selectAll('.countries').attr('d', path);

    ship.select('svg')
        .transition()
        .duration(VELOCITY)
        .attr("x", p[0] - 24)
        .attr("y", p[1] - 24);

    cross.select('svg')
         .attr("x", end_pos[0] - 6)
         .attr("y", end_pos[1] - 6);
}

function initWelcomeMessage() {
    d3.select('#message_board')
      .append('p')
      .attr('class', 'welcome')
      .html('Ahoy Captain <span class="captain_txt">' + 
            voyage[0].captain + '</span><br />and<br />' +
            'welcome aboard your ship, <br />the <span class="ship_txt">' +
            voyage[0].ship_name);

}

function initIcons() {
    var last_log = voyage[voyage.length - 1];
    var start_pos = globe_projection([voyage[0].lon,
                                      voyage[0].lat]);
    var end_pos = globe_projection([last_log.lon,
                                    last_log.lat]);

    d3.xml("/images/cross.svg", "image/svg+xml", function(error, xml) {
        if (error) throw error;

        // how about d3.select('#cross_icon') ? (bjarki)
        document.getElementById("cross_icon").appendChild(xml.documentElement);

        cross.select('svg')
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", "#666666")
            .attr("x", end_pos[0] - 6)
            .attr("y", end_pos[1] - 6)
            // Add rectangle to increase hitbox
            // Position it at outside svg to show tip above cross
            // Note: because the decrease in the size of the svg above,
            //       every size below is 0.5 of the value given
            .append("rect")
            .attr("width", 24)
            .attr("height", 56)
            .attr("y", -16)
            .attr("fill", "#FFF")
            .attr("fill-opacity", "0")
            .attr("style", "cursor:pointer;")
            .on('mousemove', function () {
                tip.show(last_log.dest);
            })
            .on('mouseout', function () {
                tip.hide(last_log.dest);
            });
    });

    d3.xml("/images/ship.svg", "image/svg+xml", function(error, xml) {
        if (error) throw error;
        document.getElementById("ship_icon").appendChild(xml.documentElement);

        ship.select('svg')
            .attr("width", 48)
            .attr("height", 48)
            .attr("x", start_pos[0] - 24)
            .attr("y", start_pos[1] - 24);

        ship.select('svg')
            .select('g')
            .attr("fill", "#333333")
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
            tip.show(d.name);
        })
        .on('mouseout', function (d) {
            d3.select(this).attr('fill', '#ccc');
            tip.hide(d.name);
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
