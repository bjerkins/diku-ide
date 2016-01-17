/**
 * Mostly taken from http://bl.ocks.org/zanarmstrong/ddff7cd0b1220bc68a58
 */

var Slider = function (element, dateRange) {

    var tickDateFormat  = d3.time.format("%d. %b - %H:%M"),
        axisDateFormat  = d3.time.format("%d. %B %Y"),
        margin          = { top: 50, right: 50, bottom: 50, left: 50 },
        width           = 740 - margin.left - margin.right,
        height          = 50;

    var svg = d3.select(element)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // scale function
    var timeScale = d3.time.scale()
        .domain(dateRange)
        .range([0, width])
        .clamp(true);

    return {
        /**
         * currentDate - type Date()
         */
        setDate: function (date) {

            // remove any previous sliders
            svg.selectAll('*').remove();

            // defines brush
            var brush = d3.svg.brush()
                .x(timeScale)
                .extent([date, date])
                .on("brush", brushed);

            svg.append("g")
                .attr("class", "x axis")
                // put in middle of screen
                .attr("transform", "translate(0," + height / 2 + ")")
                // inroduce axis
                .call(d3.svg.axis()
                    .scale(timeScale)
                    .orient("bottom")
                    .tickFormat(function(d) {
                        return axisDateFormat(d);
                    })
                    .tickSize(0)
                    .tickPadding(12)
                    .tickValues([timeScale.domain()[0], timeScale.domain()[1]])
                )
                .select(".domain")
                .select(function() {
                    return this.parentNode.appendChild(this.cloneNode(true));
                })
                .attr("class", "halo");

            var slider = svg.append("g")
                .attr("class", "slider")
                .call(brush);

            slider.selectAll(".extent,.resize").remove();

            slider.select(".background").attr("height", height);

            var handle = slider.append("g").attr("class", "handle");

            handle
                .append("path")
                .attr("transform", "translate(0," + height / 2 + ")")
                .attr("d", "M 0 -8 V 8");

            handle
                .append('text')
                .text(date);

            slider.call(brush.event);

            function brushed() {
                var value = brush.extent()[0];

                if (d3.event.sourceEvent) { // not a programmatic event
                    value = timeScale.invert(d3.mouse(this)[0]);
                    brush.extent([value, value]);
                }

                handle.attr("transform", "translate(" + timeScale(value) + ",0)");

                handle
                    .select('text')
                    .text(tickDateFormat(value))
                    .attr("transform", function (d) {
                        var width = this.getBBox().width;
                        return "translate(" + (-width / 2) + " ," + (height / 2 - 25) + ")";
                    });
            }
        }
    };
};
