
// assignment two!

var data;

d3.csv('/javascripts/assignment_two/thessaloniki.csv', function (d) {
    data = d;
    init();
});

function init() {
    populatePicker();
    drawRadarChart();
}

// initializes the radar chart 
function drawRadarChart(measures) {
    var d = measures || filterData([data[1].YEAR]);

    var h = 500,
        w = 500;
        
    var colorscale = d3.scale.category10();

    // options for the Radar chart, other than default
    var mycfg = {
      w: w,
      h: h,
      levels: 6,
      ExtraWidthX: 300
    }

    RadarChart.draw("#radar-chart", d, mycfg);
};

function populatePicker() {
    var picker = document.getElementById("year-picker");

    // populate
    for (var i = 0; i < data.length; i++) {
        var option = document.createElement('option');
        option.innerHTML = data[i].YEAR;
        picker.appendChild(option);
    }

    // set selected
    picker.value = data[1].YEAR;

    // create listening evenet
    picker.onchange = selectUpdated;
}

function selectUpdated() {
    var selected = [];
    for (var i = 0; i < this.length; i++) {
        if (this.options[i].selected) { selected.push(this.options[i].value); }
    }
    drawRadarChart(filterData(selected));   
}

// checks if the measure contains funky data
function legitData(measure) {
    return !(measure.JAN == 999.9 ||
             measure.FEB == 999.9 ||
             measure.MAR == 999.9 ||
             measure.APR == 999.9 ||
             measure.MAY == 999.9 ||
             measure.JUN == 999.9 ||
             measure.JUL == 999.9 ||
             measure.AUG == 999.9 ||
             measure.SEP == 999.9 ||
             measure.OCT == 999.9 ||
             measure.NOV == 999.9 ||
             measure.DEC == 999.9)
}

function filterData(years) {
    var result = [];
    for (var i = 0; i < data.length; i++) {
        var measure = data[i];
        if (legitData(measure) && _.contains(years, measure.YEAR)) {
            var year = [
                { axis: 'January',   value: parseFloat(data[i].JAN) },
                { axis: 'February',  value: parseFloat(data[i].FEB) },
                { axis: 'March',     value: parseFloat(data[i].MAR) },
                { axis: 'April',     value: parseFloat(data[i].APR) },
                { axis: 'May',       value: parseFloat(data[i].MAY) },
                { axis: 'June',      value: parseFloat(data[i].JUN) },
                { axis: 'July',      value: parseFloat(data[i].JUL) },
                { axis: 'August',    value: parseFloat(data[i].AUG) },
                { axis: 'September', value: parseFloat(data[i].SEP) },
                { axis: 'October',   value: parseFloat(data[i].OCT) },
                { axis: 'November',  value: parseFloat(data[i].NOV) },
                { axis: 'December',  value: parseFloat(data[i].DEC) }
            ];
            result.push(year);
        }
    }
    return result;
}

// Boxplot

var box_data;
d3.csv('/javascripts/assignment_two/thessaloniki.csv', function (d) {
    box_data = parse_data(d);

    boxplot_init();
});

