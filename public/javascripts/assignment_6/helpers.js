function prepareCountries () {
    countries = countries.filter(function(d) {
        return names.some(function(n) {
            if (d.id == n.id) return d.name = n.name;
        });
    }).sort(function(a, b) {
        return a.name.localeCompare(b.name);
    });
}

function prepareVoyage (voyage) {
    // bon voyage!
    logs.forEach(function (l) {
        if (!(isNaN(l.Lat3) || isNaN(l.Lon3))) {
            voyage.push({
                id: parseInt(l.RecID),
                lon: l.Lon3,
                lat: l.Lat3,
                dest: l.VoyageTo,
                orig: l.VoyageFrom,
                initial_date: extractDate(l.VoyageIni),
                date: extractDate(l.UTC),
                captain: l.Name1,
                ship_name: l.ShipName,
                weather: l.Weather,
                battle: l.WarsAndFights === "1" ? true : false,
                battle_desc: l.WarsAndFightsMemo,
                gusts: l.Gusts === "1" ? true : false,
                rain: l.Rain === "1" ? true : false,
                fog: l.Fog === "1" ? true : false,
                snow: l.Snow === "1" ? true : false,
                thunder: l.Thunder === "1" ? true : false,
                hail: l.Hail === "1" ? true : false,
                seaice: l.SeaIce === "1" ? true : false,
                shipmemo: l.ShipAndRigMemo

            });
        }
    });
}

function voyageDateRange(voyage) {
    var result = [];
    voyage.forEach(function (v) {
        result.push(v.date);
    });
    return result;
}

/**
 * Format of UTC is YYYYMMDDHHmm
 */
function extractDate(utc) {
    return new Date(
        utc.slice(0, 4),
        utc.slice(4, 6),
        utc.slice(6, 8),
        utc.slice(8, 10),
        utc.slice(10, 12));
}

function getLastDate(voyage) {
    return voyage[voyage.length - 1].date;
}

var formatDate = d3.time.format("%d. %b %Y");

function findCountry (name) {
    return countries.find(function (country) {
        return country.name === name;
    });
}
