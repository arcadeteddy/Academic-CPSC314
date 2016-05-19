// UBC CPSC 314 (2015W2) -- P1
// HAVE FUN!!! :)

// ASSIGNMENT-SPECIFIC API EXTENSION
THREE.Object3D.prototype.setMatrix = function(a) {
	this.matrix=a;
	this.matrix.decompose(this.position,this.quaternion,this.scale);
}

// SETUP RENDERER & SCENE
var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xFFFFFF); // background colour
canvas.appendChild(renderer.domElement);

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30,1,0.1,1000); // view angle, aspect ratio, near, far
camera.position.set(100,0,0);
camera.lookAt(scene.position);
scene.add(camera);

// SETUP ORBIT CONTROLS OF THE CAMERA
var controls = new THREE.OrbitControls(camera);

// ADAPT TO WINDOW RESIZE
function resize() {
	renderer.setSize(window.innerWidth,window.innerHeight);
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();
}

// EVENT LISTENER RESIZE
window.addEventListener('resize',resize);
resize();

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
		 window.scrollTo(0,0);
	 }

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

// MATERIALS
// Note: Feel free to be creative with this! 
var normalMaterial = new THREE.MeshNormalMaterial();
var insideGreyColor = new THREE.MeshLambertMaterial({ color: 0x343036, opacity: 1.0, wireframe: false });
var outsideGreyColor = new THREE.MeshLambertMaterial({ color: 0x413C43, opacity: 1.0, wireframe: false });
var clawColor = new THREE.MeshPhongMaterial({ color: 0xEBC680, opacity: 1.0, wireframe: false });
var noseColor = new THREE.MeshPhongMaterial({ color: 0xB25A61, opacity: 1.0, wireframe: false });
var tentacleColor = new THREE.MeshPhongMaterial({ color: 0xB46462, opacity: 1.0, wireframe: false });
var groundColor = new THREE.MeshLambertMaterial({ color: 0x888888, opacity: 1.0, wireframe: false });

// function drawCube()
// Draws a unit cube centered about the origin.
// Note: You will be using this for all of your geometry
function makeCube() {
	var unitCube = new THREE.BoxGeometry(1,1,1);
	return unitCube;
}

// GEOMETRY
var environmentGeometry = makeCube();
var non_uniform_scale = new THREE.Matrix4().set(30,0,0,0, 0,10,0,0, 0,0,30,0, 0,0,0,1);
environmentGeometry.applyMatrix(non_uniform_scale);
var spotLight1 = new THREE.SpotLight( 0xffffff );
var spotLight2 = new THREE.SpotLight( 0xffffff );

// Torso Geometry
var torsoGeometry = makeCube();
var non_uniform_scale = new THREE.Matrix4().set(5,0,0,0, 0,5,0,0, 0,0,8,0, 0,0,0,1);
torsoGeometry.applyMatrix(non_uniform_scale);
var torsoOutsideZGeometry = makeCube();
var non_uniform_scale = new THREE.Matrix4().set(4,0,0,0, 0,4,0,0, 0,0,9,0, 0,0,0,1);
torsoOutsideZGeometry.applyMatrix(non_uniform_scale);
var torsoOutsideXGeometry = makeCube();
var non_uniform_scale = new THREE.Matrix4().set(6,0,0,0, 0,4,0,0, 0,0,7,0, 0,0,0,1);
torsoOutsideXGeometry.applyMatrix(non_uniform_scale);
var torsoOutsideYGeometry = makeCube();
var non_uniform_scale = new THREE.Matrix4().set(4,0,0,0, 0,6,0,0, 0,0,7,0, 0,0,0,1);
torsoOutsideYGeometry.applyMatrix(non_uniform_scale);
// Head Geometry
var headGeometry = makeCube();
var non_uniform_scale = new THREE.Matrix4().set(4,0,0,0, 0,4,0,0, 0,0,4,0, 0,0,0,1);
headGeometry.applyMatrix(non_uniform_scale);
var headOutsideXGeometry = makeCube();
var non_uniform_scale = new THREE.Matrix4().set(5,0,0,0, 0,3,0,0, 0,0,3,0, 0,0,0,1);
headOutsideXGeometry.applyMatrix(non_uniform_scale);
var headOutsideYGeometry = makeCube();
var non_uniform_scale = new THREE.Matrix4().set(3,0,0,0, 0,5,0,0, 0,0,3,0, 0,0,0,1);
headOutsideYGeometry.applyMatrix(non_uniform_scale);
var headOutsideZGeometry = makeCube();
var non_uniform_scale = new THREE.Matrix4().set(3,0,0,0, 0,3,0,0, 0,0,6,0, 0,0,0,1);
headOutsideZGeometry.applyMatrix(non_uniform_scale);
// Nose Geometry
var noseGeometry = makeCube();
var non_uniform_scale = new THREE.Matrix4().set(3.5,0,0,0, 0,2,0,0, 0,0,1,0, 0,0,0,1);
noseGeometry.applyMatrix(non_uniform_scale);
// Small Tentacles Geometry
var smallTentacleGeometry = makeCube();
var smallTentacleRight = new THREE.Matrix4().set(0.25,0,0,-0.2, 0,0.25,0,0, 0,0,1.5,0, 0,0,0,1);
smallTentacleGeometry.applyMatrix(smallTentacleRight);
var smallTentacleLeftGeometry = makeCube();
var smallTentacleLeft = new THREE.Matrix4().set(0.25,0,0,0.2, 0,0.25,0,0, 0,0,1.5,0, 0,0,0,1);
smallTentacleLeftGeometry.applyMatrix(smallTentacleLeft);
THREE.GeometryUtils.merge(smallTentacleGeometry,smallTentacleLeftGeometry);
// Tentacles Geomertry
var tentaclesGeometry = makeCube();
var non_uniform_scale = new THREE.Matrix4().set(0.25,0,0,0, 0,0.25,0,0, 0,0,2,0, 0,0,0,1);
tentaclesGeometry.applyMatrix(non_uniform_scale);
var tentaclesRightGeometry = makeCube();
var tentaclesRightScale = new THREE.Matrix4().set(0.25,0,0,-0.35, 0,0.25,0,0, 0,0,2,0, 0,0,0,1);
tentaclesRightGeometry.applyMatrix(tentaclesRightScale);
var tentaclesLeftGeometry = makeCube();
var tentaclesLeftScale = new THREE.Matrix4().set(0.25,0,0,0.35, 0,0.25,0,0, 0,0,2,0, 0,0,0,1);
tentaclesLeftGeometry.applyMatrix(tentaclesLeftScale);
THREE.GeometryUtils.merge(tentaclesGeometry,tentaclesRightGeometry);
THREE.GeometryUtils.merge(tentaclesGeometry,tentaclesLeftGeometry);
// Tail Geometry
var tailFrontGeometry = makeCube();
var non_uniform_scale = new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,4,0, 0,0,0,1);
tailFrontGeometry.applyMatrix(non_uniform_scale);
//// var tailBackGeometry = makeCube();
//// var non_uniform_scale = new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,2,0, 0,0,0,1);
//// tailBackGeometry.applyMatrix(non_uniform_scale);
// Paw Front Geometry
var pawFrontInsideGeometry = makeCube();
var non_uniform_scale = new THREE.Matrix4().set(4,0,0,0, 0,1,0,0, 0,0,5,0, 0,0,0,1);
pawFrontInsideGeometry.applyMatrix(non_uniform_scale);
var pawFrontOutsideGeometry = makeCube();
var non_uniform_scale = new THREE.Matrix4().set(3,0,0,0, 0,2,0,0, 0,0,4,0, 0,0,0,1);
pawFrontOutsideGeometry.applyMatrix(non_uniform_scale);
// Paw Back Geometry
var pawBackInsideGeometry = makeCube();
var non_uniform_scale = new THREE.Matrix4().set(3,0,0,0, 0,1,0,0, 0,0,4,0, 0,0,0,1);
pawBackInsideGeometry.applyMatrix(non_uniform_scale);
var pawBackOutsideGeometry = makeCube();
var non_uniform_scale = new THREE.Matrix4().set(2,0,0,0, 0,2,0,0, 0,0,3,0, 0,0,0,1);
pawBackOutsideGeometry.applyMatrix(non_uniform_scale);
// Claw Front Geometry
var clawFrontGeometry = makeCube();
var FrontScale = new THREE.Matrix4().set(0.25,0,0,0, 0,0.25,0,0, 0,0,2,0, 0,0,0,1);
clawFrontGeometry.applyMatrix(FrontScale);
for (var i = 1; i < 3; i++) {
	var clawNewRightGeometry = makeCube();
	var clawNewLeftGeometry = makeCube();
	var RightScale = new THREE.Matrix4().set(0.25,0,0,-i/2.75, 0,0.25,0,0, 0,0,2,0, 0,0,0,1);
	var LeftScale = new THREE.Matrix4().set(0.25,0,0,i/2.75, 0,0.25,0,0, 0,0,2,0, 0,0,0,1);
	clawNewRightGeometry.applyMatrix(RightScale)
	clawNewLeftGeometry.applyMatrix(LeftScale);
	THREE.GeometryUtils.merge(clawFrontGeometry,clawNewRightGeometry);
	THREE.GeometryUtils.merge(clawFrontGeometry,clawNewLeftGeometry);
}
// Claw Back Geometry
var clawBackGeometry = makeCube();
var BackScale = new THREE.Matrix4().set(0.20,0,0,0, 0,0.20,0,0, 0,0,2,0, 0,0,0,1);
clawBackGeometry.applyMatrix(BackScale);
for (var i = 1; i < 3; i++) {
	var clawNewRightGeometry = makeCube();
	var clawNewLeftGeometry = makeCube();
	var RightScale = new THREE.Matrix4().set(0.20,0,0,-i/3.5, 0,0.20,0,0, 0,0,2,0, 0,0,0,1);
	var LeftScale = new THREE.Matrix4().set(0.20,0,0,i/3.5, 0,0.20,0,0, 0,0,2,0, 0,0,0,1);
	clawNewRightGeometry.applyMatrix(RightScale);
	clawNewLeftGeometry.applyMatrix(LeftScale);
	THREE.GeometryUtils.merge(clawBackGeometry,clawNewRightGeometry);
	THREE.GeometryUtils.merge(clawBackGeometry,clawNewLeftGeometry);
}

