/***
 * Created by Glen Berseth Feb 5, 2016
 * Created for Project 2 of CPSC314 Introduction to graphics Course.
 */

// Build a visual axis system
function buildAxis( src, dst, colorHex, dashed ) {
        var geom = new THREE.Geometry(),
            mat;

        if(dashed) {
                mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
        } else {
                mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
        }

        geom.vertices.push( src.clone() );
        geom.vertices.push( dst.clone() );
        geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

        var axis = new THREE.Line( geom, mat, THREE.LinePieces );

        return axis;

}
var length = 100.0;
// Build axis visuliaztion for debugging.
x_axis = buildAxis(
	    new THREE.Vector3( 0, 0, 0 ),
	    new THREE.Vector3( length, 0, 0 ),
	    0xFF0000,
	    false
	)
y_axis = buildAxis(
	    new THREE.Vector3( 0, 0, 0 ),
	    new THREE.Vector3( 0, length, 0 ),
	    0x00ff00,
	    false
	)
z_axis = buildAxis(
	    new THREE.Vector3( 0, 0, 0 ),
	    new THREE.Vector3( 0, 0, length ),
	    0x0000FF,
	    false
	)
	
// ASSIGNMENT-SPECIFIC API EXTENSION
THREE.Object3D.prototype.setMatrix = function(a) {
  this.matrix=a;
  this.matrix.decompose(this.position,this.quaternion,this.scale);
}
//ASSIGNMENT-SPECIFIC API EXTENSION
// For use with matrix stack
THREE.Object3D.prototype.setMatrixFromStack = function(a) {
  this.matrix=mvMatrix;
  this.matrix.decompose(this.position,this.quaternion,this.scale);
}

// Data to for the two camera view
var mouseX = 0, mouseY = 0;
var windowWidth, windowHeight;
var views = [
	{
		left: 0,
		bottom: 0,
		width: 0.499,
		height: 1.0,
		background: new THREE.Color().setRGB( 0.1, 0.1, 0.1 ),
		eye: [ 260, 80, 260 ],
		up: [ 0, 1, 0 ],
		fov: 45,
		updateCamera: function ( camera, scene, mouseX, mouseY ) {		}
	},
	{
		left: 0.501,
		bottom: 0.0,
		width: 0.499,
		height: 1.0,
		background: new THREE.Color().setRGB( 0.1, 0.1, 0.1 ),
		eye: [ 200, 50, 200 ],
		up: [ 0, 1, 0 ],
		fov: 45,
		updateCamera: function ( camera, scene, mouseX, mouseY ) {		}
	}
];

//SETUP RENDERER & SCENE
var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
// renderer.setClearColor(0xFFFFFF); // white background colour
canvas.appendChild(renderer.domElement);

function initialCameraPosition() {
	// Creating the two cameras and adding them to the scene.
	var view = views[0];
	camera_MotherShip = new THREE.PerspectiveCamera( view.fov, window.innerWidth / window.innerHeight, 1, 10000 );
	camera_MotherShip.position.x = view.eye[ 0 ];
	camera_MotherShip.position.y = view.eye[ 1 ];
	camera_MotherShip.position.z = view.eye[ 2 ];
	camera_MotherShip.up.x = view.up[ 0 ];
	camera_MotherShip.up.y = view.up[ 1 ];
	camera_MotherShip.up.z = view.up[ 2 ];
	camera_MotherShip.lookAt( scene.position );
	view.camera = camera_MotherShip;
	scene.add(view.camera);

	var view = views[1];
	camera_ScoutShip = new THREE.PerspectiveCamera( view.fov, window.innerWidth / window.innerHeight, 1, 10000 );
	camera_ScoutShip.position.x = view.eye[ 0 ];
	camera_ScoutShip.position.y = view.eye[ 1 ];
	camera_ScoutShip.position.z = view.eye[ 2 ];
	camera_ScoutShip.up.x = view.up[ 0 ];
	camera_ScoutShip.up.y = view.up[ 1 ];
	camera_ScoutShip.up.z = view.up[ 2 ];
	camera_ScoutShip.lookAt( scene.position );
	view.camera = camera_ScoutShip;
	scene.add(view.camera);
	
	selectedCamera = camera_MotherShip;
} initialCameraPosition();

