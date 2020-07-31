import * as THREE from 'three'

import vertexShader from '../glsl/dist-v.glsl'
import fragmentShader from '../glsl/dist-f.glsl'

export default class DistortionMaterial extends THREE.ShaderMaterial {
    constructor() {
      super({
        uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib['lights'],
            {
              time: {
                type: 'f',
                value: 0,
              },
              radius: {
                type: 'f',
                value: 1.0
              },
              distort: {
                type: 'f',
                value: 0.4
              }
            }
          ]),
        vertexShader,
        fragmentShader
      })
    }

    get time() {
        return this.uniforms.time.value
    }

    set time(v) {
        this.uniforms.time.value = v
    }

    get radius() {
        return this.uniforms.time.radius
    }

    set radius(v) {
        this.uniforms.time.radius = v
    }
 
    get distort() {
        return this.uniforms.time.distort
    }

    set distort(v){
        this.uniforms.time.distort = v
    }

  }