// MATRICES
var environmentMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,-5, 0,0,1,0, 0,0,0,1);
// Torso Matrix
var torsoMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,10, 0,0,1,0, 0,0,0,1);
// Head Matrices
var headMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,6.5, 0,0,0,1);
var torsoHeadMatrix = new THREE.Matrix4().multiplyMatrices(torsoMatrix, headMatrix);
var neckMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,5, 0,0,0,1);
var torsoNeckMatrix = new THREE.Matrix4().multiplyMatrices(torsoMatrix, neckMatrix);
// Nose Matrices
var noseMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,2.5, 0,0,0,1);
var torsoHeadNoseMatrix = new THREE.Matrix4().multiplyMatrices(torsoHeadMatrix, noseMatrix);
// Tentacle Matrices
var smallTentacleTopMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,0.75, 0,0,1,0.75, 0,0,0,1);
var torsoHeadNoseSmallTentacleTopMatrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseMatrix, smallTentacleTopMatrix);
var smallTentacleBottomMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,-0.75, 0,0,1,0.75, 0,0,0,1);
var torsoHeadNoseSmallTentacleBottomMatrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseMatrix, smallTentacleBottomMatrix);
var bigTentacleRight1Matrix = new THREE.Matrix4().set(1,0,0,-0.9, 0,1,0,0.70, 0,0,1,1, 0,0,0,1);
var torsoHeadNoseBigTentacleRight1Angle = new THREE.Matrix4().set(Math.cos(Math.PI/16),-Math.sin(Math.PI/16),0,0, Math.sin(Math.PI/16),Math.cos(Math.PI/16),0,0, 0,0,1,0, 0,0,0,1);
var torsoHeadNoseBigTentacleRight1Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseMatrix, bigTentacleRight1Matrix);
torsoHeadNoseBigTentacleRight1Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleRight1Matrix, torsoHeadNoseBigTentacleRight1Angle);
var bigTentacleRight2Matrix = new THREE.Matrix4().set(1,0,0,-1.5, 0,1,0,0, 0,0,1,1, 0,0,0,1);
var torsoHeadNoseBigTentacleRight2Angle = new THREE.Matrix4().set(Math.cos(Math.PI/2),-Math.sin(Math.PI/2),0,0, Math.sin(Math.PI/2),Math.cos(Math.PI/2),0,0, 0,0,1,0, 0,0,0,1);
var torsoHeadNoseBigTentacleRight2Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseMatrix, bigTentacleRight2Matrix);
torsoHeadNoseBigTentacleRight2Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleRight2Matrix, torsoHeadNoseBigTentacleRight2Angle);
var bigTentacleRight3Matrix = new THREE.Matrix4().set(1,0,0,-0.9, 0,1,0,-0.70, 0,0,1,1, 0,0,0,1);
var torsoHeadNoseBigTentacleRight3Angle = new THREE.Matrix4().set(Math.cos(-Math.PI/16),-Math.sin(-Math.PI/16),0,0, Math.sin(-Math.PI/16),Math.cos(-Math.PI/16),0,0, 0,0,1,0, 0,0,0,1);
var torsoHeadNoseBigTentacleRight3Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseMatrix, bigTentacleRight3Matrix);
torsoHeadNoseBigTentacleRight3Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleRight3Matrix, torsoHeadNoseBigTentacleRight3Angle);
var bigTentacleLeft1Matrix = new THREE.Matrix4().set(1,0,0,0.9, 0,1,0,0.70, 0,0,1,1, 0,0,0,1);
var torsoHeadNoseBigTentacleLeft1Angle = new THREE.Matrix4().set(Math.cos(-Math.PI/16),-Math.sin(-Math.PI/16),0,0, Math.sin(-Math.PI/16),Math.cos(-Math.PI/16),0,0, 0,0,1,0, 0,0,0,1);
var torsoHeadNoseBigTentacleLeft1Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseMatrix, bigTentacleLeft1Matrix);
torsoHeadNoseBigTentacleLeft1Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleLeft1Matrix, torsoHeadNoseBigTentacleLeft1Angle);
var bigTentacleLeft2Matrix = new THREE.Matrix4().set(1,0,0,1.5, 0,1,0,0, 0,0,1,1, 0,0,0,1);
var torsoHeadNoseBigTentacleLeft2Angle = new THREE.Matrix4().set(Math.cos(Math.PI/2),-Math.sin(Math.PI/2),0,0, Math.sin(Math.PI/2),Math.cos(Math.PI/2),0,0, 0,0,1,0, 0,0,0,1);
var torsoHeadNoseBigTentacleLeft2Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseMatrix, bigTentacleLeft2Matrix);
torsoHeadNoseBigTentacleLeft2Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleLeft2Matrix, torsoHeadNoseBigTentacleLeft2Angle);
var bigTentacleLeft3Matrix = new THREE.Matrix4().set(1,0,0,0.9, 0,1,0,-0.70, 0,0,1,1, 0,0,0,1);
var torsoHeadNoseBigTentacleLeft3Angle = new THREE.Matrix4().set(Math.cos(Math.PI/16),-Math.sin(Math.PI/16),0,0, Math.sin(Math.PI/16),Math.cos(Math.PI/16),0,0, 0,0,1,0, 0,0,0,1);
var torsoHeadNoseBigTentacleLeft3Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseMatrix, bigTentacleLeft3Matrix);
torsoHeadNoseBigTentacleLeft3Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleLeft3Matrix, torsoHeadNoseBigTentacleLeft3Angle);
// Tail Matrices
var tailFrontMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,-6, 0,0,0,1);
var torsoTailFrontMatrix = new THREE.Matrix4().multiplyMatrices(torsoMatrix, tailFrontMatrix);
//// var tailBackMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,-3, 0,0,0,1);
//// var torsoTailBackMatrix = new THREE.Matrix4().multiplyMatrices(torsoTailFrontMatrix, tailBackMatrix);
//// Paw Matrices
var pawAngleMatrix = new THREE.Matrix4().set(1,0,0,0, 0,Math.cos(0.3),-Math.sin(0.3),0, 0,Math.sin(0.3),Math.cos(0.3),0, 0,0,0,1);
var angleTorsoMatrix = new THREE.Matrix4().multiplyMatrices(torsoMatrix, pawAngleMatrix);
var pawFrontRightInsideMatrix = new THREE.Matrix4().set(1,0,0,-3, 0,1,0,-3, 0,0,1,4, 0,0,0,1);
var pawFrontRightMatrix = new THREE.Matrix4().multiplyMatrices(pawFrontRightInsideMatrix, angleTorsoMatrix);
var pawFrontLeftInsideMatrix = new THREE.Matrix4().set(1,0,0,3, 0,1,0,-3, 0,0,1,4, 0,0,0,1);
var pawFrontLeftMatrix = new THREE.Matrix4().multiplyMatrices(pawFrontLeftInsideMatrix, angleTorsoMatrix);
var pawBackRightInsideMatrix = new THREE.Matrix4().set(1,0,0,-3, 0,1,0,-3, 0,0,1,-2.5, 0,0,0,1);
var pawBackRightMatrix = new THREE.Matrix4().multiplyMatrices(pawBackRightInsideMatrix, angleTorsoMatrix);
var pawBackLeftInsideMatrix = new THREE.Matrix4().set(1,0,0,3, 0,1,0,-3, 0,0,1,-2.5, 0,0,0,1);
var pawBackLeftMatrix = new THREE.Matrix4().multiplyMatrices(pawBackLeftInsideMatrix, angleTorsoMatrix);
// Claw Matrices
var clawFrontRightMatrix = new THREE.Matrix4().set(2,0,0,0, 0,2,0,0, 0,0,1,3, 0,0,0,1);
var clawPawFrontRightMatrix = new THREE.Matrix4().multiplyMatrices(pawFrontRightMatrix, clawFrontRightMatrix);
var clawFrontLeftMatrix = new THREE.Matrix4().set(2,0,0,0, 0,2,0,0, 0,0,1,3, 0,0,0,1);
var clawPawFrontLeftMatrix = new THREE.Matrix4().multiplyMatrices(pawFrontLeftMatrix, clawFrontLeftMatrix);
var clawBackRightMatrix = new THREE.Matrix4().set(2,0,0,0, 0,2,0,0, 0,0,1,2, 0,0,0,1);
var clawPawBackRightMatrix = new THREE.Matrix4().multiplyMatrices(pawBackRightMatrix, clawBackRightMatrix);
var clawBackLeftMatrix = new THREE.Matrix4().set(2,0,0,0, 0,2,0,0, 0,0,1,2, 0,0,0,1);
var clawPawBackLeftMatrix = new THREE.Matrix4().multiplyMatrices(pawBackLeftMatrix, clawBackLeftMatrix);

