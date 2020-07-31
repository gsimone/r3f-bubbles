import { Icosahedron } from 'drei'
import React from 'react'

const Sphere = React.forwardRef(function Sphere(props, forwardedRef) {
  return <Icosahedron {...props} args={[1, 4]} ref={forwardedRef} />
})

export default Sphere