// ADDING THE AXIS DEBUG VISUALIZATIONS
scene.add(x_axis);
scene.add(y_axis);
scene.add(z_axis);


// ADAPT TO WINDOW RESIZE
function resize() {
	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;
  renderer.setSize(window.innerWidth,window.innerHeight);
}

// EVENT LISTENER RESIZE
window.addEventListener('resize',resize);
resize();

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () 
{
     window.scrollTo(0,0);
}

var ambientLight = new THREE.AmbientLight( 0x222222 );
scene.add( ambientLight );

var lights = [];
lights[0] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[0].castShadow = true;

lights[0].position.set( 0, 0, 0 ); // IN THE SUN....

scene.add( lights[0] );

// SETUP HELPER GRID
// Note: Press Z to show/hide
var gridGeometry = new THREE.Geometry();
var i;
for(i=-50;i<51;i+=2) {
    gridGeometry.vertices.push( new THREE.Vector3(i,0,-50));
    gridGeometry.vertices.push( new THREE.Vector3(i,0,50));
    gridGeometry.vertices.push( new THREE.Vector3(-50,0,i));
    gridGeometry.vertices.push( new THREE.Vector3(50,0,i));
}

var gridMaterial = new THREE.LineBasicMaterial({color:0xBBBBBB});
var grid = new THREE.Line(gridGeometry,gridMaterial,THREE.LinePieces);

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////

// Create Solar System Geometry
var sunGeometry = new THREE.SphereGeometry( 10, 32, 32 );
var mercuryGeometry = new THREE.SphereGeometry( 3, 32, 32 );
var venusGeometry = new THREE.SphereGeometry( 3, 32, 32 );
var earthGeometry = new THREE.SphereGeometry( 4, 32, 32 );
var earthMoonGeometry = new THREE.SphereGeometry( 2, 32, 32 );
var marsGeometry = new THREE.SphereGeometry( 3, 32, 32 );
var jupiterGeometry = new THREE.SphereGeometry( 8, 32, 32 );
var saturnGeometry = new THREE.SphereGeometry( 7, 32, 32 );
var saturnRingGeometry = new THREE.RingGeometry( 8, 12, 32 );
var uranusGeometry = new THREE.SphereGeometry( 6, 32, 32 );
var neptuneGeometry = new THREE.SphereGeometry( 5, 32, 32 );
var orbitGeometry = new THREE.SphereGeometry( 3, 1, 1);

// Create Ships Geometry
var motherShipGeometry = new THREE.SphereGeometry( 5, 10, 10 );
var scoutShipGeometry = new THREE.OctahedronGeometry( 5, 0 );

// Material
var whiteMaterial = new THREE.MeshBasicMaterial({ cologtr: 0xffffff });
var sunMaterial = new THREE.MeshBasicMaterial({color: 0xffdd00 });
var mercuryMaterial = new THREE.MeshBasicMaterial({color: 0x745611 });
var venusMaterial = new THREE.MeshBasicMaterial({color: 0x117853 });
var earthMaterial = new THREE.MeshBasicMaterial({color: 0x0e2381 });
var marsMaterial = new THREE.MeshBasicMaterial({color: 0x81270e });
var jupiterMaterial = new THREE.MeshBasicMaterial({color: 0xaf5912 });
var saturnMaterial = new THREE.MeshBasicMaterial({color: 0xf3c88c });
var saturnRingsMaterial = new THREE.MeshBasicMaterial({color: 0xf3c88c, side: THREE.BackSide });
var uranusMaterial = new THREE.MeshBasicMaterial({color: 0x7edaf1 });
var neptuneMaterial = new THREE.MeshBasicMaterial({color: 0x6b7def });
var earthMoonMaterial = new THREE.MeshBasicMaterial({color: 0x9fa3bc });

