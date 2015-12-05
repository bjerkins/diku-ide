var DrawHands = {

  draw: function (id, data) {

    var scale = 500;

    var lineFn = d3.svg.line()
      .x(function(d) { return d.x * scale; })
      .y(function(d) { return d.y * scale; })
      .interpolate("basis");

    var hand = d3.select(id)
      .attr("width", scale)
      .attr("height", scale);
    
    hand.append("path")
      .attr("d", lineFn(data))
      .attr("stroke", d3.scale.category10(1))
      .attr("stroke-width", 2)
      .attr("fill", "none");
  }
  
};