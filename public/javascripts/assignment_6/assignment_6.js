
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
    counter     = 0,
    paused      = false,
    WIDTH       = 420,
    HEIGHT      = 400,
    VELOCITY    = 500,
    SHIP_SIZE   = 48,
    CROSS_SIZE  = 12;

var datasets = new Array();
datasets.push({text: 'J. Cook. Rio de Janeiro', src:'/javascripts/assignment_6/data/james_cook.csv'});
datasets.push({text: 'J. Arkenbout. Copenhagen', src:'/javascripts/assignment_6/data/jacobus_arkenbout.csv'});

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
    .y(function(l) { return globe_projection([l.lon, l.lat])[1]; } )
    .interpolate("cardinal");

var svg = d3
    .select('#map')
    .insert('svg', ':first-child')
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
    .defer(d3.xml, '/images/cross.svg', 'image/svg+xml')
    .defer(d3.xml, '/images/ship.svg', 'image/svg+xml')
    .await(ready);


function ready (error, w, n, cross_xml, ship_xml) {
    world = w;
    names = n;

    init();
    initIcons(cross_xml, ship_xml);
}

function init () {
    globe       = { type: "Sphere" };
    countries   = topojson.feature(world, world.objects.countries).features;

    prepareCountries();
    drawGlobe();
    setupControls();

    initDropDown();
    initVoyage();

    queue().defer(d3.csv, datasets[0].src).await(setupVoyage);
}

function initIcons(cross_xml, ship_xml) {
    cross.node().appendChild(cross_xml.documentElement);
    cross.select('svg')
         .attr("width", CROSS_SIZE)
         .attr("height", CROSS_SIZE)
         .attr("y", -10000)
         .attr("x", -10000)
         .attr("fill", "#666666")
         // Add rectangle to increase hitbox
         // Position it at outside svg to show tip above cross
         // Note: because the decrease in the size of the svg above,
         //       every size below is 0.5 of the value given
         .append("rect")
         .attr("width", 24)
         .attr("height", 48)
         .attr("y", -24)
         .attr("fill", "#FFF")
         .attr("fill-opacity", "0")
         .attr("style", "cursor:pointer;");

    ship.node().appendChild(ship_xml.documentElement);

    ship.select('svg')
        .attr("width", SHIP_SIZE)
        .attr("height", SHIP_SIZE)
        .attr("y", -10000)
        .attr("x", -10000)
        .select('g')
        .attr("fill", "#333333");
}

function initVoyage() {
    map.append("path")
        .attr("class", "voyage")
        .attr("stroke", "#666666")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4,4")
        .attr("fill", "none");
}

function initDropDown() {
    var dropdown = d3.select('#dropdown')
                     .append('select')
                     .attr('class', 'form-control')
                     .on('change', changeVoyage);
    var test = datasets;

    var options = dropdown.selectAll('option')
            .data(datasets)
            .enter()
            .append('option')
            .text(function(d) { return d.text; });

    function changeVoyage() {
        var select_index = dropdown.property('selectedIndex'),
            select_option = options.filter(function (d, i) { return i === select_index }),
            data = select_option.datum();

        queue().defer(d3.csv, data.src).await(setupVoyage);
    }
}

function setupVoyage(error, l) {
    var range = [];
    logs      = l;
    voyage    = [];
    counter   = 0;

    prepareVoyage(voyage);
    range = voyageDateRange(voyage);

    if (slider !== undefined) {
        d3.select('#slider svg').remove();
    }
    slider = Slider('#slider', range);
    slider.setDate(voyage[0].date);

    globe_projection.rotate([-voyage[0].lon, -voyage[0].lat]);
    updateGlobe([voyage[0].lon, voyage[0].lat]);

    showWelcomeMessage();
    setupIcons();

    animate();
}

function setupIcons() {
    var last_log = voyage[voyage.length - 1];
    var start_pos = globe_projection([voyage[0].lon,
                                      voyage[0].lat]);
    var end_pos = globe_projection([last_log.lon,
                                    last_log.lat]);

    cross.select("rect")
         .on('mousemove', function () {
             tip.show(last_log.dest);
         })
         .on('mouseout', function () {
             tip.hide(last_log.dest);
         });

    ship.select('svg')
        .attr("x", start_pos[0] - SHIP_SIZE/2)
        .attr("y", start_pos[1] - SHIP_SIZE/2);

    cross.select('svg')
         .attr("x", end_pos[0] - CROSS_SIZE/2)
         .attr("y", end_pos[1] - CROSS_SIZE/2);
}

function animate () {
    var num_pos = voyage.length;

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
                if (!paused) {
                    return transition();
                }
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
        .attr("x", p[0] - SHIP_SIZE/2)
        .attr("y", p[1] - SHIP_SIZE/2);

    cross.select('svg')
         .attr("x", end_pos[0] - CROSS_SIZE/2)
         .attr("y", end_pos[1] - CROSS_SIZE/2);
}

function showWelcomeMessage() {
    d3.select('#message_board p.welcome')
      .html('Ahoy Captain <span class="captain_txt">' + 
            voyage[0].captain + '</span><br />and<br />' +
            'welcome aboard your ship, <br />the <span class="ship_txt">' +
            voyage[0].ship_name);
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

function setupControls() {
    d3.select('#control-toggle')
        .on('click', function () {
            paused = !paused;
            this.className = paused ? 'glyphicon glyphicon-play' : 'glyphicon glyphicon-pause';
            animate();
        });
}
