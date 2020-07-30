import React, { Suspense, useRef} from 'react';
import { Canvas, useFrame, useLoader, useResource } from 'react-three-fiber'
import {  Icosahedron, Sphere, Text, useTextureLoader, OrbitControls, StandardEffects } from 'drei'
import * as THREE from 'three'

import {makeNoise} from './lib'
import Effects from './Effects'

function Instances({ material }) {
 
  return <group >
    <Elly material={material} position={[0,0,0]} />
    <Elly material={material} position={[-10, 5, -10]} />
    <Elly material={material} position={[13, -2, -12]} />
    <Elly material={material} position={[8, -10, -20]} />
    <Elly material={material} position={[-11, -12, -23]} />
  </group>

}

function Elly(props) {

  const me = useRef()

  useFrame(({clock, mouse}) => {
    me.current.rotation.y = clock.getElapsedTime() / 2
  })

  return (
    <Icosahedron ref={me} args={[1,4]} {...props} />
  )

}

function Scene() {

  const [matRef, material] = useResource()

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
 
   }, [matRef])
 
   

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

  return (
    <>
      <meshPhysicalMaterial 
        color="#010101" 
        
        metalness={1} 
        roughness={0.1}
        
        ref={matRef} 

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
      </meshPhysicalMaterial>

        
       <Effects edgeDetection={0.4}  />

      {/* queste sono le sfere originali, commentate */}
      {material && <Instances material={material} />}

      {/* <Text 
        fontSize={0.75} 
        position-z={2}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
      >
        drei
      </Text> */}
      </>
  )
}

function App() {
  
  return (
    <>
    <Canvas
      colorManagement
      camera={{ position: [0, 0, 3] }}
      style={{
        background: "#050505",
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }}
      concurrent
      onCreated={({ gl }) => {
          gl.setClearColor('#040404')
        }}
    > 
      <fog color="#222" attach="fog" near={8} far={30} />
      
        <ambientLight intensity={1} />

      <Suspense fallback={null}>
        <Scene />
      </Suspense>

      <OrbitControls />
    </Canvas>
    
    </>
  );
}

export default App;
