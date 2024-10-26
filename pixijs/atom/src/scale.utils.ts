import * as d3 from "d3-scale"
import { Vector2 } from "./types"

export function getLinearScaleTick(domain : Vector2, range : Vector2, opts : any = null) {
  const linearScale =  d3.scaleLinear(domain, range)
  
  return (_ : number)=> ({value : linearScale(_)})
}

