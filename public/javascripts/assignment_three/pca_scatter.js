var PCAScatter = {
  draw: function(id, data, attribute1, attribute2) {
    var w = 310;
    var h = 360;
    var margin = {top: 20, right: 10, bottom: 20, left: 30};

    var radius = 4;

    var max_x = d3.max(data, function (d) { return d[attribute1] });
    var min_x = d3.min(data, function (d) { return d[attribute1] });
    var max_y = d3.max(data, function (d) { return d[attribute2] });
    var min_y = d3.min(data, function (d) { return d[attribute2] });

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
    
    // Define the div for the tooltip
    var tooltip = d3.select("body").append("div") 
      .attr("class", "tooltip")       
      .style("opacity", 0);

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
      .attr("cx", function (d,i) { return scale_x(d[attribute1]); })
      .attr("cy", function (d,i) { return scale_y(d[attribute2]); })
      .attr("r", radius)
      .attr("fill", "black")
      .on("mouseover", function (d, i) { 
        
        // highlight the selected circle
        d3.select(this)
          .transition()
          .attr("fill", "red")
          .attr("r", radius + 5);

        // draw the requested hand
        drawHands(i);

        // show tooltip
        tooltip.transition()    
          .duration(200)    
          .style("opacity", .9);
        tooltip.html(i)  
          .style("left", (d3.event.pageX) + "px")   
          .style("top", (d3.event.pageY - 28) + "px");  
      })
      .on("mouseout", function(d) {
        // remove tooltip
        tooltip.transition()    
          .duration(500)    
          .style("opacity", 0); 

        // de-highlight (normalize) the circle
        d3.select(this)
          .transition()
          .attr("fill", "black")
          .attr("r", radius);
      });
  }
};
