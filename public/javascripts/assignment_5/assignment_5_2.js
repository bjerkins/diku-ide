var data, 
    camera, 
    scene, 
    renderer,
    flyControls,
    clock;

var WIDTH  = 256;
var HEIGHT = 256;

init();

function init() {
    clock = new THREE.Clock();
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);

    d3.select("#scene").style("width", WIDTH + "px");
    document.getElementById("scene").appendChild(renderer.domElement);
}