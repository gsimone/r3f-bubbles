import { useMemo, useEffect } from 'react'
import { HalfFloatType } from 'three'
import { useLoader, useThree, useFrame } from 'react-three-fiber'
import {
  SMAAImageLoader,
  BlendFunction,
  KernelSize,
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
  SMAAEffect,
  SSAOEffect,
  NormalPass,
  VignetteEffect,
  NoiseEffect,
  DepthOfFieldEffect,
} from 'postprocessing'

export default function Effects({
  smaa = true,
  ao = true,
  bloom = true,
  edgeDetection = 0.1,
  bloomOpacity = 1,
  effects,
}) {
  const { gl, scene, camera, size } = useThree()
  const smaaProps = useLoader(SMAAImageLoader, '')
  const composer = useMemo(() => {
    const composer = new EffectComposer(gl, { frameBufferType: HalfFloatType })
    composer.addPass(new RenderPass(scene, camera))

    const smaaEffect = new SMAAEffect(...smaaProps)
    smaaEffect.colorEdgesMaterial.setEdgeDetectionThreshold(edgeDetection)

    const normalPass = new NormalPass(scene, camera)

    const ssaoEffect = new SSAOEffect(camera, normalPass.renderTarget.texture, {
      blendFunction: BlendFunction.MULTIPLY,
      samples: 21,
      rings: 10,
      distanceThreshold: 1.0,
      distanceFalloff: 0.0,
      rangeThreshold: 0.015,
      rangeFalloff: 0.002,
      luminanceInfluence: 0.9,
      radius: 20,
      scale: 1.0,
      bias: 0.05,
      ...ao,
    })

    const depthOfFieldEffect = new DepthOfFieldEffect(camera, {
      focusDistance: 0,
      focalLength: 0.02,
      bokehScale: 2.0,
      height: 480,
    })

    const bloomEffect = new BloomEffect({
      blendFunction: BlendFunction.SCREEN,
      kernelSize: KernelSize.VERY_LARGE,
      luminanceThreshold: 0.1,
      luminanceSmoothing: 0.2,
      height: 200,
      ...bloom,
    })

    const noiseEffect = new NoiseEffect({ blendFunction: BlendFunction.COLOR_DODGE })

    noiseEffect.blendMode.opacity.value = 0.02

    const vignetteEffect = new VignetteEffect({ eskil: false, offset: 0.1, darkness: 1.1 })

    bloomEffect.blendMode.opacity.value = bloomOpacity

    const effectPass = new EffectPass(
      camera,
      smaaEffect,
      ssaoEffect,
      depthOfFieldEffect,
      bloomEffect,
      noiseEffect,
      vignetteEffect,
    )
    effectPass.renderToScreen = true
    composer.addPass(normalPass)
    composer.addPass(effectPass)
    
    return composer
  }, [gl, scene, camera, smaaProps, edgeDetection, ao, bloom, bloomOpacity])

  useEffect(() => void composer.setSize(size.width, size.height), [composer, size])

  return useFrame((_, delta) => composer.render(delta), 1)
}
