export function elevationToGrayscale(elevation) {
    const value = Math.floor(elevation * 255);
    return `rgb(${value}, ${value}, ${value})`;
  }