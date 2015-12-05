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
  DrawHands.draw('#panel-one', data[index]);
}

function drawPCA() {
  DrawPCA.draw('#panel-two', data_pca);
}