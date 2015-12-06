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
  pcaScatter = PCAScatter();
  handGraph.init();
  drawPCA(0, 1);

  // setup extra information hover
  d3.selectAll('.extra-information')
    .on('mouseover', function (d) {
      var index = d3.select(this).attr('index');
      drawHands(index);
      pcaScatter.highlight_dot('#panel-two', index);
    })
    .on('mouseout', function (d) {
      var index = d3.select(this).attr('index');
      pcaScatter.unhighlight_dot('#panel-two', index);
    });

  // setup update button
  d3.select('.update')
    .on('mousedown', function (d){
      var att1 = d3.select(this).attr('a1');
      var att2 = d3.select(this).attr('a2');
      drawPCA(5, 6);
    });

}

function drawHands(index) {
  handGraph.draw(data[index]);
}

function drawPCA(a1, a2) {
  pcaScatter.draw('#panel-two', data_pca, a1, a2);
}