// Make Objects
var sun = new THREE.Mesh( sunGeometry, sunMaterial );
var sunWire = new THREE.Line( sunGeometry, sunMaterial );

var mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
var mercuryWire = new THREE.Line(mercuryGeometry, mercuryMaterial);
var mercuryOrbit = new THREE.Mesh(orbitGeometry, whiteMaterial);

var venus = new THREE.Mesh(venusGeometry, venusMaterial);
var venusWire = new THREE.Line(venusGeometry, venusMaterial);
var venusOrbit = new THREE.Mesh(orbitGeometry, whiteMaterial);

var earth = new THREE.Mesh(earthGeometry, earthMaterial);
var earthWire = new THREE.Line(earthGeometry, earthMaterial);
var earthOrbit = new THREE.Mesh(orbitGeometry, whiteMaterial);

var earthMoon  = new THREE.Mesh(earthMoonGeometry, earthMoonMaterial);
var earthMoonWire = new THREE.Line(earthMoonGeometry,earthMoonMaterial);
var earthMoonOrbit = new THREE.Mesh(orbitGeometry, whiteMaterial);

var mars = new THREE.Mesh(marsGeometry, marsMaterial);
var marsWire = new THREE.Line(marsGeometry, marsMaterial);
var marsOrbit = new THREE.Mesh(orbitGeometry, whiteMaterial);

var jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
var jupiterWire = new THREE.Line(jupiterGeometry, jupiterMaterial);
var jupiterOrbit = new THREE.Mesh(orbitGeometry, whiteMaterial);

var saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
var saturnWire = new THREE.Line(saturnGeometry, saturnMaterial);
var saturnOrbit = new THREE.Mesh(orbitGeometry, whiteMaterial);
var saturnRings = new THREE.Mesh( saturnRingGeometry, saturnRingsMaterial );

var uranus = new THREE.Mesh(uranusGeometry, uranusMaterial);
var uranusWire = new THREE.Line(uranusGeometry, uranusMaterial);
var uranusOrbit = new THREE.Mesh(orbitGeometry, whiteMaterial);

var neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial);
var neptuneWire = new THREE.Line(neptuneGeometry, neptuneMaterial);
var neptuneOrbit = new THREE.Mesh(orbitGeometry, whiteMaterial);

var motherShip = new THREE.Mesh(motherShipGeometry, whiteMaterial);
var scoutShip = new THREE.Mesh(scoutShipGeometry, whiteMaterial);

// Orbit Line Generator
var Orbit = function(r) {
	this.radius = r;
	this.draw = function(scene) {
		var orbitGeometry = new THREE.Geometry();
		var orbitMaterial = new THREE.LineBasicMaterial({color: 0xBBBBBB})
		for (var i = 0; i < 1000; i++) {
			var vertex = new THREE.Vector3();
			vertex.x = Math.sin(Math.PI/180*i)*this.radius;
			vertex.z = Math.cos(Math.PI/180*i)*this.radius;
			orbitGeometry.vertices.push(vertex);
		}
		var orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
		scene.add(orbitLine);
	}
}

// Move Planets To Initial Position
mercury.translateX(20);
mercuryWire.translateX(20);
venus.translateX(40);
venusWire.translateX(40);
earth.translateX(60);
earthWire.translateX(60);
mars.translateX(80);
marsWire.translateX(80);
jupiter.translateX(100);
jupiterWire.translateX(100);
saturn.translateX(120);
saturnWire.translateX(120);
saturnRings.rotateX(1.57);
uranus.translateX(140);
uranusWire.translateX(140);
neptune.translateX(160);
neptuneWire.translateX(160);

// Add to Scene
scene.add(sun);
// scene.add(sunWire); 

scene.add(mercury);
// scene.add(mercuryWire);
scene.add(mercuryOrbit);
var mercuryLine = new Orbit(20);
mercuryLine.draw(scene);

