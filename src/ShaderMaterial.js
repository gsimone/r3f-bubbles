import * as THREE from 'three'
import React, { useRef, useEffect } from 'react'
import { useLoader, useFrame } from 'react-three-fiber'
import { useControl } from 'react-three-gui'
import mergeRefs from 'merge-refs'
import './materials/DistortMaterial'

const MATERIAL = 'Material'
const SHADER = 'Shader'

const ShaderMaterial = React.forwardRef(function ShaderMaterial(props, forwardedRef) {
  const matRef = useRef()

  // controls
  const roughness = useControl('roughness', { group: MATERIAL, type: 'number', value: 0.1, max: 1 })
  const metalness = useControl('metalness', { group: MATERIAL, type: 'number', value: 1, max: 1 })
  const clearcoat = useControl('clearcoat', { group: MATERIAL, type: 'number', value: 1, max: 1 })
  const clearcoatRoughness = useControl('clearcoat roughness', { group: MATERIAL, type: 'number', value: 1, max: 1 })
  const bumpScale = useControl('bump scale', { group: MATERIAL, type: 'number', value: 0.32, step: 0.1, max: 5 })
  const radius = useControl('radius', { group: SHADER, type: 'number', value: 1, max: 1 })
  const distort = useControl('distort', { group: SHADER, type: 'number', value: 0.4, max: 1 })

  const bumpMap = useLoader(THREE.TextureLoader, './bump.jpg')
  const [envMap] = useLoader(THREE.CubeTextureLoader, [
    ['px', 'nx', 'py', 'ny', 'pz', 'nz'].map((n) => `/cube/${n}.png`),
  ])

  // For some reason the envmap looks different if applied later-on
  useEffect(() => void (matRef.current.envMap = envMap), [envMap])

  useFrame((state) => {
    matRef.current.time = state.clock.getElapsedTime()
    matRef.current.radius = radius
    matRef.current.distort = distort
  })

  return (
    <distortMaterial
      ref={mergeRefs(forwardedRef, matRef)}
      color={'#010101'}
      roughness={roughness}
      metalness={metalness}
      bumpMap={bumpMap}
      bumpScale={bumpScale / 100}
      clearcoat={clearcoat}
      clearcoatRoughness={clearcoatRoughness}
    />
  )
})

export default ShaderMaterial
