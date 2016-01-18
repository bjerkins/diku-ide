var Timeline = function (element, logs, clicked) {

    var timeline        = d3.select(element),
        dateFormat      = d3.time.format("%d. %b"),
        yearFormat      = d3.time.format("%Y"),
        offset          = 80 * 6;

    var generateHTML = function (d, i) {
        this.className = 'li complete';
        return  '<div class="timestamp">' +
                '   <span class="date">' + dateFormat(d.date) + '</span>' +
                '   <span class="year">' + yearFormat(d.date) + '</span>' +
                '</div>' +
                '<div class="status"></div>';
    };

    // render the timeline
    timeline
        .selectAll('li')
        .data(logs, function (d) { return d.id; })
        .enter()
        .append('li')
        .html(generateHTML)
        .on('click', clicked);

    timeline.style('left', offset + 'px');

    return {
        draw: function (index) {

            // clear selected
            var muchLeft = offset + (-80 * index);

            d3.transition()
                .each(function() {
                    // move timeline to left
                    timeline
                        .transition()
                        .style('left', muchLeft + 'px');
                })
                .transition();
        }
    };
};
