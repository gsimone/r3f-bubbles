import { MeshPhysicalMaterial } from 'three'

import distort from '../glsl/distort.vert'

function WobbleMaterialImpl(parameters) {

  MeshPhysicalMaterial.call(this)
  
  this.setValues(parameters)
  
  this._time = { value: 0 }
  this._distort = { value: 0.4}
  this._radius = { value: 1}
  
  this.onBeforeCompile = (shader) => {

    shader.uniforms.time = this._time
    shader.uniforms.radius = this._radius
    shader.uniforms.distort = this._distort

    shader.vertexShader = `
      uniform float time;
      uniform float radius;
      uniform float distort;
      uniform float factor;
      
      varying vec3 vColor;
      
      ${distort}

      ${shader.vertexShader}
    `
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
        float updateTime = time / 50.0;
        float noise = snoise(vec3(position / 2.0 + updateTime * 5.0));
        vColor = hsv2rgb(vec3(noise * distort * 0.3 + updateTime, 0.2, 1.0));

        vec3 transformed = vec3(position * (noise * pow(distort, 2.0) + radius));

        gl_Position = vec4(position * 5.0, 1.0);
      
        `
    )
  }

  Object.defineProperty(this, 'time', {
    get: () => this._time,
    set: (val) => (this._time.value = val),
  })
  Object.defineProperty(this, 'distort', {
    get: () => this._distort,
    set: (val) => (this._distort.value = val),
  })
  Object.defineProperty(this, 'radius', {
    get: () => this._radius,
    set: (val) => (this._radius.value = val),
  })
}

WobbleMaterialImpl.prototype = Object.create(MeshPhysicalMaterial.prototype)
WobbleMaterialImpl.prototype.constructor = MeshPhysicalMaterial
WobbleMaterialImpl.prototype.isMeshPhysicalMaterial = true

export default WobbleMaterialImpl
