import React, {useRef} from 'react'
import { useFrame } from 'react-three-fiber'
import { useTextureLoader } from 'drei'

import * as THREE from 'three'

import mergeRefs from 'merge-refs'
import {noise} from './noise'

import {useGui, useGuiState} from './GuiContext'


const Material = React.forwardRef(function Material(props, forwardedRef) {

    const matRef = useRef()

   const settings = useGui({
       "size": [100, 0, 1000],
       "speed": [1, 0, 4],
       "noiseType": ["simplex2", { simplex: "simplex2", perlin: "perlin2" }]
    })

    const displacementScale = useGuiState('displacementScale', 0.5, 0, 1)
    const displacementBias = useGuiState('displacementBias', 0.1 ,0, 1.0)

    // initialize canvas and an array for image data
    const { arr, canvas,context } = React.useMemo(() => {
        const canvas = document.createElement('canvas')
        canvas.height = canvas.width = 512
        const context = canvas.getContext('2d')

        const arr = new Uint8ClampedArray(canvas.width * canvas.height * 4);

        return { canvas, context, arr }
    }, [])

    useFrame(({clock, mouse}) => {
        const {size, speed} = settings.current
        
        const offset = clock.getElapsedTime() / (1/speed)
        
        // generate noise to canvas
        // Iterate through every pixel
        for (let i = 0; i < arr.length; i += 4) {
            const index = i/4
        
            const row = Math.floor(index / canvas.width)
            const col = index % canvas.width
        
            const value = noise[settings.current.noiseType](offset + row/ size,  col/ size);
        
            var color = Math.abs(value) * 256;
        
            arr[i] = color 
            arr[i + 3] = 255 
        }
        
        let imageData = new ImageData(arr, canvas.width);
        
        context.putImageData(imageData, 0, 0)

        // assign canvas to displacementMap image
        displacementMap.current.image = canvas

        // update material
        matRef.current.displacementMap.needsUpdate = true
        
        document.querySelector('#material-test-canvas img')
            .src = canvas.toDataURL('image/jpeg')
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
        <>
            <meshStandardMaterial 
                color="#010101" 
                
                metalness={1} 
                roughness={0.1}
                
                ref={mergeRefs(forwardedRef, matRef)} 

                bumpMap={bumpMap} 
                bumpScale={0.001}

                displacementScale={displacementScale}
                displacementBias={displacementBias}
            >
            <canvasTexture 
                ref={displacementMap}
                attach="displacementMap"
                wrapS={THREE.RepeatWrapping}
                wrapT={THREE.RepeatWrapping}
            />
        </meshStandardMaterial>
      </>
    )
})

export default Material
