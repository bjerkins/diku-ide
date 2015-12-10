// script for assignment four

var data;


d3.json('/javascripts/assignment_four/san_fran.geojson', function (d) {
    data = d;
    init();
});

function init() {
    var width = 600, 
        height = 600;

    var svg = d3.select('#map1')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    var projection = d3.geo.mercator()
        .scale(1)
        .translate([0, 0])
        .precision(0);

    var path = d3.geo.path().projection(projection);
    var bounds = path.bounds(data);

    var xScale = width / Math.abs(bounds[1][0] - bounds[0][0]);
    var yScale = height / Math.abs(bounds[1][1] - bounds[0][1]);
    var scale = xScale < yScale ? xScale : yScale;

    var transl = [(width - scale * (bounds[1][0] + bounds[0][0])) / 2, (height - scale * (bounds[1][1] + bounds[0][1])) / 2];
    projection.scale(scale).translate(transl);

    svg.selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('data-id', function(d) {
            return d.id;
        })
        .attr('data-name', function(d) {
            return d.properties.name;
        })
        .style('fill', '#FB5B1F')
        .style('stroke', '#ffffff');
};