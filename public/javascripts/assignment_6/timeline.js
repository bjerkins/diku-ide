var Timeline = function (element, logs, clicked) {

    var initialLogs     = logs,
        showNrOfLogs    = 3,
        timeline        = d3.select(element),
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

    return {
        draw: function (index) {
            var newLogs = initialLogs.slice(index, index + showNrOfLogs);

            var set = timeline
                .selectAll('li')
                .data(newLogs, function (d) { return d.id; });

            // first, add the new ones
            set
                .enter()
                .append('li')
                .html(generateHTML)
                .on('click', handleClick);

            // update the current ones
            set.html(generateHTML);

            //  remove the old ones
            set.exit().remove();
        }
    };
};
