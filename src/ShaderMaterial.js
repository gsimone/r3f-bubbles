import React, {useRef} from 'react'
import mergeRefs from 'merge-refs'

import * as THREE from 'three'
import { extend, useFrame } from 'react-three-fiber'
import { useTextureLoader } from 'drei'

import DistortMaterial from './materials/distort'
import { useGui, useGuiState } from './GuiContext'

extend({ DistortMaterial })

const ShaderMaterial = React.forwardRef(function ShaderMaterial(props, forwardedRef) {

    const matRef = useRef()

    const roughness = useGuiState('roughness', 0, 0, 1)
    const metalness = useGuiState('metalness', 1, 0, 1)
    const bumpScale = useGuiState('bumpScale', 0.001, 0.001, 0.01)
    const color = useGuiState.color('color', "#010101")

    const settings = useGui({
      "radius": [1, 0, 1],
      "distort": [0.4, 0, 1]
   })

    useFrame((state) => {
      if (matRef.current) {
        matRef.current.time = state.clock.getElapsedTime()
        matRef.current.radius = settings.current.radius
        matRef.current.distort = settings.current.distort
      }
    })

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
        <distortMaterial 
          ref={mergeRefs(forwardedRef, matRef)} 
          color={color}
          roughness={roughness} 
          metalness={metalness} 
          bumpMap={bumpMap} 
          bumpScale={bumpScale}
        />
    )

})

export default ShaderMaterial
