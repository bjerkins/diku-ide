

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
            voyage.push({ Lon3: l.Lon3,
                          Lat3: l.Lat3,
                          dest: l.VoyageTo });
        }
    });
}

function findCountry (name) {
    return countries.find(function (country) {
        return country.name === name;
    });
}
