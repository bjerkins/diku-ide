

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
                dest: l.VoyageTo
            });
        }
    });
}

function findCountry (name) {
    return countries.find(function (country) {
        return country.name === name;
    });
}