// CREATE BODY
var environment = new THREE.Mesh(environmentGeometry,groundColor);
environment.setMatrix(environmentMatrix);
spotLight1.position.set( 50, 50, 50 );
spotLight2.position.set( -50, 50, -50 );
scene.add(environment);
scene.add( spotLight1 );
scene.add( spotLight2 );
// Create Torso
var torso = new THREE.Mesh(torsoGeometry,insideGreyColor);
var torsoZOutside = new THREE.Mesh(torsoOutsideZGeometry,outsideGreyColor);
var torsoXOutside = new THREE.Mesh(torsoOutsideXGeometry,outsideGreyColor);
var torsoYOutside = new THREE.Mesh(torsoOutsideYGeometry,outsideGreyColor);
torso.setMatrix(torsoMatrix);
torsoZOutside.setMatrix(torsoMatrix);
torsoXOutside.setMatrix(torsoMatrix);
torsoYOutside.setMatrix(torsoMatrix);
scene.add(torso);
scene.add(torsoZOutside);
scene.add(torsoXOutside);
scene.add(torsoYOutside);
// Create Head
var head = new THREE.Mesh(headGeometry,insideGreyColor);
var headXOutside = new THREE.Mesh(headOutsideXGeometry,outsideGreyColor);
var headYOutside = new THREE.Mesh(headOutsideYGeometry,outsideGreyColor);
var headZOutside = new THREE.Mesh(headOutsideZGeometry,insideGreyColor);
head.setMatrix(torsoHeadMatrix);
headXOutside.setMatrix(torsoHeadMatrix);
headYOutside.setMatrix(torsoHeadMatrix);
headZOutside.setMatrix(torsoNeckMatrix);
scene.add(head);
scene.add(headXOutside);
scene.add(headYOutside);
scene.add(headZOutside);
// Create Nose
var nose = new THREE.Mesh(noseGeometry,noseColor);
nose.setMatrix(torsoHeadNoseMatrix);
scene.add(nose);
// Create Tentacle
var smallTentacleTop = new THREE.Mesh(smallTentacleGeometry,tentacleColor);
var smallTentacleBottom = new THREE.Mesh(smallTentacleGeometry,tentacleColor);
var bigTentacleRight1 = new THREE.Mesh(tentaclesGeometry,tentacleColor);
var bigTentacleRight2 = new THREE.Mesh(tentaclesGeometry,tentacleColor);
var bigTentacleRight3 = new THREE.Mesh(tentaclesGeometry,tentacleColor);
var bigTentacleLeft1 = new THREE.Mesh(tentaclesGeometry,tentacleColor);
var bigTentacleLeft2 = new THREE.Mesh(tentaclesGeometry,tentacleColor);
var bigTentacleLeft3 = new THREE.Mesh(tentaclesGeometry,tentacleColor);
smallTentacleTop.setMatrix(torsoHeadNoseSmallTentacleTopMatrix);
smallTentacleBottom.setMatrix(torsoHeadNoseSmallTentacleBottomMatrix);
bigTentacleRight1.setMatrix(torsoHeadNoseBigTentacleRight1Matrix);
bigTentacleRight2.setMatrix(torsoHeadNoseBigTentacleRight2Matrix);
bigTentacleRight3.setMatrix(torsoHeadNoseBigTentacleRight3Matrix);
bigTentacleLeft1.setMatrix(torsoHeadNoseBigTentacleLeft1Matrix);
bigTentacleLeft2.setMatrix(torsoHeadNoseBigTentacleLeft2Matrix);
bigTentacleLeft3.setMatrix(torsoHeadNoseBigTentacleLeft3Matrix);
scene.add(smallTentacleTop);
scene.add(smallTentacleBottom);
scene.add(bigTentacleRight1);
scene.add(bigTentacleRight2);
scene.add(bigTentacleRight3);
scene.add(bigTentacleLeft1);
scene.add(bigTentacleLeft2);
scene.add(bigTentacleLeft3);
// Create Tail
var tailFront = new THREE.Mesh(tailFrontGeometry,insideGreyColor);
tailFront.setMatrix(torsoTailFrontMatrix);
scene.add(tailFront);
// Create Front Paws
var pawFrontRight = new THREE.Mesh(pawFrontInsideGeometry,insideGreyColor);
var pawFrontRightOutside = new THREE.Mesh(pawFrontOutsideGeometry,outsideGreyColor);
var pawFrontLeft = new THREE.Mesh(pawFrontInsideGeometry,insideGreyColor);
var pawFrontLeftOutside = new THREE.Mesh(pawFrontOutsideGeometry,outsideGreyColor);
pawFrontRight.setMatrix(pawFrontRightMatrix);
pawFrontRightOutside.setMatrix(pawFrontRightMatrix);
pawFrontLeft.setMatrix(pawFrontLeftMatrix);
pawFrontLeftOutside.setMatrix(pawFrontLeftMatrix);
scene.add(pawFrontRight);
scene.add(pawFrontRightOutside);
scene.add(pawFrontLeft);
scene.add(pawFrontLeftOutside);
// Create Back Paws
var pawBackRight = new THREE.Mesh(pawBackInsideGeometry,insideGreyColor);
var pawBackRightOutside = new THREE.Mesh(pawBackOutsideGeometry,outsideGreyColor);
var pawBackLeft = new THREE.Mesh(pawBackInsideGeometry,insideGreyColor);
var pawBackLeftOutside = new THREE.Mesh(pawBackOutsideGeometry,outsideGreyColor);
pawBackRight.setMatrix(pawBackRightMatrix);
pawBackRightOutside.setMatrix(pawBackRightMatrix);
pawBackLeft.setMatrix(pawBackLeftMatrix);
pawBackLeftOutside.setMatrix(pawBackLeftMatrix);
scene.add(pawBackRight);
scene.add(pawBackRightOutside);
scene.add(pawBackLeft);
scene.add(pawBackLeftOutside);
// Create Front Claws
var clawsPawFrontRight = new THREE.Mesh(clawFrontGeometry,clawColor);
var clawsPawFrontLeft = new THREE.Mesh(clawFrontGeometry,clawColor);
clawsPawFrontRight.setMatrix(clawPawFrontRightMatrix);
clawsPawFrontLeft.setMatrix(clawPawFrontLeftMatrix);
scene.add(clawsPawFrontRight);
scene.add(clawsPawFrontLeft);
// Create Back Claws
var clawsPawBackRight = new THREE.Mesh(clawBackGeometry,clawColor);
var clawsPawBackLeft = new THREE.Mesh(clawBackGeometry,clawColor);
clawsPawBackRight.setMatrix(clawPawBackRightMatrix);
clawsPawBackLeft.setMatrix(clawPawBackLeftMatrix);
scene.add(clawsPawBackRight);
scene.add(clawsPawBackLeft);

// APPLY DIFFERENT JUMP CUTS/ANIMATIONS TO DIFFERNET KEYS
// Note: The start of "U" animation has been done for you, you must implement the hiearchy and jumpcut.
// Hint: There are other ways to manipulate and grab clock values!!
// Hint: Check THREE.js clock documenation for ideas.
// Hint: It may help to start with a jumpcut and implement the animation after.
// Hint: Where is updateBody() called?
var clock = new THREE.Clock(true);

var p0; // start position or angle
var p1; // end position or angle
var time_length; // total time of animation
var time_start; // start time of animation
var time_end; // end time of animation
var p; // current frame
var animate = false; // animate?
var jumpcut = false; // do jumpcut?
var swim = 0; // first or second swim?

// function init_animation()
// Initializes parameters and sets animate flag to true.
// Input: start position or angle, end position or angle, and total time of animation.
function init_animation(p_start,p_end,t_length){
	p0 = p_start;
	p1 = p_end;
	time_length = t_length;
	time_start = clock.getElapsedTime();
	time_end = time_start + time_length;
	animate = true; // flag for animation
	return;
}

