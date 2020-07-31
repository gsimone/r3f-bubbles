import React, {useRef} from 'react'
import { useFrame } from 'react-three-fiber'
import { useTextureLoader } from 'drei'

import * as THREE from 'three'

import mergeRefs from 'merge-refs'

import { makeNoise } from './lib'

const Material = React.forwardRef(function Material(props, forwardedRef) {

    const matRef = useRef()

    // initialize canvas and an array for image data
    const {arr, canvas,context} = React.useMemo(() => {
        const canvas = document.createElement('canvas')
        canvas.width = 256
        canvas.height = 256
        const context = canvas.getContext('2d')

        const arr = new Uint8ClampedArray(canvas.width * canvas.height * 4);

        return { canvas, context, arr }
    }, [])

    useFrame(({clock, mouse}) => {
        const F = Math.abs(mouse.x) + 0.5 * 100
        const offset = clock.getElapsedTime() / 2
        
        // generate noise to canvas
        makeNoise({canvas, context, F, offset, arr})

        // assign canvas to displacementMap image
        displacementMap.current.image = canvas

        // update material
        matRef.current.displacementMap.needsUpdate = true

    })
    
    const bumpMap = useTextureLoader('./bump.jpg')

    const displacementMap = React.useRef()

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
        <meshStandardMaterial 
        color="#010101" 
        
        metalness={1} 
        roughness={0.1}
        
        ref={mergeRefs(forwardedRef, matRef)} 

        bumpMap={bumpMap} 
        bumpScale={0.0004}

        displacementScale={0.1}
      >
        <canvasTexture 
          ref={displacementMap}
          attach="displacementMap"
          wrapS={THREE.RepeatWrapping}
          wrapT={THREE.RepeatWrapping}
        />
      </meshStandardMaterial>
    )
})

export default Material
