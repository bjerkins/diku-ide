var Timeline = function (element, logs, clicked) {

    var initialLogs     = logs,
        timeline        = d3.select(element),
        dateFormat      = d3.time.format("%d. %b"),
        yearFormat      = d3.time.format("%Y");

    var generateHTML = function (d, i) {
        this.className = i === 0 ? 'li complete' : 'li';
        var triangle = i === 0 ? '&#9660;' : ' ';
        return  '<div class="timestamp">' +
                '   <span class="date">' + dateFormat(d.date) + '</span>' +
                '   <span class="year">' + yearFormat(d.date) + '</span>' +
                '</div>' +
                '<div class="status">' +
                '   <h4>' + triangle + '</h4>' +
                '</div>';
    };

    return {
        draw: function (index) {
            if (index !== 0) {
                timeline
                    .transition()
                    .style('left', '-160px');
            }
            var newLogs = initialLogs.slice(index, index + 4);

            var set = timeline
                .selectAll('li')
                .data(newLogs, function (d) { return d.id; });

            // first, add the new ones
            set
                .enter()
                .append('li')
                .html(generateHTML)
                .on('click', clicked);

            // update the current ones
            set.html(generateHTML);

            //  remove the old ones
            set.exit().remove();
        }
    };
};
