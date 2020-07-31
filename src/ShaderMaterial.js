import * as THREE from 'three'
import React, { useRef, useEffect } from 'react'
import mergeRefs from 'merge-refs'
import { useLoader, useFrame } from 'react-three-fiber'
import { useGui, useGuiState } from './GuiContext'
import './materials/DistortMaterial'

const ShaderMaterial = React.forwardRef(function ShaderMaterial(props, forwardedRef) {
  const matRef = useRef()
  const roughness = useGuiState('roughness', 0, 0, 1)
  const metalness = useGuiState('metalness', 1, 0, 1)
  const reflectivity = useGuiState('reflectivity', 0, 0, 1)
  const clearcoat = useGuiState('clearcoat', 1, 0, 1)
  const clearcoatRoughness = useGuiState('clearcoatRoughness', 1, 0, 1)
  const bumpScale = useGuiState('bumpScale', 0.001, 0.001, 0.01)
  const color = useGuiState.color('color', '#010101')
  const settings = useGui({ radius: [1, 0, 1], distort: [0.4, 0, 1] })

  const bumpMap = useLoader(THREE.TextureLoader, './bump.jpg')
  const [envMap] = useLoader(
    THREE.CubeTextureLoader,
    [['1.jpg', '2.jpg', '6.jpg', '4.jpg', '5.jpg', '3.jpg']],
    (loader) => loader.setPath('cube/'),
  )

  useEffect(() => {
    matRef.current.envMap = envMap
  }, [envMap])

  // For some reason the envmap looks different if applied later-on
  useEffect(() => void (matRef.current.envMap = envMap), [envMap])

  useFrame((state) => {
    matRef.current.time = state.clock.getElapsedTime()
    matRef.current.radius = settings.current.radius
    matRef.current.distort = settings.current.distort
  })

  return (
    <distortMaterial
      ref={mergeRefs(forwardedRef, matRef)}
      color={color}
      roughness={roughness}
      metalness={metalness}
      bumpMap={bumpMap}
      bumpScale={bumpScale}
      reflectivity={reflectivity}
      clearcoat={clearcoat}
      clearcoatRoughness={clearcoatRoughness}
    />
  )
})

export default ShaderMaterial
