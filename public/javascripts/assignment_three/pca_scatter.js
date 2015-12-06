var radius = 5;

var on_hover = function(d, i) {
  d3.select(d).transition()
              .attr("fill", "blue")
              .attr("r", radius + 5);
}

var PCAScatter = function() {
  var w = 410;
  var h = 360;
  var margin = {top: 20, right: 10, bottom: 20, left: 30};


  return {
    highlight_dot: function(id, index, attribute1, attribute2) {
      var dot = d3.select(id)
                  .select('g')
                  .selectAll("circle")[0][index];

      d3.select(dot).transition()
            .attr("fill", "red")
            .attr("r", radius + 5);
    },
    unhighlight_dot: function(id, index) {
      var dot = d3.select(id)
                  .select('g')
                  .selectAll("circle")[0][index];

      d3.select(dot).transition()
            .attr("fill", "black")
            .attr("r", radius);
    },
    draw: function(id, data, attribute1, attribute2) {


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
        .attr("width",  w + margin.left + margin.right)
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
          // Reset everything from the multiselect
          d3.selectAll( 'circle')
                .each(function (d,i) { removeHand(i); });
          d3.selectAll( 'circle.selected')   
            .classed( "selected", false)   
            .transition()
            .attr("fill", "black")
            .attr("r", radius);

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


      // Thomas' part about rectangular selection
      // Inspiration from http://bl.ocks.org/lgersman/5311083
      var svg = d3.select(id);
      svg.on( "mousedown", function() {

          var p = d3.mouse(this);

          svg.append( "rect")
          .attr({
              class   : "selection",
              x       : p[0],
              y       : p[1],
              width   : 0,
              height  : 0
          });
      })
      .on( "mousemove", function() {
          var s = svg.select( "rect.selection");

          if (!s.empty()) {
              var p = d3.mouse( this),
                  d = {
                      x       : parseInt( s.attr( "x"), 10),
                      y       : parseInt( s.attr( "y"), 10),
                      width   : parseInt( s.attr( "width")),
                      height  : parseInt( s.attr( "height"))
                  },
                  move = {
                      x : p[0] - d.x - 0.5, // -0.5 is a hotfix. Don't know why it doesn't parse the int correctly
                      y : p[1] - d.y
                  }
              ;

              if( move.x < 1 || (move.x*2<d.width)) {
                  d.x = p[0];
                  d.width -= move.x;
                  if (d.width < 0)
                    d.width = move.x;
              } else {
                  d.width = move.x;       
              }

              if( move.y < 1 || (move.y*2<d.height)) {
                  d.y = p[1];
                  d.height -= move.y;
              } else {
                  d.height = move.y;       
              }
             
              s.attr(d);

              // deselect all circles!
              d3.selectAll( 'circle').classed( "selected", false)
                .each(function (d,i) { removeHand(i); })
                .transition()
                .attr("fill", "black")
                .attr("r", radius);

              svg.selectAll('circle').each( function( cd, i) {
                var circle = d3.select(this);
                var cx = parseInt(circle.attr('cx')) + margin.left,
                    cy = parseInt(circle.attr('cy')) + margin.top

                  if( !circle.classed( "selected") &&
                      // circles inside selection
                      cx >= d.x && cx <= d.x + d.width && 
                      cy >= d.y && cy <= d.y + d.height
                  ) {
                      d3.select( this)
                      .attr( "class", "selected")
                      .attr("fill", colors(i))
                      .transition()
                      .attr("r", radius+5);

                      addHand(i);
                  }
              });
          }
      })
      .on( "mouseup", function() {
          // remove selection rect
          svg.selectAll("rect.selection").remove();
      });
    }
  };
};
