var DrawHands = {

  draw: function (id, handData) {

    var scale = 500,
        height = 500,
        width = 500,
        padding = 30;

    // scale functions
    var xScale = d3.scale.linear()
      .domain([0, d3.max(handData, function(d) { return scale * d.x; })])
      .range([padding, width - padding * 2]);

    var yScale = d3.scale.linear()
      .domain([0, d3.max(handData, function(d) { return scale * d.y; })])
      .range([height - padding, padding]);

    // create x axis
    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      .ticks(5);

    // create y axis
    var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left")
      .ticks(5);

    // create our line function
    var lineFn = d3.svg.line()
      .x(function(d) { return xScale(d.x * scale); })
      .y(function(d) { return yScale(d.y * scale); })
      .interpolate("basis");

    // create our hand container
    var container = d3.select(id)
      .attr("width", width)
      .attr("height", height);
    
    //
    // draw lines
    //

    container.append("path")
      .attr("d", lineFn(handData))
      .attr("stroke", d3.scale.category10(1))
      .attr("stroke-width", 2)
      .attr("fill", "none");

    //
    // append axis
    //

    container.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (height - padding) + ")")
      .call(xAxis);
      
    container.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis);
  }  
};

var DrawPCA = {
  draw: function(id, data) {
    var w = 500;
    var h = 500;
    var margin = {top: 20, right: 20, bottom: 40, left: 40};

    var radius = 5;

    var max_x = d3.max(data, function (d) { return d[0] });
    var min_x = d3.min(data, function (d) { return d[0] });
    var max_y = d3.max(data, function (d) { return d[1] });
    var min_y = d3.min(data, function (d) { return d[1] });

    console.log(max_x);

    var scale_x = d3.scale.linear()
                    .range([radius, w - radius])
                    .domain([min_x, max_x]);

    var scale_y = d3.scale.linear()
                    .range([radius, h - radius])
                    .domain([max_y, min_y]);

    var chart = d3.select(id)
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var y_axis = d3.svg.axis()
                   .scale(scale_y)
                   .orient("left");

    var x_axis = d3.svg.axis()
                   .scale(scale_x)
                   .orient("bottom");
                   
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
}
