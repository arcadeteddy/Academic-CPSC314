varying vec4 vertexColor;

// Constants
uniform float kAmbient;
uniform float kDiffuse;
uniform float kSpecular;
uniform float shininess;

// Lights
uniform vec3 lightPosition;
uniform vec3 lightColor;
uniform vec3 ambientColor;

void main() {
	vec4 ambient; // Ia * kAmbient
	vec4 diffuse; // Il * kDiffuse * (normal • light)
	vec4 specular; // Il * kSpecular * (vertex • reflection)^(shininess)

    vec4 light = normalize(viewMatrix * vec4(lightPosition, 0.0));
	vec4 normal = vec4(normalize(normalMatrix * normal), 0.0);
	vec4 vertex = modelViewMatrix * vec4(position, 0.0);

	vec4 reflection = reflect(light, normal);

	ambient = kAmbient * vec4(ambientColor, 1.0);
	diffuse = kDiffuse * dot(normal, light) * vec4(lightColor, 1.0);

	float s = pow(abs(dot(reflection, vertex)), shininess); 
	specular = kSpecular * vec4(s, s, s, 1.0) * vec4(lightColor, 1.0);

	vertexColor = ambient + diffuse + specular;

	gl_Position = projectionMatrix *  modelViewMatrix * vec4(position, 1.0);
}