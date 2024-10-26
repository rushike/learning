import { Application, Sprite, Assets, GraphicsContext, Text, TextStyle, Graphics, FillGradient, Point } from 'pixi.js';

import { getLinearScaleTick } from './scale.utils';
import * as pxutils from './pixi.utils';
import * as WV2RGB from './wv2rgb';
import defaultState, { State } from './state';

type SpectralLinesProps = {
  app   ?: Application,
  state ?: State

  /** spectral lines*/
  lines  : number[],
  
}

export async function SpectralLines(props : SpectralLinesProps) {
  // const {app, lines, state} = props;

  const app = props.app || await pxutils.createApp(".canvas");

  const state = props.state || defaultState;

  const lines = props.lines//.filter(_=> _>= WV2RGB.VISIBLE_WV_MIN && _<= WV2RGB.VISIBLE_WV_MAX)

  const [MIN, MAX] = [Math.min(...lines), Math.max(...lines)]
  
  const graphics = new Graphics();

  app.stage.addChild(graphics);
  
  function drawSpectralLine(wv : number) {
    let x = (wv - MIN) / (MAX - MIN) * 1000
    
    pxutils.line([x, 0], [x, 100], {
      graphics,
      color : WV2RGB.wv2rgb(x)
    })
  }

  const linearScaleTick = getLinearScaleTick([0, 100], [MIN, MAX])

  console.log("MIN < MMAX : ", MIN, MAX, lines);
  // encosing black bg
  graphics.rect(0, 0, 1000, 100).fill({color : state.theme.primaryBg})
  
  app.stage.addChild(...pxutils.xAxis([0, 100], 1000, {graphics, state, linearScaleTick}));
  
  lines.forEach(drawSpectralLine);

  return app;
}

