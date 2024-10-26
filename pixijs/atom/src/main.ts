import { Application, Sprite, Assets, GraphicsContext, Text, TextStyle, Graphics, FillGradient, Point } from 'pixi.js';

import duckdb, {ResultTable} from './duck-db'
import state from './state';
import * as pxutils from "./pixi.utils"
import { AtomElement} from "./atom"

const app = await pxutils.createApp({selector : "app", height : 1000, width : 1000})

document.body.appendChild(app.canvas);


AtomElement({app, state, symbol : "Fe"})
// const all = await duckdb.fetch("elements")

// console.log("All elements : ", all);

// function test2(...params: any[]): void {
//   console.log("test pring aray 222: ", params);
// }

// function test(...params : any[]) {
//   test2(...params);
//   console.log("test pring aray : ", params);
// }

// test(1, 2, 4, 5)
// let hydrogen = await all.where({symbol: "H"});
// console.log("Hey Hydrogen : ", hydrogen);


