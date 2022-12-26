import { Position } from "./classes/position";

export interface Size {
  width: number;
  height: number;
}

export enum Direction {
  left,
  right,
}

export enum Phase {
  started,
  ended,
}

export interface JumpState {
  counter: number;
  phase: Phase;
}

export interface KeyType {
  left: string;
  right: string;
  jump: string;
  attack: string;
}

export interface SpriteParameters {
  canvasSize: Size;
  canvasContext: CanvasRenderingContext2D;
  position: Position;
  imageSrc: string;
  scale?: number;
  imageMaxFrames?: number;
  framesHold?: number;
}

export interface FighterParameters extends SpriteParameters {
  color?: string;
  attackingBoxOffset?: Position;
  healthBar: HTMLDivElement;
}
