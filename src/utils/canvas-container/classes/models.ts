import { Position } from "./position";
import { Size } from "../models";

export interface SpriteParameters {
  canvasSize: Size;
  canvasContext: CanvasRenderingContext2D;
  position: Position;
  imageSrc: string;
  scale?: number;
  imageMaxFrames?: number;
  framesHold?: number;
}

export interface PlayerParameters extends SpriteParameters {
  color?: string;
  attackingBoxOffset?: Position;
  healthBar: HTMLDivElement;
  type: "left" | "right";
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
