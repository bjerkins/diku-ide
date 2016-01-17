

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
                lon: l.Lon3,
                lat: l.Lat3,
                dest: l.VoyageTo,
                date: extractDate(l.UTC),
                captain: l.Name1,
                ship_name: l.ShipName
            });
        }
    });
}

function voyageDateRange(voyage) {
    return [voyage[0].date, voyage[voyage.length -1].date];
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

function findCountry (name) {
    return countries.find(function (country) {
        return country.name === name;
    });
}
