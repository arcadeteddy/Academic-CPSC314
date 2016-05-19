// Shared Variables
varying vec4 vertexViewPosition;
varying vec4 vertexNormal;
varying vec4 light;

// Lights
uniform vec3 lightPosition;

void main() {
	vertexNormal = vec4(normalize(normalMatrix * normal), 0.0);
    vertexViewPosition = modelViewMatrix * vec4(position, 0.0);

	light = viewMatrix * vec4(normalize(lightPosition), 0.0);

	gl_Position = projectionMatrix *  modelViewMatrix * vec4(position, 1.0);
}