scene.add(venus);
// scene.add(venusWire);
scene.add(venusOrbit);
var venusLine = new Orbit(40);
venusLine.draw(scene);

scene.add(earth);
// scene.add(earthWire);
scene.add(earthOrbit);
var earthLine = new Orbit(60);
earthLine.draw(scene);

earth.add(earthMoon);
// earth.add(earthMoonWire);
earth.add(earthMoonOrbit);
var earthMoonLine = new Orbit(10);
earthMoonLine.draw(earth);

scene.add(mars);
// scene.add(marsWire);
scene.add(marsOrbit);
var marsLine = new Orbit(80);
marsLine.draw(scene);

scene.add(jupiter);
// scene.add(jupiterWire);
scene.add(jupiterOrbit);
var jupiterLine = new Orbit(100);
jupiterLine.draw(scene);

scene.add(saturn);
// scene.add(saturnWire);
scene.add(saturnOrbit);
saturn.add(saturnRings);
var saturnLine = new Orbit(120);
saturnLine.draw(scene);

scene.add(uranus);
// scene.add(uranusWire);
scene.add(uranusOrbit);
var uranusLine = new Orbit(140);
uranusLine.draw(scene);

scene.add(neptune);
// scene.add(neptuneWire);
scene.add(neptuneOrbit);
var neptuneLine = new Orbit(160);
neptuneLine.draw(scene);

// Manage Hierarchies
mercuryOrbit.add(mercury);
// mercuryOrbit.add(mercuryWire);
venusOrbit.add(venus);
// venusOrbit.add(venusWire);
earthOrbit.add(earth);
// earthOrbit.add(earthWire);
earth.add(earthMoonOrbit);
earthMoonOrbit.add(earthMoon);
// earthMoonOrbit.add(earthMoonWire);
earthMoon.translateX(10);
earthMoonWire.translateX(10);
marsOrbit.add(mars);
// marsOrbit.add(marsWire);
jupiterOrbit.add(jupiter);
// jupiterOrbit.add(jupiterWire);
saturnOrbit.add(saturn);
// saturnOrbit.add(saturnWire);
saturn.add(saturnRings);
uranusOrbit.add(uranus);
// uranusOrbit.add(uranusWire);
neptuneOrbit.add(neptune);
// neptuneOrbit.add(neptuneWire);
scene.add(motherShip);
scene.add(scoutShip);

// Different States
var clock = new THREE.Clock(true);
var keyboard = new THREEx.KeyboardState();
var DELTA = 10;
var paused = false;
var gridState = false;
var absLookatEnabled = false;
var relativeFlying = false;
var geosynchronousOrbit = false;
var forwardBackwardMouse = false;
var isMotherShip = true;
var isScoutShip = false;
var mouseX = 0, mouseY = 0, mouseDown = false;
var selectedCamera = camera_MotherShip;
var planet;

function updateSystem() {
	if (!paused) { 
	// Create Axis Rotations
  	sun.rotateY(0.01);
		mercury.rotateY(0.01);
		venus.rotateY(0.01);
		earth.rotateY(0.01);
		mars.rotateY(0.01);
		jupiter.rotateY(0.01);
		saturn.rotateY(0.01);
		uranus.rotateY(0.01);
		neptune.rotateY(0.01);
	
		// Create Orbits
		mercuryOrbit.rotateY(0.03);
		venusOrbit.rotateY(0.04);
		earthOrbit.rotateY(0.045);
		marsOrbit.rotateY(0.035);
		jupiterOrbit.rotateY(0.02);
		saturnOrbit.rotateY(0.05);
		uranusOrbit.rotateY(0.015);
		neptuneOrbit.rotateY(0.025);
		earthMoonOrbit.rotateY(0.01);
	}

	motherShip.position.x = camera_MotherShip.position.x;
  motherShip.position.y = camera_MotherShip.position.y;
  motherShip.position.z = camera_MotherShip.position.z;
  scoutShip.position.x = camera_ScoutShip.position.x;
  scoutShip.position.y = camera_ScoutShip.position.y;
  scoutShip.position.z = camera_ScoutShip.position.z;
}

