var war_src     = '/images/war.svg';
var fog_src     = '/images/fog.svg';
var rain_src    = '/images/rain.svg';
var snow_src    = '/images/snow.svg';
var thunder_src = '/images/thunder.svg';
var gust_src    = '/images/gust.svg';
var book_src    = '/images/book.svg';

// 'regen', 'buijig' and 'buien' means 'rain' in Dutch
var rainwords     = /regen|buien|buijig|buien|rain/
var snowwords     = /snow/
var fogwords      = /fog|hazy|haze/
var gustwords     = /gust|wind|squally/
var thunderwords  = /thunder|lightning/

var Timeline = function (element, logs, clicked) {

    var timeline        = d3.select(element),
        dateFormat      = d3.time.format("%d. %b"),
        yearFormat      = d3.time.format("%Y"),
        offset          = 80 * 6;

    var icon = function (src, tooltip_txt) {
        return '<img src="' + src +'" class="event"/>' +
               '<div class="event_div"><p>' +
                tooltip_txt + '</p></div>';
    }

    var generateHTML = function (d, i) {
        this.className = 'li complete';
        var events = '';

        if (d.shipmemo) {events += icon(book_src, 'Memo');   }
        if (d.battle)   {events += icon(war_src, 'Battle');    }
        if (d.gusts || gustwords.test(d.weather))    
            {events += icon(gust_src, 'Gust');   }
        if (d.fog || fogwords.test(d.weather))      
            {events += icon(fog_src, 'Fog');    }
        if (d.snow || snowwords.test(d.weather))     
            {events += icon(snow_src, 'Snow');   }
        if (d.thunder || thunderwords.test(d.weather))  
            {events += icon(thunder_src, 'Thunder');}
        if (d.rain || rainwords.test(d.weather))
            { events += icon(rain_src, 'Rain'); }

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

    d3.selectAll("div.event_div")
      .on('mousemove', function () {
         d3.select(this).attr('class', 'event_div active');
      })
      .on('mouseout', function () {
         d3.select(this).attr('class', 'event_div');
      });

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