// Function for Basic Pose
function basicPose() {
	// Head + Torso + Tail
	torso.setMatrix(torsoMatrix);
	torsoZOutside.setMatrix(torsoMatrix);
	torsoXOutside.setMatrix(torsoMatrix);
	torsoYOutside.setMatrix(torsoMatrix);
	head.setMatrix(torsoHeadMatrix);
	headXOutside.setMatrix(torsoHeadMatrix);
	headYOutside.setMatrix(torsoHeadMatrix);
	headZOutside.setMatrix(torsoNeckMatrix);
	// Nose + Tentacles
	nose.setMatrix(torsoHeadNoseMatrix);
	smallTentacleTop.setMatrix(torsoHeadNoseSmallTentacleTopMatrix);
	smallTentacleBottom.setMatrix(torsoHeadNoseSmallTentacleBottomMatrix);
	tailFront.setMatrix(torsoTailFrontMatrix);
	bigTentacleRight1.setMatrix(torsoHeadNoseBigTentacleRight1Matrix);
	bigTentacleRight2.setMatrix(torsoHeadNoseBigTentacleRight2Matrix);
	bigTentacleRight3.setMatrix(torsoHeadNoseBigTentacleRight3Matrix);
	bigTentacleLeft1.setMatrix(torsoHeadNoseBigTentacleLeft1Matrix);
	bigTentacleLeft2.setMatrix(torsoHeadNoseBigTentacleLeft2Matrix);
	bigTentacleLeft3.setMatrix(torsoHeadNoseBigTentacleLeft3Matrix);
	// Claws + Paws
	pawFrontRight.setMatrix(pawFrontRightMatrix);
	pawFrontRightOutside.setMatrix(pawFrontRightMatrix);
	pawFrontLeft.setMatrix(pawFrontLeftMatrix);
	pawFrontLeftOutside.setMatrix(pawFrontLeftMatrix);
	pawBackRight.setMatrix(pawBackRightMatrix);
	pawBackRightOutside.setMatrix(pawBackRightMatrix);
	pawBackLeft.setMatrix(pawBackLeftMatrix);
	pawBackLeftOutside.setMatrix(pawBackLeftMatrix);
	clawsPawFrontRight.setMatrix(clawPawFrontRightMatrix);
	clawsPawFrontLeft.setMatrix(clawPawFrontLeftMatrix);
	clawsPawBackRight.setMatrix(clawPawBackRightMatrix);
	clawsPawBackLeft.setMatrix(clawPawBackLeftMatrix);

}

// Function for Animation Torso
function animationTorso(animationMatrix) {
	// Head + Torso + Tail
	var torsoRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoMatrix,animationMatrix);
	torso.setMatrix(torsoRotMatrix);
	torsoYOutside.setMatrix(torsoRotMatrix);
	torsoXOutside.setMatrix(torsoRotMatrix);
	torsoZOutside.setMatrix(torsoRotMatrix);
	var torsoTailFrontRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoRotMatrix,tailFrontMatrix);
	tailFront.setMatrix(torsoTailFrontRotMatrix);
	var torsoHeadRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoRotMatrix,headMatrix);
	var torsoNeckRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoRotMatrix,neckMatrix);
	head.setMatrix(torsoHeadRotMatrix);
	headYOutside.setMatrix(torsoHeadRotMatrix);
	headXOutside.setMatrix(torsoHeadRotMatrix);
	headZOutside.setMatrix(torsoNeckRotMatrix);
	// Nose + Tentacles
	var torsoHeadNoseRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoHeadRotMatrix,noseMatrix);
	nose.setMatrix(torsoHeadNoseRotMatrix);
	var torsoHeadNoseTentaclesTopRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseRotMatrix,smallTentacleTopMatrix);
	var torsoHeadNoseTentaclesBottomRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseRotMatrix,smallTentacleBottomMatrix);
	smallTentacleTop.setMatrix(torsoHeadNoseTentaclesTopRotMatrix);
	smallTentacleBottom.setMatrix(torsoHeadNoseTentaclesBottomRotMatrix);
	var torsoHeadNoseBigTentacleRight1Angle = new THREE.Matrix4().set(Math.cos(Math.PI/16),-Math.sin(Math.PI/16),0,0, Math.sin(Math.PI/16),Math.cos(Math.PI/16),0,0, 0,0,1,0, 0,0,0,1);
	var torsoHeadNoseBigTentacleRight2Angle = new THREE.Matrix4().set(Math.cos(Math.PI/2),-Math.sin(Math.PI/2),0,0, Math.sin(Math.PI/2),Math.cos(Math.PI/2),0,0, 0,0,1,0, 0,0,0,1);
	var torsoHeadNoseBigTentacleRight3Angle = new THREE.Matrix4().set(Math.cos(-Math.PI/16),-Math.sin(-Math.PI/16),0,0, Math.sin(-Math.PI/16),Math.cos(-Math.PI/16),0,0, 0,0,1,0, 0,0,0,1);
	var torsoHeadNoseBigTentacleLeft1Angle = new THREE.Matrix4().set(Math.cos(-Math.PI/16),-Math.sin(-Math.PI/16),0,0, Math.sin(-Math.PI/16),Math.cos(-Math.PI/16),0,0, 0,0,1,0, 0,0,0,1);
	var torsoHeadNoseBigTentacleLeft2Angle = new THREE.Matrix4().set(Math.cos(Math.PI/2),-Math.sin(Math.PI/2),0,0, Math.sin(Math.PI/2),Math.cos(Math.PI/2),0,0, 0,0,1,0, 0,0,0,1);
	var torsoHeadNoseBigTentacleLeft3Angle = new THREE.Matrix4().set(Math.cos(Math.PI/16),-Math.sin(Math.PI/16),0,0, Math.sin(Math.PI/16),Math.cos(Math.PI/16),0,0, 0,0,1,0, 0,0,0,1);
	var torsoHeadNoseBigTentacleRight1Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseRotMatrix,bigTentacleRight1Matrix);
	var torsoHeadNoseBigTentacleRight2Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseRotMatrix,bigTentacleRight2Matrix);
	var torsoHeadNoseBigTentacleRight3Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseRotMatrix,bigTentacleRight3Matrix);
	var torsoHeadNoseBigTentacleLeft1Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseRotMatrix,bigTentacleLeft1Matrix);
	var torsoHeadNoseBigTentacleLeft2Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseRotMatrix,bigTentacleLeft2Matrix);
	var torsoHeadNoseBigTentacleLeft3Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseRotMatrix,bigTentacleLeft3Matrix);
	torsoHeadNoseBigTentacleRight1Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleRight1Matrix,torsoHeadNoseBigTentacleRight1Angle);
	torsoHeadNoseBigTentacleRight2Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleRight2Matrix,torsoHeadNoseBigTentacleRight2Angle);
	torsoHeadNoseBigTentacleRight3Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleRight3Matrix,torsoHeadNoseBigTentacleRight3Angle);
	torsoHeadNoseBigTentacleLeft1Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleLeft1Matrix,torsoHeadNoseBigTentacleLeft1Angle);
	torsoHeadNoseBigTentacleLeft2Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleLeft2Matrix,torsoHeadNoseBigTentacleLeft2Angle);
	torsoHeadNoseBigTentacleLeft3Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleLeft3Matrix,torsoHeadNoseBigTentacleLeft3Angle);
	bigTentacleRight1.setMatrix(torsoHeadNoseBigTentacleRight1Matrix);
	bigTentacleRight2.setMatrix(torsoHeadNoseBigTentacleRight2Matrix);
	bigTentacleRight3.setMatrix(torsoHeadNoseBigTentacleRight3Matrix);
	bigTentacleLeft1.setMatrix(torsoHeadNoseBigTentacleLeft1Matrix);
	bigTentacleLeft2.setMatrix(torsoHeadNoseBigTentacleLeft2Matrix);
	bigTentacleLeft3.setMatrix(torsoHeadNoseBigTentacleLeft3Matrix);
	// Claws + Paws
	var pawAngleMatrix = new THREE.Matrix4().set(1,0,0,0, 0,Math.cos(0.3),-Math.sin(0.3),0, 0,Math.sin(0.3),Math.cos(0.3),0, 0,0,0,1);
	var torsoPawBackRightRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoRotMatrix,pawBackRightInsideMatrix);
	var torsoPawBackLeftRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoRotMatrix,pawBackLeftInsideMatrix);
	var torsoPawFrontRightRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoRotMatrix,pawFrontRightInsideMatrix);
	var torsoPawFrontLeftRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoRotMatrix,pawFrontLeftInsideMatrix);
	var torsoPawBackRightRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoPawBackRightRotMatrix, pawAngleMatrix);
	var torsoPawBackLeftRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoPawBackLeftRotMatrix, pawAngleMatrix);
	var torsoPawFrontRightRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoPawFrontRightRotMatrix, pawAngleMatrix);
	var torsoPawFrontLeftRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoPawFrontLeftRotMatrix, pawAngleMatrix);
	pawBackRight.setMatrix(torsoPawBackRightRotMatrix);
	pawBackLeft.setMatrix(torsoPawBackLeftRotMatrix);
	pawFrontRight.setMatrix(torsoPawFrontRightRotMatrix);
	pawFrontLeft.setMatrix(torsoPawFrontLeftRotMatrix);
	pawBackRightOutside.setMatrix(torsoPawBackRightRotMatrix);
	pawBackLeftOutside.setMatrix(torsoPawBackLeftRotMatrix);
	pawFrontRightOutside.setMatrix(torsoPawFrontRightRotMatrix);
	pawFrontLeftOutside.setMatrix(torsoPawFrontLeftRotMatrix);
	var torsoPawClawsBackRightRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoPawBackRightRotMatrix,clawBackRightMatrix);
	var torsoPawClawsBackLeftRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoPawBackLeftRotMatrix,clawBackLeftMatrix);
	var torsoPawClawsFrontRightRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoPawFrontRightRotMatrix,clawFrontRightMatrix);
	var torsoPawClawsFrontLeftRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoPawFrontLeftRotMatrix,clawFrontLeftMatrix);
	clawsPawBackRight.setMatrix(torsoPawClawsBackRightRotMatrix);
	clawsPawBackLeft.setMatrix(torsoPawClawsBackLeftRotMatrix);
	clawsPawFrontRight.setMatrix(torsoPawClawsFrontRightRotMatrix);
	clawsPawFrontLeft.setMatrix(torsoPawClawsFrontLeftRotMatrix);
}

