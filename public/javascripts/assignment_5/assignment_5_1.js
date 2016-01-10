// script for assignment five

var data, 
    camera, 
    scene, 
    renderer,
    flyControls,
    clock,
    light,
    bonds = {};

// constants
var BOND_DISTANCE   = 1.9,
    ATOM_RADIUS     = 0.5,
    CYL_RAD_TOP     = 0.1,
    CYL_RAD_BOTTOM  = 0.1,
    CAM_POS_X       = -50,
    CAM_POS_Y       = 0,
    CAM_POS_Z       = 30,
    SCENE_WIDTH     = 1024,
    SCENE_HEIGHT    = 600,
    FOG_COLOR       = 0xecf0f1,
    FOG_NEAR        = 5,
    FOG_FAR         = 70,
    LIGHT_POS_X     = -60,
    LIGHT_POS_Y     = 5,
    LIGHT_POS_Z     = 23;
    LIGHT2_POS_X     = -50,
    LIGHT2_POS_Y     = 2,
    LIGHT2_POS_Z     = 13;


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
    data = rows; 
    init();
    renderScene();
});

function init() {
    findBonds();
    
    clock = new THREE.Clock();
	scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(100, SCENE_WIDTH / SCENE_HEIGHT, 0.1, 1000);
    camera.position.set(CAM_POS_X, CAM_POS_Y, CAM_POS_Z);

    drawAtoms();
    drawBonds();

    // set up camera fly controls (W A S D etc. + arrows)
    flyControls = new THREE.FlyControls(camera);
    flyControls.movementSpeed = 20;
    flyControls.rollSpeed     = (Math.PI/2);
    flyControls.yawSpeed      = (Math.PI/2);
    flyControls.pitchSpeed    = (Math.PI/2);
    flyControls.dragToLook    = true;

    var sphere = new THREE.SphereGeometry( 0.1, 16, 8 );

    light = new THREE.PointLight( 0xffffff, 5, 20 );
    light.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) );
    scene.add( light );

    light2 = new THREE.PointLight( 0xffffff, 5, 20 );
    light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) );
    scene.add( light2 );


    renderer = new THREE.WebGLRenderer();
    renderer.setSize(SCENE_WIDTH, SCENE_HEIGHT);

    var container = document.getElementById('scene');
    container.style.width = SCENE_WIDTH + 'px';
    container.appendChild(renderer.domElement);
}

function drawAtoms() {

    var map = THREE.ImageUtils.loadTexture( '/images/molecule_texture.jpg' );
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 16;

    // draw atoms
    data.forEach(function (atom) {
        var material = new THREE.MeshLambertMaterial({ 
            color: atomColor(atom.element),
            map: map
        });
        var mesh = new THREE.Mesh(new THREE.SphereGeometry(ATOM_RADIUS, 8, 8 ), material);
        mesh.position.set(atom.x, atom.y, atom.z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
    });
}

function drawBonds() {
    for (var atom_id in bonds) {
        var origin = bonds[atom_id];
        
        for (var i = 0; i < origin.bonds.length; i++) {
            
            var material = new THREE.MeshLambertMaterial({ color: 'green' });
            var bond_atom = origin.bonds[i];
            var fromPoint = new THREE.Vector3(origin.atom.x, origin.atom.y, origin.atom.z);
            var toPoint = new THREE.Vector3(bond_atom.x, bond_atom.y, bond_atom.z);
            
            var cylinderBondMesh = cylinderMesh(fromPoint, toPoint, material);
            cylinderBondMesh.castShadow = true;
            cylinderBondMesh.receiveShadow = true;

            scene.add(cylinderBondMesh);
        }
    }
}

function renderScene() {
    var time = Date.now() * 0.0005;

    flyControls.update(clock.getDelta());

    light.position.x = LIGHT_POS_X + Math.sin( time * 0.5 ) * 3;
    light.position.y = LIGHT_POS_Y + Math.cos( time * 0.5 ) * 4;
    light.position.z = LIGHT_POS_Z + Math.cos( time * 0.5 ) * 3;

    light2.position.x = LIGHT2_POS_X + Math.sin( time * 0.5 ) * 3;
    light2.position.y = LIGHT2_POS_Y + Math.cos( time * 0.5 ) * 4;
    light2.position.z = LIGHT2_POS_Z + Math.cos( time * 0.5 ) * 3;

    requestAnimationFrame(renderScene);
    renderer.render(scene, camera);
}

// taken from here http://stackoverflow.com/a/28459704/1869608
function cylinderMesh(pointX, pointY, material) {
    var direction = new THREE.Vector3().subVectors(pointY, pointX);
    var orientation = new THREE.Matrix4();
    
    orientation.lookAt(pointX, pointY, new THREE.Object3D().up);
    orientation.multiply(new THREE.Matrix4().set(1, 0, 0, 0,
        0, 0, 1, 0,
        0, -1, 0, 0,
        0, 0, 0, 1));

    var edgeGeometry = new THREE.CylinderGeometry(CYL_RAD_TOP, CYL_RAD_BOTTOM, direction.length());

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
    return distance < BOND_DISTANCE;
}