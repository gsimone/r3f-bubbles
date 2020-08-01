import * as THREE from 'three'
import React, { useRef, useEffect, useMemo } from 'react'
import { useLoader, useFrame, useThree } from 'react-three-fiber'
import { useControl } from 'react-three-gui'
import { useTextureLoader } from 'drei'
import mergeRefs from 'merge-refs'
import './materials/DistortMaterial'

const MATERIAL = 'Material'
const SHADER = 'Shader'

const ShaderMaterial = React.forwardRef(function ShaderMaterial(props, forwardedRef) {
  const matRef = useRef()

  // material settings
  const color = useControl('color', { group: MATERIAL, type: 'color', value: '#010101' })
  const roughness = useControl('roughness', { group: MATERIAL, type: 'number', value: 0.1, max: 1 })
  const metalness = useControl('metalness', { group: MATERIAL, type: 'number', value: 1, max: 1 })
  const reflectivity = useControl('reflectivity', { group: MATERIAL, type: 'number' })
  const clearcoat = useControl('clearcoat', { group: MATERIAL, type: 'number', value: 1, max: 1 })
  const clearcoatRoughness = useControl('clearcoat roughness', { group: MATERIAL, type: 'number', value: 1, max: 1 })
  const bumpScale = useControl('bump scale', { group: MATERIAL, type: 'number', value: 0.32, step: 0.1, max: 5 })

  // shader settings
  const radius = useControl('radius', { group: SHADER, type: 'number', value: 1, max: 1 })
  const distort = useControl('distort', { group: SHADER, type: 'number', value: 0.4, max: 1 })

  const bumpMap = useLoader(THREE.TextureLoader, './bump.jpg')

  const { gl } = useThree()
  const envMapTexture = useTextureLoader('/_DHQ.jpg')
  const envMap = useMemo(() => {
    const generator = new THREE.PMREMGenerator(gl)
    generator.compileEquirectangularShader()
    const hdrCubeRenderTarget = generator.fromCubemap(envMapTexture)
    envMapTexture.dispose()
    generator.dispose()
    return hdrCubeRenderTarget.texture
  }, [envMapTexture, gl])

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
      color={color}
      roughness={roughness}
      metalness={metalness}
      bumpMap={bumpMap}
      bumpScale={bumpScale / 100}
      reflectivity={reflectivity}
      clearcoat={clearcoat}
      clearcoatRoughness={clearcoatRoughness}
    />
  )
})

export default ShaderMaterial