// LISTEN TO MOUSE
function onMouseMove(event) {
    if (!mouseDown) { return; }

    var deltaX = event.clientX - mouseX;
    var deltaY = event.clientY - mouseY;
    mouseX = event.clientX;
    mouseY = event.clientY;

    if (relativeFlying && !forwardBackwardMouse) { rotateScene(deltaX, deltaY); }
    else if (relativeFlying && forwardBackwardMouse) { zoomScene(deltaY); }
    else if (geosynchronousOrbit && forwardBackwardMouse) { zoomScene(deltaY); }
}

function onMouseDown(event) {
		mouseDown = true;
    mouseX = event.clientX;
    mouseY = event.clientY;
}

function onMouseUp(event) {
		mouseDown = false;
}

function rotateScene(deltaX, deltaY) {
    selectedCamera.rotateY(-deltaX * Math.PI / 180);
		selectedCamera.rotateX(-deltaY * Math.PI / 180);
}

function zoomScene(deltaY) {
		selectedCamera.translateZ(deltaY);
}

// LISTEN TO KEYBOARD
function onKeyDown(event) { 
	// OVERALL KEYS
	if(keyboard.eventMatches(event,"shift+g")) {  // Reveal/Hide Helper Grid
    gridState = !gridState;
    gridState? scene.add(grid) : scene.remove(grid);
  } else if(keyboard.eventMatches(event, "space")) {  // Pause/Resume Animation
	 	paused = !paused;
  } else if(keyboard.eventMatches(event, "o")) {  // Select Mothership
    isMotherShip = true;
	  isScoutShip = false;
	  selectedCamera = camera_MotherShip; 
  } else if(keyboard.eventMatches(event, "p")) {  // Select Scoutship
	  isScoutShip = true;
	  isMotherShip = false;
	  selectedCamera = camera_ScoutShip;
  } else if (keyboard.eventMatches(event, "m")) {
  	initialCameraPosition();
  } else if(keyboard.eventMatches(event, "r")) { // Relative Flying
  	initialCameraPosition();
  	if (absLookatEnabled) { absLookatEnabled = !absLookatEnabled; }
  	else if (geosynchronousOrbit) { geosynchronousOrbit = !geosynchronousOrbit; }
  	relativeFlying = !relativeFlying;
  	if(selectedCamera == camera_MotherShip) {
    scene.remove(motherShip);
    scene.add(motherShip);
    motherShip.position.x = 260;
    motherShip.position.y = 80;
    motherShip.position.z = 260;
   } else {
    scene.remove(scoutShip);
    scene.add(scoutShip);
    scoutShip.position.x = 200;
    scoutShip.position.y = 50;
    scoutShip.position.z = 200;
   }
   selectedCamera.remove(motherShip);
   selectedCamera.remove(scoutShip);
   planet.remove(motherShip);
   planet.remove(scoutShip);
  } else if (keyboard.eventMatches(event, "l")) {  // Absolute Lookout
  	initialCameraPosition();
    if (relativeFlying) { relativeFlying = !relativeFlying; }
    else if (geosynchronousOrbit) { geosynchronousOrbit = !geosynchronousOrbit; }
	 	absLookatEnabled = !absLookatEnabled;
	 	if(selectedCamera == camera_MotherShip) {
    scene.remove(motherShip);
    scene.add(motherShip);
    motherShip.position.x = 260;
    motherShip.position.y = 80;
    motherShip.position.z = 260;
   } else {
    scene.remove(scoutShip);
    scene.add(scoutShip);
    scoutShip.position.x = 200;
    scoutShip.position.y = 50;
    scoutShip.position.z = 200;
   }
   selectedCamera.remove(motherShip);
   selectedCamera.remove(scoutShip);
   planet.remove(motherShip);
   planet.remove(scoutShip);
  } else if (keyboard.eventMatches(event, "g")) { // Geosynchronous Orbit
  	initialCameraPosition();
  	if (absLookatEnabled) { absLookatEnabled = !absLookatEnabled; }
  	else if (relativeFlying) { relativeFlying = !relativeFlying; }
  	geosynchronousOrbit = !geosynchronousOrbit;
  	if(selectedCamera == camera_MotherShip) {
    scene.remove(motherShip);
    scene.add(motherShip);
    motherShip.position.x = 260;
    motherShip.position.y = 80;
    motherShip.position.z = 260;
   } else {
    scene.remove(scoutShip);
    scene.add(scoutShip);
    scoutShip.position.x = 200;
    scoutShip.position.y = 50;
    scoutShip.position.z = 200;
   }
   selectedCamera.remove(motherShip);
   selectedCamera.remove(scoutShip);
   planet.remove(motherShip);
   planet.remove(scoutShip);
  } else if(keyboard.eventMatches(event, "t")) { // True Hold
	 	forwardBackwardMouse = true;
  }

	if (geosynchronousOrbit) { // GEOSYNCHRONOUS KEYS 
	  if (keyboard.eventMatches(event, "1")) {
	  	planet = mercury;
	    planet.add(selectedCamera);
      if (selectedCamera == camera_MotherShip) { planet.add(motherShip); } 
    	else { planet.add(scoutShip); }
      selectedCamera.position.z = planet.position.z;
			selectedCamera.position.x = planet.position.x+1;
			selectedCamera.position.y = planet.position.y;
			selectedCamera.lookAt(planet.position);
	    hasChild = true;
	  } else if (keyboard.eventMatches(event, "2")) {
	  	planet = venus;
	    planet.add(selectedCamera);
	    if (selectedCamera == camera_MotherShip) { planet.add(motherShip); } 
    	else { planet.add(scoutShip); }
      selectedCamera.position.z = planet.position.z;
			selectedCamera.position.x = planet.position.x+1;
			selectedCamera.position.y = planet.position.y;
			selectedCamera.lookAt(planet.position);
	    hasChild = true;
	  } else if (keyboard.eventMatches(event, "3")) {
	  	planet = earth;
	    planet.add(selectedCamera);
	    if (selectedCamera == camera_MotherShip) { planet.add(motherShip); } 
    	else { planet.add(scoutShip); }
      selectedCamera.position.z = planet.position.z;
			selectedCamera.position.x = planet.position.x+1;
			selectedCamera.position.y = planet.position.y;
			selectedCamera.lookAt(planet.position);
	    hasChild = true;
	  } else if (keyboard.eventMatches(event, "4")) {
	  	planet = mars;
	    planet.add(selectedCamera);
	    if (selectedCamera == camera_MotherShip) { planet.add(motherShip); } 
    	else { planet.add(scoutShip); }
      selectedCamera.position.z = planet.position.z;
			selectedCamera.position.x = planet.position.x+1;
			selectedCamera.position.y = planet.position.y;
			selectedCamera.lookAt(planet.position);
	    hasChild = true;
	  } else if (keyboard.eventMatches(event, "5")) {
	  	planet = jupiter;
	    planet.add(selectedCamera);
	    if (selectedCamera == camera_MotherShip) { planet.add(motherShip); } 
    	else { planet.add(scoutShip); }
      selectedCamera.position.z = planet.position.z;
			selectedCamera.position.x = planet.position.x+1;
			selectedCamera.position.y = planet.position.y;
			selectedCamera.lookAt(planet.position);
	    hasChild = true;
	  } else if (keyboard.eventMatches(event, "6")) {
	  	planet = saturn;
	    planet.add(selectedCamera);
	    if (selectedCamera == camera_MotherShip) { planet.add(motherShip); } 
    	else { planet.add(scoutShip); }
      selectedCamera.position.z = planet.position.z;
			selectedCamera.position.x = planet.position.x+1;
			selectedCamera.position.y = planet.position.y;
			selectedCamera.lookAt(planet.position);
	    hasChild = true;
	  } else if (keyboard.eventMatches(event, "7")) {
	  	planet = uranus;
	    planet.add(selectedCamera);
	    if (selectedCamera == camera_MotherShip) { planet.add(motherShip); } 
    	else { planet.add(scoutShip); }
      selectedCamera.position.z = planet.position.z;
			selectedCamera.position.x = planet.position.x+1;
			selectedCamera.position.y = planet.position.y;
			selectedCamera.lookAt(planet.position);
	    hasChild = true;
	  } else if (keyboard.eventMatches(event, "8")) {
	  	planet = neptune;
	    planet.add(selectedCamera);
	    if (selectedCamera == camera_MotherShip) { planet.add(motherShip); } 
    	else { planet.add(scoutShip); }
      selectedCamera.position.z = planet.position.z;
			selectedCamera.position.x = planet.position.x+1;
			selectedCamera.position.y = planet.position.y;
			selectedCamera.lookAt(planet.position);
	    hasChild = true;
	  } else if (keyboard.eventMatches(event, "shift+w")) { // Move Backward
		  selectedCamera.translateZ(DELTA);
	  } else if (keyboard.eventMatches(event, "w")) { // Move Forward
		  selectedCamera.translateZ(-DELTA);
	  } else if (keyboard.eventMatches(event, "shift+k")) {
	  	if (DELTA <= 10) { DELTA = 10; }
		  else { DELTA -= 10; }
	  } else if (keyboard.eventMatches(event, "k")) {
		  DELTA += 10;
	  }
	}

	else if (relativeFlying) { // RELATIVE FLYING
   	if (keyboard.eventMatches(event, "shift+q")) {  // Yaw Right
	 		selectedCamera.rotateY(-DELTA * Math.PI / 180);
  	} else if (keyboard.eventMatches(event, "q")) {  // Yaw Left
	 		selectedCamera.rotateY(DELTA * Math.PI / 180);
		} else if (keyboard.eventMatches(event, "shift+s")) {  // Pitch Down
	 		selectedCamera.rotateX(DELTA * Math.PI / 180);
  	} else if (keyboard.eventMatches(event, "s")) {  // Pitch Up 
	 		selectedCamera.rotateX(-DELTA * Math.PI / 180);
  	} else if (keyboard.eventMatches(event, "shift+a")) {  // Roll Left
	 		selectedCamera.rotateZ(-DELTA * Math.PI / 180);
  	} else if (keyboard.eventMatches(event, "a")) {  // Roll Right
	 		selectedCamera.rotateZ(DELTA * Math.PI / 180);
  	}else if (keyboard.eventMatches(event, "shift+w")) { // Move Backward
	  	selectedCamera.translateZ(DELTA);
  	} else if (keyboard.eventMatches(event, "w")) { // Move Forward
	  	selectedCamera.translateZ(-DELTA);
  	} else if (keyboard.eventMatches(event, "shift+k")) {
	  	if (DELTA <= 10) { DELTA = 10; }
		  else { DELTA -= 10; }
	  } else if (keyboard.eventMatches(event, "k")) {
		  DELTA += 10;
	  }
	}

  else if (absLookatEnabled) { // ABSOLUTE LOOKOUT 
	  if (keyboard.eventMatches(event, "shift+x")) {	
	  	selectedCamera.position.x -= DELTA;
	  } else if (keyboard.eventMatches(event, "x")) {
	  	selectedCamera.position.x += DELTA;
	  } else if (keyboard.eventMatches(event, "shift+y")) {
		 	selectedCamera.position.y -= DELTA;
	  } else if (keyboard.eventMatches(event, "y")) {
		 	selectedCamera.position.y += DELTA;
	  } else if (keyboard.eventMatches(event, "shift+z")) {
		 	selectedCamera.position.z -= DELTA;
	  } else if (keyboard.eventMatches(event, "z")) {
		 	selectedCamera.position.z += DELTA;
	  } else if (keyboard.eventMatches(event, "shift+a")) {
		 	var deltaX = scene.position.getComponent(0) - DELTA;
		 	selectedCamera.lookAt( scene.position.setX(deltaX) );
	  } else if (keyboard.eventMatches(event, "a")) {
		 	var deltaX = scene.position.getComponent(0) + DELTA;
		 	selectedCamera.lookAt( scene.position.setX(deltaX) );
	  } else if (keyboard.eventMatches(event, "shift+b")) {
		 	var deltaY = scene.position.getComponent(1) - DELTA;
		 	selectedCamera.lookAt( scene.position.setY(deltaY) );
	  } else if (keyboard.eventMatches(event, "b")) {
		 	var deltaY = scene.position.getComponent(1) + DELTA;
		 	selectedCamera.lookAt( scene.position.setY(deltaY) );
	  } else if (keyboard.eventMatches(event, "shift+c")) {
     	var deltaZ = scene.position.getComponent(2) - DELTA;
     	selectedCamera.lookAt( scene.position.setZ(deltaZ) );
    } else if (keyboard.eventMatches(event, "c")) {
     	var deltaZ = scene.position.getComponent(2) + DELTA;
     	selectedCamera.lookAt( scene.position.setZ(deltaZ) );
    } else if (keyboard.eventMatches(event, "shift+d")) {
		 	selectedCamera.up.x -= DELTA;
	  } else if (keyboard.eventMatches(event, "d")) {
		 	selectedCamera.up.x += DELTA;
	  } else if (keyboard.eventMatches(event, "shift+e")) {
		 	selectedCamera.up.y -= DELTA;
	  } else if (keyboard.eventMatches(event, "e")) {
		 	selectedCamera.up.y += DELTA;
	  } else if (keyboard.eventMatches(event, "shift+f")) {
		 	selectedCamera.up.z -= DELTA;
	  } else if (keyboard.eventMatches(event, "f")){
		 	selectedCamera.up.z += DELTA;
	  } else if (keyboard.eventMatches(event, "shift+k")) {
	  	if (DELTA <= 10) { DELTA = 10; }
		  else { DELTA -= 10; }
	  } else if (keyboard.eventMatches(event, "k")) {
		  DELTA += 10;
	  }
	} 
}

