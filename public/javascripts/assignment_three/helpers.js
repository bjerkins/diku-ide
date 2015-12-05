function convertToCoords(text) {
  return d3.csv.parseRows(text).map(function (row) {
    var result = [];
    // map a function to each value within row
    row.map(function (value, i) {
      if (i < NO_X_COORDS) {
        result.push({
          x: +row[i],
          y: +row[NO_X_COORDS + i]
        });
      }
    });
    return result;
  });
}

function convertToNumbers(text) {
  return d3.csv.parseRows(text).map(function (row) {
    // map a function to each value within row
    return row.map(function (value) {
      // convert value to number
      return +value;
    });
  });
}