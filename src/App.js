import * as THREE from 'three'
import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame, useResource } from 'react-three-fiber'
import { Icosahedron, OrbitControls } from 'drei'
import mergeRefs from 'merge-refs'
import { Controls, useControl } from 'react-three-gui'

import Effects from './Effects'
import ShaderMaterial from './ShaderMaterial'

function MainBall({ material }) {
  const main = useRef()

  // main ball
  useFrame(({ clock, mouse }) => {
    main.current.rotation.z = clock.getElapsedTime()
    main.current.rotation.y = THREE.MathUtils.lerp(main.current.rotation.y, mouse.x * 3, 0.1)
    main.current.rotation.x = THREE.MathUtils.lerp(main.current.rotation.x, mouse.y * 2, 0.1)
  })

  return <Elly material={material} ref={main} position={[0, 0, 0]} />
}

function Instances({ material }) {
  const smallerBalls = useRef([])
  const iPos = [
    [-4, 20, -12],
    [-10, 12, -8],
    [-11, -12, -23],
    [-16, -6, -10],
    [12, -2, -6],
    [13, -2, -12],
    [14, -2, -23],
    [8, -10, -20],
  ]

  // smaller balls movement
  useFrame(({ clock }) => {
    smallerBalls.current.forEach((el, i) => {
      let { x, y, z } = el.position
      y += 0.02
      if (y > 19) y = -18
      el.position.set(x, y, z)
      el.rotation.x += 0.06
      el.rotation.y += 0.06
      el.rotation.z += 0.02
    })
  })

  return (
    <group>
      <MainBall material={material}></MainBall>
      {iPos.map((pos, i) => (
        <Elly
          position={[pos[0], pos[1], pos[2]]}
          material={material}
          key={i}
          ref={(ref) => (smallerBalls.current[i] = ref)}
        />
      ))}
    </group>
  )
}

const Elly = React.forwardRef(function Elly(props, ref) {
  const me = useRef()
  return <Icosahedron ref={mergeRefs(me, ref)} args={[1, 4]} {...props} />
})

function Scene() {
  const [matRef, material] = useResource()
  return (
    <>
      <ShaderMaterial ref={matRef} />
      <Effects edgeDetection={0.4} />
      {material && <Instances material={material} />}
    </>
  )
}

function App() {
  return (
    <>
      <Canvas
        colorManagement
        concurrent
        camera={{ position: [0, 0, 3] }}
        onCreated={({ gl }) => gl.setClearColor('#040404')}>
        <fog color="#222" attach="fog" near={8} far={30} />
        <ambientLight intensity={1} />
        <hemisphereLight args={[0xffffff, 0x666666, 1]} />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
        <OrbitControls />
      </Canvas>
      <Controls />
    </>
  )
}

export default App
