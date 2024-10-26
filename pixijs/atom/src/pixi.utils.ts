import { Graphics, TextStyle, Text, Application } from 'pixi.js';
import uuid4 from "uuid4";

import { Vector2 } from './types';
import defaultState, { State } from './state';
import { getLinearScaleTick } from './scale.utils';



export async function createApp(opts ?: any) {
  const app = new Application();
  const width = opts?.width || 1600;
  const height = opts?.height || 1600;
  const resolution = opts?.resolution || window.devicePixelRatio;
  const canvasParent = (opts?.selector && document.querySelector(opts?.selector))|| document.body;
  
  // @ts-ignore adding id for unique identification
  app.id = uuid4();

  await app.init({ background : "#000", height, width, resolution})
    .then(_=>canvasParent.appendChild(app.canvas))
  return app;
}

export function line(start : Vector2, end : Vector2, opts : any) {
  
  const graphics : Graphics = opts.graphics || new Graphics();

  graphics.moveTo(...start);
  graphics.lineTo(...end);
  graphics.stroke({color : opts.color, width : 1})

  return graphics;
}

export function text(str : string, position : Vector2, opts ?: any) {
  const state = opts?.state || defaultState

  const style = opts?.style ? opts.style : new TextStyle({
    fontFamily: 'Arial',
    fontSize: 10,
    fontWeight: 'bold',
    // stroke: { color: state.theme.primary, width: 1 },
    fill : { color: state.theme.primary}
  });
  
  const text = new Text({text : str, style});
  text.x = position[0];
  text.y = position[1];

  return text;
}


/** Complex Shapes */
export function xAxis(position : Vector2, width : number, opts ?: any){
  const state : State = opts?.state || defaultState;

  const ticks = opts?.graphics || new Graphics();

  const linearScaleTick = opts?.linearScaleTick
  
  const [x , y] = position;

  for (let i = 0; i < 100; i++) {
    let offset = i % 10 == 0 ? 5 : ( i % 5 == 0 ? 3 : 0);
    let x = i * 10
    let start : Vector2 = [x, y];

    let end : Vector2 = [x, y + 3 + offset]
    console.log("inide look", start, end);
    
    line(start, end, {
      graphics : ticks,
      color : state.theme.primary
    })
  }

  // encosing line
  ticks.rect(x, y, width, 10).stroke({color : state.theme.primary, width : 1})

  // graphics.stroke({color : state.theme.primary, width : 2})
  console.log(state);
  
  const tickLabels : Text[] = [];
   for (let i = 0; i < 10; i++) {
    let x = i * 100;
    let d = i * 10;

    tickLabels.push(text(`${linearScaleTick(d).value.toFixed(0)}`, [x, 111]))
  }
  return [ticks, ...tickLabels]
}