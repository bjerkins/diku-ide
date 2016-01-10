var data, 
    camera, 
    scene, 
    renderer,
    flyControls,
    clock;

var axial_plane,
    coronal_plane,
    sagittal_plane;

var SCENE_WIDTH  = 512;
var SCENE_HEIGHT = 512;

var IMG_WIDTH  = 256;
var IMG_HEIGHT = 256;

var MAX_SLICE = 256;

var slice_x = 128;
var slice_y = 128;
var slice_z = 128;

init();
renderScene();

function init() {
    clock = new THREE.Clock();
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(100, SCENE_WIDTH / SCENE_HEIGHT, 0.1, 1000);
    camera.position.set(30, 30, 250);
    scene.add(camera);

    coronal_plane = {mesh:initPlane({x:0, y:0, z:0}), 
                     axis:"coronal_stack",
                     normal:{x:0, y:0, z:-1}};
    updatePlaneImage(coronal_plane, slice_z);

    axial_plane = {mesh:initPlane({x:Math.PI / 2, y:0, z:0}), 
                   axis:"axial_stack",
                   normal:{x:0, y:1, z:0}};
    updatePlaneImage(axial_plane, slice_y);

    sagittal_plane = {mesh:initPlane({x:0, y:Math.PI / 2, z:0}), 
                      axis:"sagittal_stack",
                      normal:{x:1, y:0, z:0}};
    updatePlaneImage(sagittal_plane, slice_x);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(SCENE_WIDTH, SCENE_HEIGHT);

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enablePan = false;
    controls.target.set( 0, 0, 0 ); // view direction perpendicular to XY-plane
        
    d3.select("#scene").style("width", SCENE_WIDTH + "px");
    document.getElementById("scene").appendChild(renderer.domElement);

    $(document).keydown(function(e) {
        switch(e.which) {
            case 37: // left
            slice_x = changeSlice(slice_x,-1);
            updatePlaneImage(sagittal_plane, slice_x);
            break;

            case 39: // right
            slice_x = changeSlice(slice_x,1);
            updatePlaneImage(sagittal_plane, slice_x);
            break;

            case 38: // up
            slice_y = changeSlice(slice_y,1);
            updatePlaneImage(axial_plane, slice_y);
            break;

            case 40: // down
            slice_y = changeSlice(slice_y,-1);
            updatePlaneImage(axial_plane, slice_y);
            break;

            case 83: // s
            slice_z = changeSlice(slice_z,-1);
            updatePlaneImage(coronal_plane, slice_z);
            break;

            case 87: // w
            slice_z = changeSlice(slice_z,1);
            updatePlaneImage(coronal_plane, slice_z);
            break;

            default: return;
        }
        e.preventDefault();
    });
}

function renderScene() {
    requestAnimationFrame(renderScene);
    renderer.render(scene, camera);
}

function initPlane(rotation) {
    var material = new THREE.MeshBasicMaterial({});
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(IMG_WIDTH, IMG_HEIGHT),material);
    
    plane.rotation.x = rotation.x;
    plane.rotation.y = rotation.y;
    plane.rotation.z = rotation.z;    

    scene.add(plane);

    return plane;
}

function updatePlaneImage(plane, slice) {
    if (slice > MAX_SLICE) {
        slice = MAX_SLICE;
    } else if (slice < 1) {
        slice = 1;
    }

    var slice_nr = ("00" + slice).slice(-3);
    var loader = new THREE.TextureLoader();

    loader.load(
        // resource URL
        '/javascripts/assignment_5/data/' + plane.axis + '/slice_' + slice_nr + '.png',
        // Function when resource is loaded
        function ( texture ) {
            var material = new THREE.MeshBasicMaterial( {
                map: texture
            } );
            material.side = THREE.DoubleSide;
            material.map.needsUpdate = true;
            plane.mesh.material = material;

        }
    );

    plane.mesh.position.x = plane.normal.x * (slice - IMG_WIDTH / 2);
    plane.mesh.position.y = plane.normal.y * (slice - IMG_WIDTH / 2);
    plane.mesh.position.z = plane.normal.z * (slice - IMG_WIDTH / 2);

    updateInfoText()
}

function updateInfoText() {
    var str = "Coronal slice = " + slice_z + " <br>" +
              "Axial slice = " + slice_y + " <br>" +
              "Sagittal slice = " + slice_x + "";
    $("#info").html(str);
}

function changeSlice(slice, inc) {
    slice += inc;
    if (slice > MAX_SLICE) {
        slice = MAX_SLICE;
    } else if (slice < 1) {
        slice = 1;
    }
    return slice;
}