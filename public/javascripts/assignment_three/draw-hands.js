var DrawHands = {

  draw: function (id, data) {

    var scale = 500;

    var lineFunction = d3.svg.line()
      .x(function(d) { return d.x * scale; })
      .y(function(d) { return d.y * scale; })
      .interpolate("linear");

    //The SVG Container
    var hand = d3.select(id).append("svg")
      .attr("width", scale)
      .attr("height", scale);
    
    hand.append("path")
      .attr("d", lineFunction(data))
      .attr("stroke", "#B000B5")
      .attr("stroke-width", 2)
      .attr("fill", "none");

  }
};