var war_src     = '/images/war.svg';
var fog_src     = '/images/fog.svg';
var rain_src    = '/images/rain.svg';
var snow_src    = '/images/snow.svg';
var thunder_src = '/images/thunder.svg';
var gust_src    = '/images/gust.svg';

var Timeline = function (element, logs, clicked) {

    var timeline        = d3.select(element),
        dateFormat      = d3.time.format("%d. %b"),
        yearFormat      = d3.time.format("%Y"),
        offset          = 80 * 6;

    var icon = function (src) {
        return '<img src="' + src +'" class="event" /><div></div>';
    }

    var generateHTML = function (d, i) {
        this.className = 'li complete';
        var events = '';

        if (d.battle)  {events += icon(war_src);    }
        if (d.gusts)   {events += icon(gust_src);   }
        if (d.fog)     {events += icon(fog_src);    }
        if (d.snow)    {events += icon(snow_src);   }
        if (d.thunder) {events += icon(thunder_src);}
        // 'regen', 'buijig' and 'buien' means 'rain' in Dutch
        if (d.rain || d.weather.indexOf('regen') > -1 || d.weather.indexOf('buien') > -1 ||
            d.rain || d.weather.indexOf('buijig') > -1)    
            {events += icon(rain_src);   }

        return  '<div class="timestamp">' +
                '   <span class="date">' + dateFormat(d.date) + '</span>' +
                '   <span class="year">' + yearFormat(d.date) + '</span>' +
                '</div>' +
                '<div class="status"></div>' +
                '<div class="events">' + events + '</div>';
    };

    // render the timeline
    var data = timeline.selectAll('li')
                       .data(logs, function (d) { return d.id; })
    data.enter()
        .append('li')
        .html(generateHTML)
        .on('click', clicked);

    data.exit().remove();

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
