var SanFranMap = function (id) {
    var map_data,
        crime_data,
        width = 600, 
        height = 600;

    d3.json('/javascripts/assignment_4/data/san_fran.geojson', function (d1) {
        map_data = d1;
        d3.json('/javascripts/assignment_4/data/sf_crime.geojson', function (d2) {
            crime_data = d2;
            init();
        });
    });

    function init() {
        var svg = d3.select(id)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'svg-centered');

        var projection = d3.geo.mercator()
            .scale(1)
            .translate([0, 0])
            .precision(0);

        var map_path = d3.geo.path().projection(projection);
        var map_bounds = map_path.bounds(map_data);

        var crime_path = d3.geo.path().projection(projection);
        var crime_bounds = crime_path.bounds(map_data);

        var xScale = width / Math.abs(map_bounds[1][0] - map_bounds[0][0]);
        var yScale = height / Math.abs(map_bounds[1][1] - map_bounds[0][1]);
        var scale = xScale < yScale ? xScale : yScale;

        var transl = [
            (width - scale * (map_bounds[1][0] + map_bounds[0][0])) / 2, 
            (height - scale * (map_bounds[1][1] + map_bounds[0][1])) / 2
        ];

        projection.scale(scale).translate(transl);
        
        svg.selectAll('path')
            .data(map_data.features)
            .enter()
            .append('path')
            .attr('d', map_path)
            .attr('data-id', function(d) {
                return d.id;
            })
            .attr('data-name', function(d) {
                return d.properties.name;
            })
            .style('fill', '#c0362c')
            .style('stroke', '#ffffff');
        svg.selectAll('path')
            .data(crime_data.features)
            .enter()
            .append('path')
            .attr('d', crime_path)
            .attr('data-id', function(d) {
                return d.id;
            })
            .attr('data-name', function(d) {
                return d.properties.name;
            })
            .style('fill', '#0066ff')
            .style('stroke', '#ffffff');
    };
};