var PCAScatter = {
  draw: function(id, data) {
    var w = 310;
    var h = 360;
    var margin = {top: 20, right: 10, bottom: 20, left: 30};

    var radius = 5;

    var max_x = d3.max(data, function (d) { return d[0] });
    var min_x = d3.min(data, function (d) { return d[0] });
    var max_y = d3.max(data, function (d) { return d[1] });
    var min_y = d3.min(data, function (d) { return d[1] });

    var scale_x = d3.scale.linear()
                    .range([radius, w - radius])
                    .domain([min_x, max_x]);

    var scale_y = d3.scale.linear()
                    .range([radius, h - radius])
                    .domain([max_y, min_y]);

    var chart = d3.select(id)
      .attr("width",  h + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var y_axis = d3.svg.axis()
                   .scale(scale_y)
                   .orient("left")
                   .ticks(5);

    var x_axis = d3.svg.axis()
                   .scale(scale_x)
                   .orient("bottom")
                   .ticks(5);
                   
    chart.append("g")
       .attr("class", "axis")
       .call(y_axis);

    chart.append("g")
       .attr("class", "axis")
       .attr("transform", "translate(0," + h + ")")
       .call(x_axis);


    chart.selectAll("circle")
         .data(data)
         .enter()
         .append("circle")
         .attr("cx", function (d,i) { return scale_x(d[0]); })
         .attr("cy", function (d,i) { return scale_y(d[1]); })
         .attr("r", radius)
         .attr("fill", "black")
         .on("click", function (d, i){ drawHands(i) });
  }
};
