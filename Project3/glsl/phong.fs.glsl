// Constants
uniform float kAmbient;
uniform float kDiffuse;
uniform float kSpecular;
uniform float shininess;

// Light Properties
uniform vec3 lightPosition;
uniform vec3 lightColor;
uniform vec3 ambientColor;

// Shared Variables
varying vec4 vertexViewPosition;
varying vec4 vertexNormal;
varying vec4 light;

void main() {
	vec4 ambient; // Ia * kAmbient
	vec4 diffuse; // Il * kDiffuse * (normal • light)
	vec4 specular; // Il * kSpecular * (vertex • reflection)^(shininess)

	vec4 reflection = reflect(light, vertexNormal);

	ambient = kAmbient * vec4(ambientColor, 1.0);
	diffuse = kDiffuse * dot(vertexNormal, light) * vec4(lightColor, 1.0);

	float s = pow(abs(dot(reflection, vertexViewPosition)), shininess); 
	specular = kSpecular * vec4(s, s, s, 1.0) * vec4(lightColor, 1.0);

	gl_FragColor = ambient + diffuse + specular;
}