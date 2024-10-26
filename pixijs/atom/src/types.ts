import { FederatedPointerEvent } from "pixi.js";

// general types
export type Vector2 = [number, number];
export type Vector3 = [number, number, number];
export type Dictionary = { [key: string]: any};

export type BooleanFunction1 = (n1 : number) => boolean

export interface Closable {
  close() : Promise<void>;
}

// pixi types
export type PixiDragEventType = {
  onDragMove  : (event : FederatedPointerEvent) => void
  onDragStart : (event : FederatedPointerEvent) => void 
  onDragEnd   : () => void
}