
var Hand = function (id, maxValues) {

  var scale = 500,
      height = 500,
      width = 500,
      padding = 30;

  // scale functions
  var xScale = d3.scale.linear()
    .domain([0, maxValues.x * scale])
    .range([padding, width - padding * 2]);

  var yScale = d3.scale.linear()
    .domain([0, maxValues.y * scale])
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

  // append axis

  container.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(xAxis);
    
  container.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);
    
  return {
    /**
     * Draws the graph
     */
    draw: function (handData) {

      // draw lines
      var lines = container.selectAll("lines")
        .data(handData, function(d) { return d; });

      lines.enter()
        .append("path")
        .attr("d", lineFn(handData))
        .attr("stroke", d3.scale.category10(1))
        .attr("stroke-width", 2)
        .attr("fill", "none");

      lines.exit().remove();
    }
  };
};