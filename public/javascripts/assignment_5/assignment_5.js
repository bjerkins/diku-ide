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
    camera.position.x = -20 * CONST;
    camera.position.z = 60 * CONST;

    drawAtoms();
    drawBonds();

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
}

function drawAtoms() {
    // draw atoms
    data.forEach(function (atom) {
        var material = new THREE.MeshBasicMaterial({ color: atomColor(atom.element) });
        var mesh = new THREE.Mesh(new THREE.SphereGeometry( 0.5, 8, 6 ), material);
        mesh.position.set(atom.x * CONST, atom.y * CONST, atom.z * CONST);
        scene.add(mesh);
    });
}

function drawBonds() {
    for (var atom_id in bonds) {
        var origin = bonds[atom_id];
        origin.bonds.forEach(function (bonded_atom) {
            var material = new THREE.MeshBasicMaterial( {color: 'green'} );
            var geometry = new THREE.CylinderGeometry( 0.5, 0.5, 20, 32 );
            geometry.vertices.push(bonded_atom.vector);
            var cylinder = new THREE.Mesh(geometry, material);
            cylinder.position.set(origin.x, origin.y, origin.z);
            scene.add(cylinder);    
        });   
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
            if (atom_one.id !== atom_two.id && checkBond(atom_one, atom_two) && contains(bonds[atom_two.id].bonds, atom_one.id)) {
                bonds[atom_one.id].bonds.push({
                    atomId: atom_two.id,
                    vector: vector
                });
            }
        }
    }
}

function contains(atoms, atom_id) {
    var matches = _.filter(atoms, function(atom){ 
        if (atom.atomId === atom_id) { 
            return atom;
        } 
    });
    return matches;
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
        atom_one.x - atom_two.x,
        atom_one.y - atom_two.y,
        atom_one.z - atom_two.z
    )
}