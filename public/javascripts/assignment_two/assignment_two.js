
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
    var d = measures || prepareData(data);

    var h = 500,
        w = 500;
        
    var colorscale = d3.scale.category10();

    //Legend titles
    var LegendOptions = ['Smartphone','Tablet'];

    //Options for the Radar chart, other than default
    var mycfg = {
      w: w,
      h: h,
      levels: 6,
      ExtraWidthX: 300
    }

    //Call function to draw the Radar chart
    //Will expect that data is in %'s
    RadarChart.draw("#radar-chart", d, mycfg);

    // var svg = d3.select('#assignment_two')
    //             .selectAll('svg')
    //             .append('svg')
    //             .attr("width", w+300)
    //             .attr("height", h)

    // //Create the title for the legend
    // var text = svg.append("text")
    //               .attr("class", "title")
    //               .attr('transform', 'translate(90,0)') 
    //               .attr("x", w - 70)
    //               .attr("y", 10)
    //               .attr("font-size", "12px")
    //               .attr("fill", "#404040")
    //               .text("What % of owners use a specific service in a week");
    
    // //Initiate Legend 
    // var legend = svg.append("g")
    //                 .attr("class", "legend")
    //                 .attr("height", 100)
    //                 .attr("width", 200)
    //                 .attr('transform', 'translate(90,20)');

    // // create colour squares
    // legend.selectAll('rect')
    //       .data(LegendOptions)
    //       .enter()
    //       .append("rect")
    //       .attr("x", w - 65)
    //       .attr("y", function(d, i){ return i * 20;})
    //       .attr("width", 10)
    //       .attr("height", 10)
    //       .style("fill", function(d, i){ return colorscale(i);});

    // //Create text next to squares
    // legend.selectAll('text')
    //       .data(LegendOptions)
    //       .enter()
    //       .append("text")
    //       .attr("x", w - 52)
    //       .attr("y", function(d, i){ return i * 20 + 9;})
    //       .attr("font-size", "11px")
    //       .attr("fill", "#737373")
    //       .text(function(d) { return d; }); 
};

function populatePicker() {
    var picker = document.getElementById("year-picker");

    // populate
    for (var i = 0; i < data.length; i++) {
        var option = document.createElement('option');
        option.innerHTML = data[i].YEAR;
        picker.appendChild(option);
    }

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

// returns data in a format that the radar chart understands it
function prepareData() {
    var result = [];
    for (var i = 0; i < 3; i++) {
        if (legitData(data[i])) {
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