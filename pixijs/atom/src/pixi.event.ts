import { FederatedPointerEvent } from 'pixi.js';
import { Dictionary, PixiDragEventType } from './types';


let dragTarget : any;

let dragEvents : Dictionary = {}; 

export const drag  = (app : any) : PixiDragEventType => {
  
  if(app.id in dragEvents) return dragEvents[app.id];

  dragEvents[app.id] = {
    id  : app.id,

    onDragMove(event : FederatedPointerEvent) {
      if (dragTarget) {
        dragTarget.parent.toLocal(event.global, null, dragTarget.position);
      }
      return dragEvents[app.id];
    },

    onDragStart(event : FederatedPointerEvent) {
      // Store a reference to the data
      // * The reason for this is because of multitouch *
      // * We want to track the movement of this particular touch *
      const onDragMove = dragEvents[app.id].onDragMove;
      dragTarget = event.target;
      dragTarget.alpha = 0.5;
      dragTarget.parent.pivot.set(dragTarget.parent.position.x, dragTarget.parent.position.y);
      app.stage.on('pointermove', onDragMove);
      return dragEvents[app.id];
    },

    onDragEnd() {
      const onDragMove = dragEvents[app.id].onDragMove;
      if (dragTarget) {      
        app.stage.off('pointermove', onDragMove);
        dragTarget.alpha = 1;
        dragTarget = null;
      }
      return dragEvents[app.id];
    }
  }
  
  return dragEvents[app.id];
}


