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

// call this when data is ready
function init() {
  drawHands();
}

function drawHands() {
  var maxX = d3.max(data, function(d) { return d3.max(d, function (obj) { return obj.x; }) }),
      maxY = d3.max(data, function(d) { return d3.max(d, function (obj) { return obj.y; }) });
      
  DrawHands.draw('#panel-one', data[0], { x: maxX, y: maxY });
}