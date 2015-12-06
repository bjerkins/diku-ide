var Hand = function (id, maxValues) {

  var height = 400,
      width = 450,
      padding = 30;

  // Used when drawing multiple hands
  var hands = {};

  // scale functions
  var xScale = d3.scale.linear()
    .domain([0, maxValues.x])
    .range([padding, width - padding]);

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
    .x(function(d) { return xScale(d[0]); })
    .y(function(d) { return yScale(d[1]); })
    .interpolate("cardinal");

  // create our hand container
  var container = d3.select(id)
    .attr("width", width)
    .attr("height", height);

  var hand = container
    .append("path")
    .attr("stroke", d3.scale.category10(1))
    .attr("stroke-width", 2)
    .attr("fill", "none");

  var hands_container = container.append("g");

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
    },

    update_hands: function() {
      // Remove the "single" hand
      hand.transition().attr("d", "");

      var hands_data = new Array();
      for (h in hands) {
        hands_data.push(hands[h]);
      }
      var paths = hands_container.selectAll("path")
          .data(hands_data);

      // UPDATE
      // Update old elements as needed.

      // ENTER
      // Create new elements as needed.
      paths.enter()
          .append("path")
          .attr("class", "hej")              
          .attr("stroke", function(d,i) { return colors(d.key); })
          .attr("stroke-width", 2)
          .attr("fill", "none")
          .attr("d", function(d,i) { return lineFn(d.value); });

      // EXIT
      //Remove old elements as needed.
      paths.exit()
          .remove();
    },
    add_hand: function(handData, index) {
      hands[index] = {key : index, value : handData};
      this.update_hands();
    },

    remove_hand: function(index) {
      delete hands[index];
      this.update_hands();
    },
  };
};