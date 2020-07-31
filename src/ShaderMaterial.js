import React, {useRef} from 'react'
import mergeRefs from 'merge-refs'

import * as THREE from 'three'
import { extend, useFrame } from 'react-three-fiber'

import DistortMaterial from './materials/distort'

extend({ DistortMaterial })

const ShaderMaterial = React.forwardRef(function ShaderMaterial(props, forwardedRef) {

    const matRef = useRef()

    useFrame(({ clock }) => {
        matRef.current.uniforms.time.value += 1
        matRef.current.uniforms.radius.value = 1
        matRef.current.uniforms.distort.value = 0.4
    })

    React.useEffect(() => {
 
        const x = new THREE.CubeTextureLoader()
        .setPath( 'cube/' )
        .load( [
          '1.jpg',
          '2.jpg',
          '6.jpg',
          '4.jpg',
          '5.jpg',
          '3.jpg',
        ] );
   
        matRef.current.envMap = x
    
      }, [])

    return (
        <distortMaterial ref={mergeRefs(forwardedRef, matRef)} />
    )

})

export default ShaderMaterial
