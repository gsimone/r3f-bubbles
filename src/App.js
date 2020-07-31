import React, { Suspense, useRef} from 'react';
import { Canvas, useFrame, useResource } from 'react-three-fiber'
import {  Icosahedron, OrbitControls } from 'drei'

import * as THREE from 'three'

import mergeRefs from 'merge-refs'

import Effects from './Effects'
import Material from './Material'

const dummy = new THREE.Object3D()

function Instances({ material }) {

  const iPos = [
    [-10, 5, -10],
    [13, -2, -12],
    [8, -10, -20],
    [-11, -12, -23]
  ]

  const elements = useRef([])
  function setRef(i, ref) {
    console.log(ref)
    elements.current[i] = ref
  }

  useFrame(({clock}) => {

    elements.current.forEach((el, i) => {

      let {x,y,z} = el.position

      y += 0.01

      el.position.set(x, y, z)

    })

  })
  

  return <group >
    <Elly material={material} position={[0,0,0]} />

    {iPos.map((pos, i) => (
      <Elly position={[pos[0], pos[1] - 10, pos[2]]} material={material} key={i} ref={ref => setRef(i, ref)} />
    ))}

  </group>

}

const Elly = React.forwardRef(function Elly(props, ref) {

  const me = useRef()

  useFrame(({clock, mouse}) => {
    me.current.rotation.y = clock.getElapsedTime() / 2
  })

  return (
    <Icosahedron ref={mergeRefs(me, ref)} args={[1,4]} {...props} />
  )

})

function Scene() {

  // we use the useResource hook to only render the scene when the material is ready
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