function onKeyUp(event) {
	if (keyboard.eventMatches(event, "t")) {
		forwardBackwardMouse = false;
	}
}

canvas.addEventListener('mousemove', onMouseMove );
canvas.addEventListener('mousedown', onMouseDown );
canvas.addEventListener('mouseup', onMouseUp );

keyboard.domElement.addEventListener('keydown', onKeyDown );
keyboard.domElement.addEventListener('keyup', onKeyUp );

// SETUP UPDATE CALL-BACK
// Hint: It is useful to understand what is being updated here, the effect, and why.
// DON'T TOUCH THIS
function update() {
  updateSystem();

  requestAnimationFrame(update);
  
  // UPDATES THE MULTIPLE CAMERAS IN THE SIMULATION
  for ( var ii = 0; ii < views.length; ++ii ) 
  {

		view = views[ii];
		camera_ = view.camera;

		view.updateCamera( camera_, scene, mouseX, mouseY );

		var left   = Math.floor( windowWidth  * view.left );
		var bottom = Math.floor( windowHeight * view.bottom );
		var width  = Math.floor( windowWidth  * view.width );
		var height = Math.floor( windowHeight * view.height );
		renderer.setViewport( left, bottom, width, height );
		renderer.setScissor( left, bottom, width, height );
		renderer.enableScissorTest ( true );
		renderer.setClearColor( view.background );

		camera_.aspect = width / height;
		camera_.updateProjectionMatrix();

		renderer.render( scene, camera_ );
	}
}

update();