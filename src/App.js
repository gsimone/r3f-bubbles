import React, { Suspense, useRef} from 'react';
import { Canvas, useFrame, useLoader, useResource } from 'react-three-fiber'
import {  Icosahedron, Sphere, Text, useTextureLoader, OrbitControls, StandardEffects } from 'drei'

import Effects from './Effects'
import Material from './Material'

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

  return (
    <>
      <Material ref={matRef} />

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
