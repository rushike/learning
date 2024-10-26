import { Application, Container, Graphics } from "pixi.js"
import { State } from "./state"
import { rotate } from "./point.utils";
import { Vector2 } from "./types";
import { drag } from './pixi.event';
import duckdb from "./duck-db";

const elements = await duckdb.fetch("elements");

export interface EConfShellType {
  n : string
  o : string
}

export interface EConfType {
  base?: string
  s?   : EConfShellType
  p?   : EConfShellType
  d?   : EConfShellType
  f?   : EConfShellType
}

export interface ElementType {
  name             : string
  appearance      ?: string
  atomic_mass      : number
  boil            ?: number
  category         : string
  color           ?: string
  density         ?: number
  discovered_by   ?: string
  melt            ?: number
  molar_heat      ?: number
  named_by        ?: string
  number           : number
  period           : number
  phase            : string
  source           : string
  spectral_img    ?: string
  summary          : string
  symbol           : string
  xpos             : number
  ypos             : number
  shells           : number[]
  group            : number
  econf?           : EConfType
}


export function atomOrbit(center : Vector2, radius : number, shell : Vector2, opts ?: any){
 
  const graphics : Graphics = opts?.graphics || new Graphics();
  const color = opts?.color || "#F0F0FF";
  const eradius = opts?.eradius || 5;
  const [norbit, nelectrons] = shell;

  // orbit
  graphics.circle(center[0], center[1], radius)
  .stroke({color, width : 1})

  // electrons
  let startX = center[0] + radius, startY = center[1], rX, rY;
  for (let i = 0; i < nelectrons; i++) {
    [rX, rY] = rotate(startX, startY, center[0], center[1], Math.PI * 2 * i / nelectrons)
    graphics.circle(rX, rY, eradius)
      .fill({color})
  }

  const orbit = new Container().addChild(graphics);

  const tickers = []

  tickers.push((time : {deltaTime : number}) => {
    orbit.pivot.set(center[0], center[1]) 
    orbit.x = center[0];
    orbit.y = center[1];

    orbit.rotation += norbit / 1000 * time.deltaTime;
  })
  return {
    root : orbit,
    containers : [orbit],
    tickers
  }
}

function atom(element : ElementType, opts ?: any) {
  const height = opts.height;
  const width = opts.width;

  const atomContainer = new Container({label: "atom-container"});

  const tickers : ((time : {deltaTime : number}) => void)[] = [];
  
  atomContainer.pivot.set(width / 2, height / 2);
  atomContainer.position.set(width / 2, height / 2);


  // atomContainer.eventMode = 'static';
  atomContainer.cursor = 'pointer';
  // atomContainer.on('pointerdown', dragEvent.onDragStart, atomContainer);
  

  const center : Vector2 = [width / 2, height / 2];
  const color = "#F0F0FF";


  // atom nucleus
  // create container
  const nucleusContainer = new Container();
  atomContainer.addChild(nucleusContainer);

  // create graphics
  const nucleus = new Graphics();
  nucleus.circle(center[0], center[1], 25)
  .fill({color })
  nucleusContainer.addChild(nucleus);

  // orbits
  // create container
  const orbitContainer = new Container();
  atomContainer.addChild(orbitContainer);

  // create graphics
  console.log("element ???? ", element);
  
  element.shells.forEach ((nelectron, shell) => {
    let orbit = atomOrbit(center, 50, [shell, nelectron]);
    orbitContainer.addChild(orbit.root);
    tickers.push(...orbit.tickers);
  })
  
  // let coef = [0.025, 0.02, 0.015, 0.01, 0.004, 0.003];
  return {
    root : atomContainer,
    containers : {
      atomContainer,
      nucleusContainer,
      orbitContainer
    }, 
    tickers
  }
}


type AtomElementProps = {
  app    : Application,
  state  : State,
  symbol : string
}

export async function AtomElement(props : AtomElementProps) {
  const app = props.app;
  const height = app.screen.height;
  const width = app.screen.width;
  const symbol = props.symbol;
  const dragEvent = drag(app);

  
  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;
  app.stage.on('pointerup', dragEvent.onDragEnd);
  app.stage.on('pointerupoutside', dragEvent.onDragEnd);

  // @ts-ignore
  const element : ElementType = (await elements.where({symbol}))[0];

  const atomGraphics = atom(element, {height, width});
  app.stage.addChild(atomGraphics.root);
  

  // console.log("center : ", height, width, center, app.screen.height, app.screen.width, window.devicePixelRatio);
  
  atomGraphics.tickers.forEach(_=>app.ticker.add(_));  
}

