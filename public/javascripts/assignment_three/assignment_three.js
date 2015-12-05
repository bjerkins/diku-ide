// script for assignment three

var NO_X_COORDS = 56,
    data,
    data_pca;

d3.text('/javascripts/assignment_three/hands.csv', function (text) {
  // map a function to each row
  data = convertToCoords(text);
  // read in pca file
  d3.text('/javascripts/assignment_three/hands_pca.csv', function (text) {
    data_pca = convertToNumbers(text);
    init();
  });
});

function convertToCoords(text) {
  return d3.csv.parseRows(text).map(function (row) {
    var result = [];
    // map a function to each value within row
    row.map(function (value, i) {
      result.push({
        x: +row[i],
        y: +row[NO_X_COORDS + i]
      });
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


// call this when data is ready
function init() {
  console.log(data);
  // drawHands();
}

function drawHands() {
  DrawHands.draw('#panel-one', data);
}