function boxplot_init() {
    var w = 700,
        h = 600;

    var label_height = 100;

    var n = box_data.length;
    var space = 2; // space between each box in pixels
    var box_width = w / n - space;

    if (box_width <= 0) {
        console.log('Error: Too many data points')
    }

    var max_temp = d3.max(box_data, function (d) {
        return d3.max(d.value)
    });
    var min_temp = d3.min(box_data, function (d) {
        return d3.min(d.value)
    });

    // This is very important!
    // Used to scale coordinates according to the data input
    var scale = d3.scale.linear()
               .range([0, h - label_height])
               .domain([max_temp, min_temp]);

    // Define the y axis according to our scale
    var y_axis = d3.svg.axis()
                       .scale(scale)
                       .orient("left");

    var svg = d3.select('#boxplot')
                .append('svg')
                .attr('width', w)
                .attr('height', h);
    svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate(" + 40 + ",0)")
       .call(y_axis);
   svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x", 0 - ((h-label_height) / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Temperature in Celsius");

    // Create a group for each box
    var boxes = svg.selectAll('g')
                   .data(box_data)
                   .enter()
                   .append('g');

    // Line for min value           
    boxes.append('line')
         .attr('class', 'line')
         .attr('x1', function(d, i) {
            return box_pos(i);
         })
         .attr('x2', function(d, i) {
            return box_pos(i) + box_width;
         })
         .attr('y1', function(d) {
            return scale(d.value[0]);
         })
         .attr('y2', function(d) {
            return scale(d.value[0]);
         });

    // Median line           
    boxes.append('line')
         .attr('class', 'median line')
         .attr('x1', function(d, i) {
            return box_pos(i);
         })
         .attr('x2', function(d, i) {
            return box_pos(i) + box_width;
         })
         .attr('y1', function(d) {
            return scale(d3.quantile(d.value, .5));
         })
         .attr('y2', function(d) {
            return scale(d3.quantile(d.value, .5));
         });

    // Line for max value           
    boxes.append('line')
         .attr('class', 'line')
         .attr('x1', function(d, i) {
            return box_pos(i);
         })
         .attr('x2', function(d, i) {
            return box_pos(i) + box_width;
         })
         .attr('y1', function(d) {
            return scale(d.value[d.value.length-1]);
         })
         .attr('y2', function(d) {
            return scale(d.value[d.value.length-1]);
         });

    // Line from max value down to box         
    boxes.append('line')
         .attr('class', 'line')
         .attr('x1', function(d, i) {
            return box_pos(i) + box_width / 2;
         })
         .attr('x2', function(d, i) {
            return box_pos(i) + box_width / 2;
         })
         .attr('y1', function(d) {
            return scale(d.value[d.value.length-1]);
         })
         .attr('y2', function(d) {
            return scale(d3.quantile(d.value, .75));
         });

    // Line from min value up to box         
    boxes.append('line')
         .attr('class', 'line')
         .attr('x1', function(d, i) {
            return box_pos(i) + box_width / 2;
         })
         .attr('x2', function(d, i) {
            return box_pos(i) + box_width / 2;
         })
         .attr('y1', function(d) {
            return scale(d3.quantile(d.value, .25));
         })
         .attr('y2', function(d) {
            return scale(d.value[0]);
         });

    // Rectangle as the quantile box thingy
    boxes.append('rect')
         .attr('class', 'line rectangle')
         .attr('x', function(d, i) {
            return box_pos(i);
         })
         .attr('width', function(d, i) {
            return box_width;
         })
         .attr('y', function(d) {
            return scale(d3.quantile(d.value, .75));
         })
         .attr('height', function(d) {
            return scale(d3.quantile(d.value, .25)) - scale(d3.quantile(d.value, .75));
         });

    boxes.append('text')
         .attr('class', 'year-label')
         .attr('style', 'font-size:' + box_width)
         .text(function(d) { return d.key; })
         .attr('x', function(d, i) {
            return box_pos(i) + box_width / 2;
         })
         .attr('y', h - label_height + 20);

    var description = svg.append("text")
                         .attr("y", h - label_height + 50)
                         .attr("x", w / 2)
                         .style("text-anchor", "middle")
                         .text("Box-plot of temperature changes in Thessaloniki, Greece from 1902 to 2015.");

    description.append("tspan")
               .attr("y", h - label_height + 70)
               .attr("x", w / 2)
               .text("The upper whisker of a box represents the maximum average temperature of a month that year.");

    description.append("tspan")
               .attr("y", h - label_height + 90)
               .attr("x", w / 2)
               .text("Similarly, the lower whisker indicates the minimum. The mean value is represented by a the red lines.");
      


    function box_pos(i) {
        return i * box_width + i * space;
    }
}


function parse_data(d) {
    var result = [];
    for (var i = 0; i < d.length; i++) {
        var measure = d[i];
        if (legitData(measure)) {
            var y = {
                key : measure.YEAR,
                value : [
                    parseFloat(measure.JAN),
                    parseFloat(measure.FEB),
                    parseFloat(measure.MAR),
                    parseFloat(measure.APR),
                    parseFloat(measure.MAY),
                    parseFloat(measure.JUN),
                    parseFloat(measure.JUL),
                    parseFloat(measure.AUG),
                    parseFloat(measure.SEP),
                    parseFloat(measure.OCT),
                    parseFloat(measure.NOV),
                    parseFloat(measure.DEC)].sort(d3.ascending)
            };
            result.push(y);
        }
    }
    return result;
}