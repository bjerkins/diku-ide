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
    num_logs,
    globe,
    countries,
    voyage,
    timeline,
    timer_running = false,
    counter       = 1, // Should be 0 if NOT paused on load
    paused        = true,
    WIDTH         = 420,
    HEIGHT        = 400,
    VELOCITY      = 500,
    TIME_STEP     = 1500, // This must NOT be smaller than VELOCITY
    SHIP_SIZE     = 48,
    CROSS_SIZE    = 12;

var datasets = new Array();
datasets.push({text: 'J. Cook. Rio de Janeiro', src:'/javascripts/assignment_6/data/james_cook.csv'});
datasets.push({text: 'J. Hamilton. WAR!', src:'/javascripts/assignment_6/data/sir_john_hamilton.csv'});
datasets.push({text: 'J. Arkenbout. Copenhagen', src:'/javascripts/assignment_6/data/jacobus_arkenbout.csv'});
datasets.push({text: 'A. Dams. Bengal', src:'/javascripts/assignment_6/data/arie_dams.csv'});


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
        return "" + t + "";
    });

svg.call(tip);

var cross = svg.append("g").attr('id', 'cross_icon');
var ship  = svg.append("g").attr('id', 'ship_icon');
var circle;

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
         // Note: because the decrease in the size of the svg above,
         //       every size below is 0.5 of the value given
         .append("rect")
         .attr("width", 24)
         .attr("height", 24)
         .attr("fill", "#FFF")
         .attr("fill-opacity", "0")
         .attr("style", "cursor:pointer;");

    ship.node().appendChild(ship_xml.documentElement);

    circle = map.append('circle')
        .attr('fill', '#FFF')
        .attr('fill-opacity', '0')
        .attr("stroke", "#666666")
        .attr("stroke-width", 2)
        .attr("cy", -10000)
        .attr("cx", -10000)
        .attr('r', 6);

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
                     .attr('id', 'voyage-select')
                     .on('change', changeVoyage);
    var test = datasets;

    var options = dropdown.selectAll('option')
            .data(datasets)
            .enter()
            .append('option')
            .text(function(d) { return d.text; });

    function changeVoyage() {
        var select_index = dropdown.property('selectedIndex'),
            select_option = options.filter(function (d, i) { return i === select_index; }),
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
    num_logs  = voyage.length;
    range = voyageDateRange(voyage);

    globe_projection.rotate([-voyage[0].lon, -voyage[0].lat]);
    updateGlobe([voyage[0].lon, voyage[0].lat]);

    showWelcomeMessage();
    setupIcons();

    // create the timeline, and show the first 4 logs
    timeline = Timeline('#timeline', voyage, handleTimelineClick);
    timeline.draw(0);

    draw_step(0);
}

function setupIcons() {
    var last_log = voyage[voyage.length - 1];
    var start_pos = globe_projection([voyage[0].lon,
                                      voyage[0].lat]);

    cross.select("rect")
         .on('mousemove', function () {
            if (last_log.dest !== '')
                tip.show(last_log.dest);
         })
         .on('mouseout', function () {
            if (last_log.dest !== '')
                tip.hide();
         });

    circle.on('mousemove', function () {
            if (last_log.orig !== '')
                tip.show(last_log.orig);
          })
          .on('mouseout', function () {
            if (last_log.orig !== '')
                tip.hide();
          });

    ship.select('svg')
        .attr("x", start_pos[0] - SHIP_SIZE/2)
        .attr("y", start_pos[1] - SHIP_SIZE/2);

    positionIcons(start_pos);
    showBattle(voyage[0]);
}

function animate() {
    timer_running = false;

    if (!paused) {
        draw_step(counter);

        counter++;
        if (counter >= num_logs) {
          counter = 0;
        }

        setTimeout(animate, TIME_STEP);
        timer_running = true;
    }
}

function draw_step(index) {
    showBattle(voyage[index]);
    generateInfoHTML(voyage[index]);
    timeline.draw(index);
    rotate_globe(index);
}

function rotate_globe(index) {
    (function transition() {
        d3.transition()
            .duration(VELOCITY)
            .each("start", function() {})
            .tween("rotate", function() {
                var p = [voyage[index].lon, voyage[index].lat];
                var r = d3.interpolate(globe_projection.rotate(), [-p[0], -p[1]]);
                var date = voyage[index].date;
                return function(t) {
                    globe_projection.rotate(r(t));
                    updateGlobe(p);
                };
            })
            .transition()
            .each("end", function () {});
    })();
}

function updateGlobe(p) {
    p = globe_projection(p);

    map.select('.voyage')
       .attr('d', lineFn(voyage));

    map.selectAll('.countries').attr('d', path);

    positionIcons(p);
}

function positionIcons(p) {
    var start_pos = globe_projection([voyage[0].lon,
                                      voyage[0].lat]);
    var end_pos = globe_projection([voyage[voyage.length - 1].lon,
                                    voyage[voyage.length - 1].lat]);
    ship.select('svg')
        .transition()
        .duration(VELOCITY)
        .attr("x", p[0] - SHIP_SIZE/2)
        .attr("y", p[1] - SHIP_SIZE/2);

    cross.select('svg')
         .attr("x", end_pos[0] - CROSS_SIZE/2)
         .attr("y", end_pos[1] - CROSS_SIZE/2);

    circle.attr("cx", start_pos[0])
          .attr("cy", start_pos[1]);
}


function showWelcomeMessage() {
    d3.select('#message_board p.welcome')
      .html('Ahoy Captain <span class="captain_txt">' +
            voyage[0].captain + '</span> and ' +
            'welcome aboard your ship, the <span class="ship_txt">' +
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
            d3.select(this).attr('fill', '#666666');
            tip.show(d.name);
        })
        .on('mouseout', function (d) {
            d3.select(this).attr('fill', '#ccc');
            tip.hide();
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
            if (!paused && !timer_running) { animate() };
        });
}

function handleTimelineClick(d, i) {
    counter = i;
    draw_step(i);
}

function showBattle(log) {
    if (log.battle) {
        ship.select('svg').select('g').attr('fill', '#801515');
    } else {
        ship.select('svg').select('g').attr('fill', '#333333');
    }
}

function generateInfoHTML (log) {
  var html =  '';
  if (log.dest != '') {
    html += '<dt>Destination</dt>' +
            '<dd>' + log.dest + '</dd>';
  } else {
    html += '<dt>Destination</dt>' +
            '<dd class="unimportant">' + 'No reported destination' + '</dd>';
  }
  html += '<dt>Departure</dt>' +
          '<dd>' + formatDate(log.initial_date) + '</dd>' +
          '<dt>Arrival</dt>' +
          '<dd>' + formatDate(getLastDate(voyage)) + '</dd>';
  if (log.weather != '') {
    html += '<dt>Weather description</dt>' +
            '<dd>' + log.weather + '</dd>' ;
  } else {
    html += '<dt>Weather description</dt>' +
            '<dd class="unimportant">' + 'No weather description available' + '</dd>' ;
  }
    
  if (log.battle_desc != '') {
      html += '<dt>Battle Log</dt>' +
              '<dd>' + log.battle_desc + '</dd>';
  } else {
       html += '<dt>Battle Log</dt>' +
              '<dd class="unimportant">' + 'No reported battles' + '</dd>';
  }

  if (log.shipmemo != '') {
      html += '<dt>Ship Log</dt>' +
              '<dd>' + log.shipmemo + '</dd>';  
  } else {
      html += '<dt>Ship Log</dt>' +
              '<dd class="unimportant">' + 'No log available' + '</dd>';  
  }  
  d3.select('#information').html(html);
  
}