// Function for Animation Tail
function animationTail(animationMatrix) {
	var tailFrontRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoTailFrontMatrix,animationMatrix);
	tailFront.setMatrix(tailFrontRotMatrix);
}

// Function for Animation Head
function animationHead(animationMatrix, animationNeckMatrix) {
	var rotateHeadRightRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoHeadMatrix,animationMatrix);
	var rotateNeckRightRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoNeckMatrix,animationNeckMatrix);
	head.setMatrix(rotateHeadRightRotMatrix);
	headYOutside.setMatrix(rotateHeadRightRotMatrix);
	headXOutside.setMatrix(rotateHeadRightRotMatrix);
	headZOutside.setMatrix(rotateNeckRightRotMatrix);
	var torsoHeadNoseRotMatrix = new THREE.Matrix4().multiplyMatrices(rotateHeadRightRotMatrix,noseMatrix);
	nose.setMatrix(torsoHeadNoseRotMatrix);
	var torsoHeadNoseTentaclesTopRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseRotMatrix,smallTentacleTopMatrix);
	var torsoHeadNoseTentaclesBottomRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseRotMatrix,smallTentacleBottomMatrix);
	smallTentacleTop.setMatrix(torsoHeadNoseTentaclesTopRotMatrix);
	smallTentacleBottom.setMatrix(torsoHeadNoseTentaclesBottomRotMatrix);
	var torsoHeadNoseBigTentacleRight1Angle = new THREE.Matrix4().set(Math.cos(Math.PI/16),-Math.sin(Math.PI/16),0,0, Math.sin(Math.PI/16),Math.cos(Math.PI/16),0,0, 0,0,1,0, 0,0,0,1);
	var torsoHeadNoseBigTentacleRight2Angle = new THREE.Matrix4().set(Math.cos(Math.PI/2),-Math.sin(Math.PI/2),0,0, Math.sin(Math.PI/2),Math.cos(Math.PI/2),0,0, 0,0,1,0, 0,0,0,1);
	var torsoHeadNoseBigTentacleRight3Angle = new THREE.Matrix4().set(Math.cos(-Math.PI/16),-Math.sin(-Math.PI/16),0,0, Math.sin(-Math.PI/16),Math.cos(-Math.PI/16),0,0, 0,0,1,0, 0,0,0,1);
	var torsoHeadNoseBigTentacleLeft1Angle = new THREE.Matrix4().set(Math.cos(-Math.PI/16),-Math.sin(-Math.PI/16),0,0, Math.sin(-Math.PI/16),Math.cos(-Math.PI/16),0,0, 0,0,1,0, 0,0,0,1);
	var torsoHeadNoseBigTentacleLeft2Angle = new THREE.Matrix4().set(Math.cos(Math.PI/2),-Math.sin(Math.PI/2),0,0, Math.sin(Math.PI/2),Math.cos(Math.PI/2),0,0, 0,0,1,0, 0,0,0,1);
	var torsoHeadNoseBigTentacleLeft3Angle = new THREE.Matrix4().set(Math.cos(Math.PI/16),-Math.sin(Math.PI/16),0,0, Math.sin(Math.PI/16),Math.cos(Math.PI/16),0,0, 0,0,1,0, 0,0,0,1);
	var torsoHeadNoseBigTentacleRight1Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseRotMatrix,bigTentacleRight1Matrix);
	var torsoHeadNoseBigTentacleRight2Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseRotMatrix,bigTentacleRight2Matrix);
	var torsoHeadNoseBigTentacleRight3Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseRotMatrix,bigTentacleRight3Matrix);
	var torsoHeadNoseBigTentacleLeft1Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseRotMatrix,bigTentacleLeft1Matrix);
	var torsoHeadNoseBigTentacleLeft2Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseRotMatrix,bigTentacleLeft2Matrix);
	var torsoHeadNoseBigTentacleLeft3Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseRotMatrix,bigTentacleLeft3Matrix);
	torsoHeadNoseBigTentacleRight1Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleRight1Matrix,torsoHeadNoseBigTentacleRight1Angle);
	torsoHeadNoseBigTentacleRight2Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleRight2Matrix,torsoHeadNoseBigTentacleRight2Angle);
	torsoHeadNoseBigTentacleRight3Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleRight3Matrix,torsoHeadNoseBigTentacleRight3Angle);
	torsoHeadNoseBigTentacleLeft1Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleLeft1Matrix,torsoHeadNoseBigTentacleLeft1Angle);
	torsoHeadNoseBigTentacleLeft2Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleLeft2Matrix,torsoHeadNoseBigTentacleLeft2Angle);
	torsoHeadNoseBigTentacleLeft3Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleLeft3Matrix,torsoHeadNoseBigTentacleLeft3Angle);
	bigTentacleRight1.setMatrix(torsoHeadNoseBigTentacleRight1Matrix);
	bigTentacleRight2.setMatrix(torsoHeadNoseBigTentacleRight2Matrix);
	bigTentacleRight3.setMatrix(torsoHeadNoseBigTentacleRight3Matrix);
	bigTentacleLeft1.setMatrix(torsoHeadNoseBigTentacleLeft1Matrix);
	bigTentacleLeft2.setMatrix(torsoHeadNoseBigTentacleLeft2Matrix);
	bigTentacleLeft3.setMatrix(torsoHeadNoseBigTentacleLeft3Matrix);
}

// Function for Animation Nose
function animationNose(animationUpMatrix,animationDownMatrix,animationLeftMatrix,animationRightMatrix) {
	var tentaclesTopRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseSmallTentacleTopMatrix,animationUpMatrix);
	var tentaclesBottomRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseSmallTentacleBottomMatrix,animationDownMatrix);
	smallTentacleTop.setMatrix(tentaclesTopRotMatrix);
	smallTentacleBottom.setMatrix(tentaclesBottomRotMatrix);
	var torsoHeadNoseBigTentacleRight1Angle = new THREE.Matrix4().set(Math.cos(Math.PI/16),-Math.sin(Math.PI/16),0,0, Math.sin(Math.PI/16),Math.cos(Math.PI/16),0,0, 0,0,1,0, 0,0,0,1);
	var torsoHeadNoseBigTentacleRight2Angle = new THREE.Matrix4().set(Math.cos(Math.PI/2),-Math.sin(Math.PI/2),0,0, Math.sin(Math.PI/2),Math.cos(Math.PI/2),0,0, 0,0,1,0, 0,0,0,1);
	var torsoHeadNoseBigTentacleRight3Angle = new THREE.Matrix4().set(Math.cos(-Math.PI/16),-Math.sin(-Math.PI/16),0,0, Math.sin(-Math.PI/16),Math.cos(-Math.PI/16),0,0, 0,0,1,0, 0,0,0,1);
	var torsoHeadNoseBigTentacleLeft1Angle = new THREE.Matrix4().set(Math.cos(-Math.PI/16),-Math.sin(-Math.PI/16),0,0, Math.sin(-Math.PI/16),Math.cos(-Math.PI/16),0,0, 0,0,1,0, 0,0,0,1);
	var torsoHeadNoseBigTentacleLeft2Angle = new THREE.Matrix4().set(Math.cos(Math.PI/2),-Math.sin(Math.PI/2),0,0, Math.sin(Math.PI/2),Math.cos(Math.PI/2),0,0, 0,0,1,0, 0,0,0,1);
	var torsoHeadNoseBigTentacleLeft3Angle = new THREE.Matrix4().set(Math.cos(Math.PI/16),-Math.sin(Math.PI/16),0,0, Math.sin(Math.PI/16),Math.cos(Math.PI/16),0,0, 0,0,1,0, 0,0,0,1);
	var torsoHeadNoseBigTentacleRight1Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseMatrix,animationUpMatrix);
	torsoHeadNoseBigTentacleRight1Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleRight1Matrix,animationRightMatrix);
	torsoHeadNoseBigTentacleRight1Matrix = new THREE.Matrix4().multiplyMatrices(bigTentacleRight1Matrix,torsoHeadNoseBigTentacleRight1Matrix);
	torsoHeadNoseBigTentacleRight1Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleRight1Matrix,torsoHeadNoseBigTentacleRight1Angle);
	bigTentacleRight1.setMatrix(torsoHeadNoseBigTentacleRight1Matrix);
	var torsoHeadNoseBigTentacleRight2Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseMatrix,animationRightMatrix);
	torsoHeadNoseBigTentacleRight2Matrix = new THREE.Matrix4().multiplyMatrices(bigTentacleRight2Matrix,torsoHeadNoseBigTentacleRight2Matrix);
	torsoHeadNoseBigTentacleRight2Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleRight2Matrix,torsoHeadNoseBigTentacleRight2Angle);
	bigTentacleRight2.setMatrix(torsoHeadNoseBigTentacleRight2Matrix);
	var torsoHeadNoseBigTentacleRight3Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseMatrix,animationDownMatrix);
	torsoHeadNoseBigTentacleRight3Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleRight3Matrix,animationRightMatrix);
	torsoHeadNoseBigTentacleRight3Matrix = new THREE.Matrix4().multiplyMatrices(bigTentacleRight3Matrix,torsoHeadNoseBigTentacleRight3Matrix);
	torsoHeadNoseBigTentacleRight3Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleRight3Matrix,torsoHeadNoseBigTentacleRight3Angle);
	bigTentacleRight3.setMatrix(torsoHeadNoseBigTentacleRight3Matrix);
	var torsoHeadNoseBigTentacleLeft1Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseMatrix,animationUpMatrix);
	torsoHeadNoseBigTentacleLeft1Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleLeft1Matrix,animationLeftMatrix);
	torsoHeadNoseBigTentacleLeft1Matrix = new THREE.Matrix4().multiplyMatrices(bigTentacleLeft1Matrix,torsoHeadNoseBigTentacleLeft1Matrix);
	torsoHeadNoseBigTentacleLeft1Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleLeft1Matrix,torsoHeadNoseBigTentacleLeft1Angle);
	bigTentacleLeft1.setMatrix(torsoHeadNoseBigTentacleLeft1Matrix);
	var torsoHeadNoseBigTentacleLeft2Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseMatrix,animationLeftMatrix);
	torsoHeadNoseBigTentacleLeft2Matrix = new THREE.Matrix4().multiplyMatrices(bigTentacleLeft2Matrix,torsoHeadNoseBigTentacleLeft2Matrix);
	torsoHeadNoseBigTentacleLeft2Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleLeft2Matrix,torsoHeadNoseBigTentacleLeft2Angle);
	bigTentacleLeft2.setMatrix(torsoHeadNoseBigTentacleLeft2Matrix);
	var torsoHeadNoseBigTentacleLeft3Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseMatrix,animationDownMatrix);
	torsoHeadNoseBigTentacleLeft3Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleLeft3Matrix,animationLeftMatrix);
	torsoHeadNoseBigTentacleLeft3Matrix = new THREE.Matrix4().multiplyMatrices(bigTentacleLeft3Matrix,torsoHeadNoseBigTentacleLeft3Matrix);
	torsoHeadNoseBigTentacleLeft3Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleLeft3Matrix,torsoHeadNoseBigTentacleLeft3Angle);
	bigTentacleLeft3.setMatrix(torsoHeadNoseBigTentacleLeft3Matrix);
}

