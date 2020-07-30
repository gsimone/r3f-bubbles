import { noise } from './noise'

export function makeNoise({arr, canvas, context, F, offset}) {
    
    // Iterate through every pixel
    for (let i = 0; i < arr.length; i += 4) {
      const index = i/4
  
      const row = Math.floor(index / canvas.width)
      const col = index % canvas.width
  
      const value = noise.perlin2(row/ F + offset,  col/ F + offset);
  
        var color = Math.abs(value) * 256;
  
        arr[i] = color 
        arr[i + 3] = 255 
    }
  
    let imageData = new ImageData(arr, canvas.width);
  
    context.putImageData(imageData, 0, 0)
  
  }
