var Timeline = function (element, logs, clicked) {

    var timeline        = d3.select(element),
        dateFormat      = d3.time.format("%d. %b"),
        yearFormat      = d3.time.format("%Y");

    var generateHTML = function (d, i) {
        this.className = i === 0 ? 'li complete' : 'li';
        return  '<div class="timestamp">' +
                '   <span class="date">' + dateFormat(d.date) + '</span>' +
                '   <span class="year">' + yearFormat(d.date) + '</span>' +
                '</div>' +
                '<div class="status"></div>';
    };

    var handleClick  = function(d) {

        // remove other classnames
        timeline
            .selectAll('li')
            .attr('class', 'li');

        // set class name complete
        this.className += ' complete';

        // finally, call callback
        clicked(d);
    };

    // render the timeline
    timeline
        .selectAll('li')
        .data(logs, function (d) { return d.id; })
        .enter()
        .append('li')
        .html(generateHTML)
        .on('click', handleClick);

    return {
        draw: function (index) {

            // clear selected
            var muchLeft = -80 * index;
            debugger;
            timeline
                .transition()
                .selectAll('li')
                .each(function (d, i) {
                    this.className = i === index ? 'li complete' : 'li';
                });

            // move timeline to left
            timeline
                .style('left', muchLeft + 'px');
        }
    };
};