// Function for Animation Dig
function animationDig(animationPawMatrix,animationClawMatrix) {
	var pawFrontRightRotMatrix = new THREE.Matrix4().multiplyMatrices(pawFrontRightMatrix,animationPawMatrix);
	var pawFrontLeftRotMatrix = new THREE.Matrix4().multiplyMatrices(pawFrontLeftMatrix,animationPawMatrix);
	pawFrontRight.setMatrix(pawFrontRightRotMatrix);
	pawFrontRightOutside.setMatrix(pawFrontRightRotMatrix);
	pawFrontLeft.setMatrix(pawFrontLeftRotMatrix);
	pawFrontLeftOutside.setMatrix(pawFrontLeftRotMatrix);
	var clawsFrontRightRotMatrix = new THREE.Matrix4().multiplyMatrices(pawFrontRightRotMatrix,animationClawMatrix);
	clawsFrontRightRotMatrix = new THREE.Matrix4().multiplyMatrices(clawsFrontRightRotMatrix,clawFrontRightMatrix);
	var clawsFrontLeftRotMatrix = new THREE.Matrix4().multiplyMatrices(pawFrontLeftRotMatrix,animationClawMatrix);
	clawsFrontLeftRotMatrix = new THREE.Matrix4().multiplyMatrices(clawsFrontLeftRotMatrix,clawFrontLeftMatrix);
	clawsPawFrontRight.setMatrix(clawsFrontRightRotMatrix);
	clawsPawFrontLeft.setMatrix(clawsFrontLeftRotMatrix);
}

// Function for Animation Swim Left
function animationSwimLeft(animationDownMatrix) {
	var pawFrontLeftRotMatrix = new THREE.Matrix4().multiplyMatrices(pawFrontLeftMatrix,animationDownMatrix);
	pawFrontLeft.setMatrix(pawFrontLeftRotMatrix);
	pawFrontLeftOutside.setMatrix(pawFrontLeftRotMatrix);
	var clawsFrontLeftRotMatrix = new THREE.Matrix4().multiplyMatrices(pawFrontLeftRotMatrix,clawFrontLeftMatrix);
	clawsPawFrontLeft.setMatrix(clawsFrontLeftRotMatrix);
	var pawBackRightRotMatrix = new THREE.Matrix4().multiplyMatrices(pawBackRightMatrix,animationDownMatrix);
	pawBackRight.setMatrix(pawBackRightRotMatrix);
	pawBackRightOutside.setMatrix(pawBackRightRotMatrix);
	var clawsBackRightRotMatrix = new THREE.Matrix4().multiplyMatrices(pawBackRightRotMatrix,clawBackRightMatrix);
	clawsPawBackRight.setMatrix(clawsBackRightRotMatrix);
}

// Function for Animation Swim Right
function animationSwimRight(animationDownMatrix) {
	var pawFrontRightRotMatrix = new THREE.Matrix4().multiplyMatrices(pawFrontRightMatrix,animationDownMatrix);
	pawFrontRight.setMatrix(pawFrontRightRotMatrix);
	pawFrontRightOutside.setMatrix(pawFrontRightRotMatrix);
	var clawsFrontRightRotMatrix = new THREE.Matrix4().multiplyMatrices(pawFrontRightRotMatrix,clawFrontRightMatrix);
	clawsPawFrontRight.setMatrix(clawsFrontRightRotMatrix);
	var pawBackLeftRotMatrix = new THREE.Matrix4().multiplyMatrices(pawBackLeftMatrix,animationDownMatrix);
	pawBackLeft.setMatrix(pawBackLeftRotMatrix);
	pawBackLeftOutside.setMatrix(pawBackLeftRotMatrix);
	var clawsBackLeftRotMatrix = new THREE.Matrix4().multiplyMatrices(pawBackLeftRotMatrix,clawBackLeftMatrix);
	clawsPawBackLeft.setMatrix(clawsBackLeftRotMatrix);
}

// Function for Animation Swim Head
function animationSwimHead(animationMatrix, animationNeckMatrix,animationUpMatrix,animationDownMatrix,animationLeftMatrix,animationRightMatrix) {
	var rotateHeadRightRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoHeadMatrix,animationMatrix);
	var rotateNeckRightRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoNeckMatrix,animationNeckMatrix);
	head.setMatrix(rotateHeadRightRotMatrix);
	headYOutside.setMatrix(rotateHeadRightRotMatrix);
	headXOutside.setMatrix(rotateHeadRightRotMatrix);
	headZOutside.setMatrix(rotateNeckRightRotMatrix);
	var torsoHeadNoseRotMatrix = new THREE.Matrix4().multiplyMatrices(rotateHeadRightRotMatrix,noseMatrix);
	nose.setMatrix(torsoHeadNoseRotMatrix);
	var torsoHeadNoseTentaclesTopRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseRotMatrix,smallTentacleTopMatrix);
	var torsoHeadNoseTentaclesBottomRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseRotMatrix,smallTentacleBottomMatrix);
	torsoHeadNoseTentaclesTopRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseTentaclesTopRotMatrix,animationUpMatrix);
	torsoHeadNoseTentaclesBottomRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseTentaclesBottomRotMatrix,animationDownMatrix);
	smallTentacleTop.setMatrix(torsoHeadNoseTentaclesTopRotMatrix);
	smallTentacleBottom.setMatrix(torsoHeadNoseTentaclesBottomRotMatrix);
	var torsoHeadNoseBigTentacleRight1Angle = new THREE.Matrix4().set(Math.cos(Math.PI/16),-Math.sin(Math.PI/16),0,0, Math.sin(Math.PI/16),Math.cos(Math.PI/16),0,0, 0,0,1,0, 0,0,0,1);
	var torsoHeadNoseBigTentacleRight2Angle = new THREE.Matrix4().set(Math.cos(Math.PI/2),-Math.sin(Math.PI/2),0,0, Math.sin(Math.PI/2),Math.cos(Math.PI/2),0,0, 0,0,1,0, 0,0,0,1);
	var torsoHeadNoseBigTentacleRight3Angle = new THREE.Matrix4().set(Math.cos(-Math.PI/16),-Math.sin(-Math.PI/16),0,0, Math.sin(-Math.PI/16),Math.cos(-Math.PI/16),0,0, 0,0,1,0, 0,0,0,1);
	var torsoHeadNoseBigTentacleLeft1Angle = new THREE.Matrix4().set(Math.cos(-Math.PI/16),-Math.sin(-Math.PI/16),0,0, Math.sin(-Math.PI/16),Math.cos(-Math.PI/16),0,0, 0,0,1,0, 0,0,0,1);
	var torsoHeadNoseBigTentacleLeft2Angle = new THREE.Matrix4().set(Math.cos(Math.PI/2),-Math.sin(Math.PI/2),0,0, Math.sin(Math.PI/2),Math.cos(Math.PI/2),0,0, 0,0,1,0, 0,0,0,1);
	var torsoHeadNoseBigTentacleLeft3Angle = new THREE.Matrix4().set(Math.cos(Math.PI/16),-Math.sin(Math.PI/16),0,0, Math.sin(Math.PI/16),Math.cos(Math.PI/16),0,0, 0,0,1,0, 0,0,0,1);
	var torsoHeadNoseBigTentacleRight1Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseRotMatrix,bigTentacleRight1Matrix);
	torsoHeadNoseBigTentacleRight1Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleRight1Matrix,animationUpMatrix);
	torsoHeadNoseBigTentacleRight1Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleRight1Matrix,animationRightMatrix);
	torsoHeadNoseBigTentacleRight1Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleRight1Matrix,torsoHeadNoseBigTentacleRight1Angle);
	var torsoHeadNoseBigTentacleRight2Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseRotMatrix,bigTentacleRight2Matrix);
	torsoHeadNoseBigTentacleRight2Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleRight2Matrix,animationRightMatrix);
	torsoHeadNoseBigTentacleRight2Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleRight2Matrix,torsoHeadNoseBigTentacleRight2Angle);
	var torsoHeadNoseBigTentacleRight3Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseRotMatrix,bigTentacleRight3Matrix);
	torsoHeadNoseBigTentacleRight3Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleRight3Matrix,animationDownMatrix);
	torsoHeadNoseBigTentacleRight3Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleRight3Matrix,animationRightMatrix);
	torsoHeadNoseBigTentacleRight3Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleRight3Matrix,torsoHeadNoseBigTentacleRight3Angle);
	var torsoHeadNoseBigTentacleLeft1Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseRotMatrix,bigTentacleLeft1Matrix);
	torsoHeadNoseBigTentacleLeft1Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleLeft1Matrix,animationUpMatrix);
	torsoHeadNoseBigTentacleLeft1Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleLeft1Matrix,animationLeftMatrix);
	torsoHeadNoseBigTentacleLeft1Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleLeft1Matrix,torsoHeadNoseBigTentacleLeft1Angle);
	var torsoHeadNoseBigTentacleLeft2Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseRotMatrix,bigTentacleLeft2Matrix);
	torsoHeadNoseBigTentacleLeft2Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleLeft2Matrix,animationLeftMatrix);
	torsoHeadNoseBigTentacleLeft2Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleLeft2Matrix,torsoHeadNoseBigTentacleLeft2Angle);
	var torsoHeadNoseBigTentacleLeft3Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseRotMatrix,bigTentacleLeft3Matrix);
	torsoHeadNoseBigTentacleLeft3Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleLeft3Matrix,animationDownMatrix);
	torsoHeadNoseBigTentacleLeft3Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleLeft3Matrix,animationLeftMatrix);
	torsoHeadNoseBigTentacleLeft3Matrix = new THREE.Matrix4().multiplyMatrices(torsoHeadNoseBigTentacleLeft3Matrix,torsoHeadNoseBigTentacleLeft3Angle);
	bigTentacleRight1.setMatrix(torsoHeadNoseBigTentacleRight1Matrix);
	bigTentacleRight2.setMatrix(torsoHeadNoseBigTentacleRight2Matrix);
	bigTentacleRight3.setMatrix(torsoHeadNoseBigTentacleRight3Matrix);
	bigTentacleLeft1.setMatrix(torsoHeadNoseBigTentacleLeft1Matrix);
	bigTentacleLeft2.setMatrix(torsoHeadNoseBigTentacleLeft2Matrix);
	bigTentacleLeft3.setMatrix(torsoHeadNoseBigTentacleLeft3Matrix);
}

