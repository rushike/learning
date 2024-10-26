import { Vector2 } from "./types";

export function polor(x : number, y : number) : Vector2 {
  const r = Math.sqrt(x * x + y * y);
  const theta = Math.atan2(y, x);
  return [r, theta]; 
}

export function cartesian(r : number, theta : number) : Vector2 {
  return [r * Math.cos(theta), r * Math.sin(theta)]
}

export function translate(x : number, y : number, xdist : number, ydist : number) : Vector2 {
  return [x + xdist, y + ydist];
}


export function rotate(x : number, y : number, xpivot : number, ypivot : number, angle : number) : Vector2 {
    const cosValue = Math.cos(angle);
    const sinValue = Math.sin(angle);

    // Translate point back to origin (relative to pivot)
    const translatedX = x - xpivot;
    const translatedY = y - ypivot;
    
    // Rotate the point using the 2D rotation formula
    const rotatedX = translatedX * cosValue - translatedY * sinValue;
    const rotatedY = translatedX * sinValue + translatedY * cosValue;
    
    // Translate the point back to the original pivot
    const finalX = rotatedX + xpivot;
    const finalY = rotatedY + ypivot;
    
    return [finalX, finalY];
}