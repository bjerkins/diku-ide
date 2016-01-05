// script for assignment five

var data, camera, scene, renderer, bonds = {};

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
    animate();
});


// expects 'data' to have been initialized
function init() {
	scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    geometry = new THREE.BoxGeometry(200, 200, 200);
    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    findBonds();
}

function animate() {
    requestAnimationFrame(animate);

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    renderer.render(scene, camera);
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