function convertToCoords(text) {
  return d3.csv.parseRows(text).map(function (row) {
    var result = [];

    var xx = row.slice(0, row.length/2);
    var yy = row.slice(row.length/2, row.length);

    return d3.zip(xx,yy);
  });
}

function convertToNumbers(text) {
  return d3.csv.parseRows(text).map(function (row) {
    // We only need the first two PCA
    row = row.slice(0,2);

    // map a function to each value within row
    return row.map(function (value) {
      // convert value to number
      return +value;
    });
  });
}