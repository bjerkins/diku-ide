// script for assignment four

    var map = new Datamap({
        element: document.getElementById('map1'),
        scope: 'usa',
        fills: {
            HIGH: '#afafaf',
            LOW: '#123456',
            MEDIUM: 'blue',
            UNKNOWN: 'rgb(0,0,0)',
            defaultFill: 'green'
        },
        data: {
            CA: {
                fillKey: 'LOW',
                numberOfThings: 2002
            },
            DE: {
                fillKey: 'MEDIUM',
                numberOfThings: 10381
            },
            NY: {
                fillKey: 'HIGH',
                numberOfThings: 10381
            }
        }
    });

    //draw a legend for this map
    map.legend();