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
  //drawHands();
  drawPCA();
}

function drawHands(index) {
  var maxX = d3.max(data, function(d) { return d3.max(d, function (obj) { return obj.x; }) }),
      maxY = d3.max(data, function(d) { return d3.max(d, function (obj) { return obj.y; }) });
      
  DrawHands.draw('#panel-one', data[index], { x: maxX, y: maxY });
}

function drawPCA() {
  DrawPCA.draw('#panel-two', data_pca);
}