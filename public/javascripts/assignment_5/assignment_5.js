// script for assignment five

var data, 
    camera, 
    scene, 
    renderer,
    flyControls,
    clock,
    bonds = {};

// constants
var ATOM_RADIUS = 1.8,
    PADDING = 3;

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
    findBonds();
    
    clock = new THREE.Clock();

	scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.x = -50 * PADDING;
    camera.position.z = 20 * PADDING;

    drawAtoms();
    drawBonds();

    // set up camera fly controls (W A S D etc. + arrows)
    flyControls = new THREE.FlyControls(camera);
    flyControls.movementSpeed = 20 * PADDING;
    flyControls.rollSpeed = (Math.PI/8) * PADDING;
    flyControls.yawSpeed = (Math.PI/8) * PADDING;
    flyControls.pitchSpeed = (Math.PI/8) * PADDING;
    flyControls.dragToLook = true;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
}

function drawAtoms() {

    var map = THREE.ImageUtils.loadTexture( '/images/molecule_texture.jpg' );
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 16;

    // draw atoms
    data.forEach(function (atom) {
        var material = new THREE.MeshBasicMaterial({ 
            color: atomColor(atom.element),
            map: map
        });
        var mesh = new THREE.Mesh(new THREE.SphereGeometry( ATOM_RADIUS, 8, 6 ), material);
        mesh.position.set(atom.x * PADDING, atom.y * PADDING, atom.z * PADDING);
        scene.add(mesh);
    });
}

function drawBonds() {
    for (var atom_id in bonds) {
        var origin = bonds[atom_id];
        for (var i = 0; i < origin.bonds.length; i++) {
            var vector = origin.bonds[i].vector;
            var material = new THREE.MeshBasicMaterial({color: 'green'});
            var geometry = new THREE.CylinderGeometry( 0.2, 0.2, vector.length() + ATOM_RADIUS);
            
            var cylinder = new THREE.Mesh(geometry, material);
            var axis = new THREE.Vector3(0, 1, 0);

            cylinder.quaternion.setFromUnitVectors(axis, vector.clone().normalize());
            cylinder.position.set(origin.atom.x * PADDING, origin.atom.y * PADDING, origin.atom.z * PADDING);

            scene.add(cylinder);    
        }
    }
}

function renderScene() {
    flyControls.update(clock.getDelta());

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
            var vector = vectorBetweenAtoms(atom_one, atom_two);

            if (atom_one.id !== atom_two.id && checkBond(atom_one, atom_two)) {
                bonds[atom_one.id].bonds.push({
                    atomId: atom_two.id,
                    vector: vector
                });
            }
        }
    }
}

function make_map() {
    data.forEach(function (d) {
        bonds[d.id] = {
            atom: d,
            bonds: []
        };
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

function vectorBetweenAtoms(atom_one, atom_two) {
    return new THREE.Vector3(
        (atom_one.x - atom_two.x) * PADDING,
        (atom_one.y - atom_two.y) * PADDING,
        (atom_one.z - atom_two.z) * PADDING
    );
}