// Extra Function for Animation Fetal Position
function animationFetalPosition(animationDownMatrix) {
	var pawBackLeftRotMatrix = new THREE.Matrix4().multiplyMatrices(pawBackLeftMatrix,animationDownMatrix);
	pawBackLeft.setMatrix(pawBackLeftRotMatrix);
	pawBackLeftOutside.setMatrix(pawBackLeftRotMatrix);
	var clawsBackLeftRotMatrix = new THREE.Matrix4().multiplyMatrices(pawBackLeftRotMatrix,clawBackLeftMatrix);
	clawsPawBackLeft.setMatrix(clawsBackLeftRotMatrix);
	var pawBackRightRotMatrix = new THREE.Matrix4().multiplyMatrices(pawBackRightMatrix,animationDownMatrix);
	pawBackRight.setMatrix(pawBackRightRotMatrix);
	pawBackRightOutside.setMatrix(pawBackRightRotMatrix);
	var clawsBackRightRotMatrix = new THREE.Matrix4().multiplyMatrices(pawBackRightRotMatrix,clawBackRightMatrix);
	clawsPawBackRight.setMatrix(clawsBackRightRotMatrix);
}

function updateBody() {

	// Common Matrices Used For Various Animations
			var rotateUp = new THREE.Matrix4().set(1,        0,         0,        0, 
																						 0, Math.cos(-p),-Math.sin(-p), 0, 
																						 0, Math.sin(-p), Math.cos(-p), 0,
																						 0,        0,         0,        1); 
			var rotateHeadRight = new THREE.Matrix4().set( Math.cos(-p),   0,   Math.sin(-p),  -2*p,
																												 0,          1,        0,        0,
																										-Math.sin(-p),   0,   Math.cos(-p),  -p/2,
																												 0,          0,        0,        1);
			var rotateNeckRight = new THREE.Matrix4().set( Math.cos(-p),   0,   Math.sin(-p),  -p,
																												 0,          1,        0,        0,
																										-Math.sin(-p),   0,   Math.cos(-p),  -p/2,
																												 0,          0,        0,        1);
			var rotateHeadLeft = new THREE.Matrix4().set(  Math.cos(p),   0,    Math.sin(p),  2*p,
																												0,          1,        0,        0,
																										-Math.sin(p),   0,    Math.cos(p),  -p/2,
																												0,          0,        0,        1);
			var rotateNeckLeft = new THREE.Matrix4().set(  Math.cos(p),   0,    Math.sin(p),  p,
																												0,          1,        0,        0,
																										-Math.sin(p),   0,    Math.cos(p),  -p/2,
																												0,          0,        0,        1);
			var rotateTailRight = new THREE.Matrix4().set( Math.cos(p),   0,    Math.sin(p),  -2*p,
																												0,          1,        0,        0,
																										-Math.sin(p),   0,    Math.cos(p),  p/2,
																												0,          0,        0,        1);
			var rotateTailLeft = new THREE.Matrix4().set( Math.cos(-p),   0,   Math.sin(-p),  2*p,
																												 0,         1,        0,        0,
																									 -Math.sin(-p),   0,   Math.cos(-p),  p/2,
																												 0,         0,        0,        1);
			var rotatePaws = new THREE.Matrix4().set(1,        0,         0,        0, 
																							 0,  Math.cos(p), -Math.sin(p), 0, 
																							 0,  Math.sin(p),  Math.cos(p), 0,
																							 0,        0,         0,        1);
			var rotateClaws = new THREE.Matrix4().set(1,        0,         0,        0, 
																								0,  Math.cos(p), -Math.sin(p), 2*p, 
																								0,  Math.sin(p),  Math.cos(p), p,
																								0,        0,         0,        1);

	switch(true) {
		case(key == "U" && animate):
			var time = clock.getElapsedTime(); // t seconds passed since the clock started.

			if (time > time_end){
				p = p1;
				animate = false;
				break;
			}

			p = (p1 - p0)*((time-time_start)/time_length) + p0; // current frame 
			if(jumpcut){
					p=p1;
			}

			animationTorso(rotateUp);
			break;

		case(key == "E" && animate):
			var time = clock.getElapsedTime(); // t seconds passed since the clock started.

			if (time > time_end){
				p = p1;
				animate = false;
				break;
			}

			p = (p1 - p0)*((time-time_start)/time_length) + p0; // current frame 
			if(jumpcut){
					p=p1;
			}

			var rotateDown = new THREE.Matrix4().set(1,        0,         0,        0, 
																							 0,  Math.cos(p), -Math.sin(p), 0, 
																							 0,  Math.sin(p),  Math.cos(p), 0,
																							 0,        0,         0,        1);
			animationTorso(rotateDown);
			break;

		case(key == "H" && animate):
			var time = clock.getElapsedTime(); // t seconds passed since the clock started.
			if(jumpcut){
					p=p1;
			}

			if (time > time_end){
				p = p1;
				animate = false;
				break;
			}

			p = (p1 - p0)*((time-time_start)/time_length) + p0; // current frame 
			if(jumpcut){
					p=p1;
			}

			animationHead(rotateHeadRight, rotateNeckRight);
			break;

		case(key == "G" && animate):
			var time = clock.getElapsedTime(); // t seconds passed since the clock started.

			if (time > time_end){
				p = p1;
				animate = false;
				break;
			}

			p = (p1 - p0)*((time-time_start)/time_length) + p0; // current frame 
			if(jumpcut){
					p=p1;
			}

			animationHead(rotateHeadLeft,rotateNeckLeft);
			break;

		case(key == "T" && animate):
			var time = clock.getElapsedTime(); // t seconds passed since the clock started.

			if (time > time_end){
				p = p1;
				animate = false;
				break;
			}

			p = (p1 - p0)*((time-time_start)/time_length) + p0; // current frame 
			if(jumpcut){
					p=p1;
			}

			animationTail(rotateTailRight);
			break;

		case(key == "V" && animate):
			var time = clock.getElapsedTime(); // t seconds passed since the clock started.

			if (time > time_end){
				p = p1;
				animate = false;
				break;
			}

			p = (p1 - p0)*((time-time_start)/time_length) + p0; // current frame 
			if(jumpcut){
					p=p1;
			}

			animationTail(rotateTailLeft);
			break;

		case(key == "N" && animate):
			var time = clock.getElapsedTime(); // t seconds passed since the clock started.

			if (time > time_end){
				p = p1;
				animate = false;
				break;
			}

			p = (p1 - p0)*((time-time_start)/time_length) + p0; // current frame 
			if(jumpcut){
					p=p1;
			}

			var rotateUp = new THREE.Matrix4().set(1,        0,         0,        0, 
																						 0, Math.cos(-p),-Math.sin(-p), p/2, 
																						 0, Math.sin(-p), Math.cos(-p), 0,
																						 0,        0,         0,        1);
			var rotateDown = new THREE.Matrix4().set(1,        0,         0,        0, 
																							 0,  Math.cos(p), -Math.sin(p), -p/2, 
																							 0,  Math.sin(p),  Math.cos(p), 0,
																							 0,        0,         0,        1);
			var rotateLeft = new THREE.Matrix4().set( Math.cos(p),   0,    Math.sin(p),  p/4,
																									 0,          1,        0,        0,
																							 -Math.sin(p),   0,    Math.cos(p),  -p/2,
																									 0,          0,        0,        1);
			var rotateRight = new THREE.Matrix4().set( Math.cos(-p),  0,   Math.sin(-p),  -p/4,
																										0,          1,        0,        0,
																								-Math.sin(-p),  0,   Math.cos(-p),  -p/2,
																										0,          0,        0,        1);
			animationNose(rotateUp,rotateDown,rotateLeft,rotateRight);
			break;

		case(key == "S" && animate):
			var time = clock.getElapsedTime(); // t seconds passed since the clock started.

			if (time > time_end){
				p = p1;
				animate = false;
				break;
			}

			p = (p1 - p0)*((time-time_start)/time_length) + p0; // current frame 
			if(jumpcut){
					p=p1;
			}

			var rotateUp = new THREE.Matrix4().set(1,        0,         0,        0, 
																						 0, Math.cos(-p),-Math.sin(-p), p/2, 
																						 0, Math.sin(-p), Math.cos(-p), 0,
																						 0,        0,         0,        1);
			var rotateDown = new THREE.Matrix4().set(1,        0,         0,        0, 
																							 0,  Math.cos(p), -Math.sin(p), -p/2, 
																							 0,  Math.sin(p),  Math.cos(p), 0,
																							 0,        0,         0,        1);
			var rotateLeft = new THREE.Matrix4().set( Math.cos(p),   0,    Math.sin(p),  p/4,
																									 0,          1,        0,        0,
																							 -Math.sin(p),   0,    Math.cos(p),  -p/2,
																									 0,          0,        0,        1);
			var rotateRight = new THREE.Matrix4().set( Math.cos(-p),  0,   Math.sin(-p),  -p/4,
																										0,          1,        0,        0,
																								-Math.sin(-p),  0,   Math.cos(-p),  -p/2,
																										0,          0,        0,        1);
			var rotatePawsDown = new THREE.Matrix4().set(1,        0,         0,        0, 
																							 		 0,  Math.cos(p), -Math.sin(p), -p/2, 
																							 		 0,  Math.sin(p),  Math.cos(p), 0,
																							 		 0,        0,         0,        1);

		if (swim == 1) {
    		animationSwimLeft(rotatePawsDown);
			animationSwimHead(rotateHeadRight,rotateNeckRight,rotateUp,rotateDown,rotateLeft,rotateRight);
			animationTail(rotateTailLeft);
		} else if (swim == 2) {
    		animationSwimLeft(rotatePawsDown);
			animationSwimHead(rotateHeadRight,rotateNeckRight,rotateUp,rotateDown,rotateLeft,rotateRight);
			animationTail(rotateTailLeft);
      	} else if (swim == 3) {
        	animationSwimRight(rotatePawsDown);
			animationSwimHead(rotateHeadLeft,rotateNeckLeft,rotateUp,rotateDown,rotateLeft,rotateRight);
			animationTail(rotateTailRight);
      	} else if (swim == 0) {
        	animationSwimRight(rotatePawsDown);
			animationSwimHead(rotateHeadLeft,rotateNeckLeft,rotateUp,rotateDown,rotateLeft,rotateRight);
			animationTail(rotateTailRight);
      	}
			break;

		case(key == "D" && animate):
			var time = clock.getElapsedTime(); // t seconds passed since the clock started.

			if (time > time_end){
				p = p1;
				animate = false;
				break;
			}

			p = (p1 - p0)*((time-time_start)/time_length) + p0; // current frame 
			if(jumpcut){
					p=p1;
			}

			animationDig(rotatePaws,rotateClaws);
			break;

		// Pray Animation
		case(key == "P" && animate):
			var time = clock.getElapsedTime(); // t seconds passed since the clock started.

			if (time > time_end){
				p = p1;
				animate = false;
				break;
			}

			p = (p1 - p0)*((time-time_start)/time_length) + p0; // current frame 
			if(jumpcut){
					p=p1;
			}

			var rotateDown = new THREE.Matrix4().set(1,        0,         0,        0, 
																							 0,  Math.cos(p), -Math.sin(p), -p/2, 
																							 0,  Math.sin(p),  Math.cos(p), 3*p,
																							 0,        0,         0,        1);
			var rotateHeadDown = new THREE.Matrix4().set(1,        0,         0,        0, 
																							 		 0,  Math.cos(p), -Math.sin(p), -p/2, 
																							 		 0,  Math.sin(p),  Math.cos(p), 0,
																							 		 0,        0,         0,        1);
			var rotateNeckDown = new THREE.Matrix4().set(1,        0,         0,        0, 
																							 		 0,  Math.cos(p), -Math.sin(p), -p/2, 
																							 		 0,  Math.sin(p),  Math.cos(p), 0,
																							 		 0,        0,         0,        1);

			animationTorso(rotateUp);
			animationHead(rotateHeadDown, rotateNeckDown);
			animationDig(rotatePaws,rotateClaws);
			animationFetalPosition(rotateDown)
			break;

		default:
			break;
	}
}

