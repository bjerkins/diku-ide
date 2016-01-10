// script for assignment five

var data, 
    camera, 
    scene, 
    renderer,
    flyControls,
    clock,
    bonds = {};

// constants
var ATOM_RADIUS = 0.5,
    PADDING = 1;

d3.csv('/javascripts/assignment_5/data/atoms.csv', function(d) {
  return {
    id: +d.id,
    x:  +d.x,
    y:  +d.y,
    z:  +d.z,
    element: d.element
  };
}, function(error, rows) {
    // TODO , remove slice before handin
    data = rows.slice(0, 100); 
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

    // setup a fog
    scene.fog = new THREE.Fog( 0xeeeee, 10, 100);

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
    // debugger;
    var material = new THREE.MeshBasicMaterial({color: 'green'});
    for (var atom_id in bonds) {
        var origin = bonds[atom_id];
        for (var i = 0; i < origin.bonds.length; i++) {
            var bond_atom = origin.bonds[i];

            var fromPoint = new THREE.Vector3(origin.atom.x, origin.atom.y, origin.atom.z);
            var toPoint = new THREE.Vector3(bond_atom.x, bond_atom.y, bond_atom.z);

            // var geometry = new THREE.Geometry();
            // geometry.vertices.push(new THREE.Vector3(fromPoint.x, fromPoint.y, fromPoint.z));
            // geometry.vertices.push(new THREE.Vector3(toPoint.x, toPoint.y, toPoint.z));

            // var line = new THREE.Line(geometry, material, parameters = { linewidth: 400 });
            var bond = cylinderMesh(fromPoint, toPoint, material);

            scene.add(bond);
        }
    }
}

function renderScene() {
    flyControls.update(clock.getDelta());

    requestAnimationFrame(renderScene);

    renderer.render(scene, camera);
}

function cylinderMesh(pointX, pointY, material) {
    var direction = new THREE.Vector3().subVectors(pointY, pointX);
    var orientation = new THREE.Matrix4();
    orientation.lookAt(pointX, pointY, new THREE.Object3D().up);
    orientation.multiply(new THREE.Matrix4().set(1, 0, 0, 0,
        0, 0, 1, 0,
        0, -1, 0, 0,
        0, 0, 0, 1));
    var edgeGeometry = new THREE.CylinderGeometry(0.1, 0.1, direction.length(), 8, 1);
    var edge = new THREE.Mesh(edgeGeometry, material);
    edge.applyMatrix(orientation);
    // position based on midpoints - there may be a better solution than this
    edge.position.x = (pointY.x + pointX.x) / 2;
    edge.position.y = (pointY.y + pointX.y) / 2;
    edge.position.z = (pointY.z + pointX.z) / 2;
    return edge;
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
                bonds[atom_one.id].bonds.push(atom_two);
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
        (atom_one.x - atom_two.x),
        (atom_one.y - atom_two.y),
        (atom_one.z - atom_two.z)
    );
}