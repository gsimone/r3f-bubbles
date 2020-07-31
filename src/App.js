import * as THREE from 'three'
import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame, useResource } from 'react-three-fiber'
import { Controls } from 'react-three-gui'

import Sphere from './Sphere'
import ShaderMaterial from './ShaderMaterial'

import Effects from './Effects'

function MainBall({ material }) {
  const main = useRef()

  // main sphere rotates following the mouse position
  useFrame(({ clock, mouse }) => {
    main.current.rotation.z = clock.getElapsedTime()
    main.current.rotation.y = THREE.MathUtils.lerp(main.current.rotation.y, mouse.x * 3, 0.1)
    main.current.rotation.x = THREE.MathUtils.lerp(main.current.rotation.x, mouse.y * 2, 0.1)
  })

  return <Sphere material={material} ref={main} position={[0, 0, 0]} />
}

function Instances({ material }) {
  // we use this array to initialize the background spheres
  const initialPositions = [
    [-4, 20, -12],
    [-10, 12, -8],
    [-11, -12, -23],
    [-16, -6, -10],
    [12, -2, -6],
    [13, 4, -12],
    [14, -2, -23],
    [8, 10, -20],
  ]

  // we use this array ref to store the spheres after creating them
  const smallerBalls = useRef([])

  // smaller balls movement
  useFrame(() => {
    // animate each sphere in the array
    smallerBalls.current.forEach((el, i) => {
      let { y } = el.position
      y += 0.02
      if (y > 19) y = -18
      el.position.y = y
      el.rotation.x += 0.06
      el.rotation.y += 0.06
      el.rotation.z += 0.02
    })
  })

  return (
    <group>
      <MainBall material={material}></MainBall>
      {initialPositions.map((pos, i) => (
        <Sphere
          position={[pos[0], pos[1], pos[2]]}
          material={material}
          key={i}
          ref={(ref) => (smallerBalls.current[i] = ref)}
        />
      ))}
    </group>
  )
}

function Scene() {
  // We use `useResource` to be able to delay rendering the spheres until the material is ready
  const [matRef, material] = useResource()
  return (
    <>
      <ShaderMaterial ref={matRef} />

      {/* All the spheres are only rendered once the material is ready */}
      {material && <Instances material={material} />}

      <Effects />
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
        onCreated={({ gl }) => gl.setClearColor('#020202', 1)}>
        <fog color="#161616" attach="fog" near={8} far={30} />
        <ambientLight intensity={1} />

        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <div className="three-gui-container">
        <Controls />
      </div>
    </>
  )
}

export default App
