
var Hand = function (id, maxValues) {

  var height = 400,
      width = 400,
      padding = 30;

  // scale functions
  var xScale = d3.scale.linear()
    .domain([0, maxValues.x])
    .range([padding, width - padding * 2]);

  var yScale = d3.scale.linear()
    .domain([0, maxValues.y])
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
    .x(function(d) { return xScale(d.x); })
    .y(function(d) { return yScale(d.y); })
    .interpolate("basis");

  // create our hand container
  var container = d3.select(id)
    .attr("width", '100%')
    .attr("height", height);

  var hand = container
    .append("path")
    .attr("stroke", d3.scale.category10(1))
    .attr("stroke-width", 2)
    .attr("fill", "none");

  return {

    /**
     * Initializes the graph by drawing the axis.
     */
    init: function () {      
      // append axis

      container.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis);
        
      container.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);
    },

    /**
     * Draws the graph
     */
    draw: function (handData) {
      hand.transition().attr("d", lineFn(handData));
    }
  };
};