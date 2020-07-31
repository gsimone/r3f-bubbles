import React, {useRef} from 'react'
import mergeRefs from 'merge-refs'

import * as THREE from 'three'
import { extend, useFrame } from 'react-three-fiber'
import { useTextureLoader } from 'drei'

import DistortMaterial from './materials/distort'

extend({ DistortMaterial })

const ShaderMaterial = React.forwardRef(function ShaderMaterial(props, forwardedRef) {

    const matRef = useRef()

    useFrame((state) => matRef.current && (matRef.current.time = state.clock.getElapsedTime()))

    const bumpMap = useTextureLoader('./bump.jpg')

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
        <distortMaterial ref={mergeRefs(forwardedRef, matRef)} color="#010101" roughness={0} metalness={1} bumpMap={bumpMap} bumpScale={0.001} />
    )

})

export default ShaderMaterial
