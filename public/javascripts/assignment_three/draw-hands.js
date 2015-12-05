var DrawHands = {

  draw: function (id, data) {

    var lineFunction = d3.svg.line()
      .x(function(d) { return d.x * 100; })
      .y(function(d) { return d.y * 100; })
      .interpolate("linear");

    //The SVG Container
    var hand = d3.select(id).append("svg")
      .attr("width", 200)
      .attr("height", 200);
    
    hand.append("path")
      .attr("d", lineFunction(data))
      .attr("stroke", "#B000B5")
      .attr("stroke-width", 2)
      .attr("fill", "none");

  }
};