// LISTEN TO KEYBOARD
// Hint: Pay careful attention to how the keys already specified work!
var keyboard = new THREEx.KeyboardState();
var grid_state = false;
var key;
keyboard.domElement.addEventListener('keydown',function(event){

	if (event.repeat) { return; }
	else { basicPose(); }

	if(keyboard.eventMatches(event,"Z")){  // Z: Reveal/Hide helper grid
		grid_state = !grid_state;
		grid_state? scene.add(grid) : scene.remove(grid);}   
	else if(keyboard.eventMatches(event,"0")){    // 0: Set camera to neutral position, view reset
		camera.position.set(100,0,0);
		camera.lookAt(scene.position);}
	else if(keyboard.eventMatches(event,"U")){ 
		(key == "U")? init_animation(p1,p0,time_length) : (init_animation(0,Math.PI/4,1), key = "U")}  
	else if(keyboard.eventMatches(event,"E")){ 
		(key == "E")? init_animation(p1,p0,time_length) : (init_animation(0,Math.PI/4,1), key = "E")}  
	else if(keyboard.eventMatches(event,"H")){
		(key == "H")? init_animation(p1,p0,time_length) : (init_animation(0,Math.PI/4,1), key = "H")}
	else if(keyboard.eventMatches(event,"G")){
		(key == "G")? init_animation(p1,p0,time_length) : (init_animation(0,Math.PI/4,1), key = "G")}
	else if(keyboard.eventMatches(event,"T")){
		(key == "T")? init_animation(p1,p0,time_length) : (init_animation(0,Math.PI/4,1), key = "T")}
	else if(keyboard.eventMatches(event,"V")){
		(key == "V")? init_animation(p1,p0,time_length) : (init_animation(0,Math.PI/4,1), key = "V")}
	else if(keyboard.eventMatches(event,"N")){
		(key == "N")? init_animation(p1,p0,time_length) : (init_animation(0,Math.PI/4,1), key = "N")}
	else if(keyboard.eventMatches(event,"S")){
		if (swim == 0) { swim++; }
    else if (swim == 1) { swim++; }
    else if (swim == 2) { swim++; }
    else { swim = 0; }
		(key == "S")? init_animation(p1,p0,time_length) : (init_animation(0,Math.PI/4,1), key = "S")}
	else if(keyboard.eventMatches(event,"D")){
		(key == "D")? init_animation(p1,p0,time_length) : (init_animation(0,Math.PI/4,1), key = "D")}
	else if(keyboard.eventMatches(event,"P")){
		(key == "P")? init_animation(p1,p0,time_length) : (init_animation(0,Math.PI/4,1), key = "P")}
	else if(keyboard.eventMatches(event,"space")) {
		if(jumpcut) { jumpcut = false; } 
		else { jumpcut = true; } 
	}

	// TO-DO: BIND KEYS TO YOUR JUMP CUTS AND ANIMATIONS
	// Note: Remember spacebar sets jumpcut/animate! 
	// Hint: Look up "threex.keyboardstate by Jerome Tienne" for more info.

});

// SETUP UPDATE CALL-BACK
// Hint: It is useful to understand what is being updated here, the effect, and why.
function update() {
	updateBody();

	requestAnimationFrame(update);
	renderer.render(scene,camera);
}

update();