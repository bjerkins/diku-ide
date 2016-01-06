// script for assignment five

var data, 
    camera, 
    scene, 
    renderer,
    flyControls,
    clock,
    bonds = {};
var CONST = 1;

d3.csv('/javascripts/assignment_5/data/atoms.csv', function(d) {
  return {
    id: +d.id,
    x:  +d.x,
    y:  +d.y,
    z:  +d.z,
    element: d.element
  };
}, function(error, rows) {
    data = rows;
    init();
    renderScene();
});


// expects 'data' to have been initialized
function init() {
    // set up clock
    clock = new THREE.Clock();

	scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.x = -20;
    camera.position.z = 60;

    data.forEach(function (atom) {
        var material = new THREE.MeshBasicMaterial({
            color: atomColor(atom.element)
        });
        var mesh = new THREE.Mesh(new THREE.SphereGeometry( 0.5, 5, 5 ), material);
        mesh.position.set(atom.x * CONST, atom.y * CONST, atom.z * CONST);
        scene.add(mesh);
    });

    // set up camera fly controls (W A S D etc. + arrows)
    flyControls = new THREE.FlyControls(camera);
    flyControls.movementSpeed = 20;
    flyControls.rollSpeed = Math.PI/8;
    flyControls.yawSpeed = Math.PI/8;
    flyControls.pitchSpeed = Math.PI/8;
    flyControls.dragToLook = true;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    findBonds();
}

function renderScene() {
    flyControls.update( clock.getDelta() );

    requestAnimationFrame(renderScene);

    renderer.render(scene, camera);
}

function atomColor(type) {
    return {
        'C': 'gray',
        'N': 'blue',
        'O': 'red',
        'S': 'yellow',
        'H': 'white',
    }[type];
}

function findBonds() {
    make_map();
    for (var i = 0; i < data.length; i++) {
        for (var j = i+1; j < data.length; j++) {
            var atom_one = data[i];
            var atom_two = data[j];
            if (atom_one.id !== atom_two.id && checkBond(atom_one, atom_two) && !_.contains(bonds[atom_two], atom_one.id)) {
                bonds[atom_one.id].push(atom_two.id);
            }
        }
    }
}

function make_map() {
    data.forEach(function (d) {
        bonds[d.id] = [];
    });
}

function checkBond(atom_one, atom_two) {
	var distance = Math.sqrt(
        Math.pow((atom_one.x - atom_two.x), 2) + 
        Math.pow((atom_one.y - atom_two.y), 2) + 
        Math.pow((atom_one.z - atom_two.z), 2)
    );
    return distance < 1.9;
}