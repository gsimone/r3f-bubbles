varying vec3 vColor;
varying vec3 vNormal;

struct HemisphereLight {
  vec3 direction;
  vec3 groundColor;
  vec3 skyColor;
};
void main() {
  gl_FragColor = vec4(vNormal, 1.0);
}
