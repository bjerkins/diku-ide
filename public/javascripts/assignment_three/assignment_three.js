// script for assignment three

var data,
    data_pca,
    handGraph;

d3.text('/javascripts/assignment_three/hands.csv', function (text) {
  data = convertToCoords(text);
  // read in pca file
  d3.text('/javascripts/assignment_three/hands_pca.csv', function (text) {
    data_pca = convertToNumbers(text);
    init();
  });
});

// call this when data is ready
function init() {
  var maxX = d3.max(data, function(d) { return d3.max(d, function (obj) { return obj[0]; }) }),
      maxY = d3.max(data, function(d) { return d3.max(d, function (obj) { return obj[1]; }) });

  handGraph = Hand('#panel-one', { x: maxX, y: maxY });
  handGraph.init();
  drawPCA();

  // setup extra information hover
  d3.select('.extra-information')
    .on('mouseover', function (d) {
      var index = d3.select(this).attr('index');
      drawHands(index);
    });

}

function drawHands(index) {
  handGraph.draw(data[index]);
}

function drawPCA() {
  PCAScatter.draw('#panel-two', data_pca);
}