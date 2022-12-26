import { Position } from "./position";
import { Size } from "../models";

export interface SpriteParameters {
  canvasSize: Size;
  canvasContext: CanvasRenderingContext2D;

  position: Position;
  offset?: Position;

  imageSrc: string;
  scale?: number;
  imageMaxFrames?: number;
  framesHold?: number;
}

export interface PlayerParameters extends SpriteParameters {
  type: "left" | "right";
  healthBar: HTMLDivElement;
  healthBoxSize: Size;
  attackingBox: {
    size: Size;
    offset: Position;
  };
  attackFrame: number;

  stateSprite: PlayerStateSprite;
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

export enum PlayerState {
  idle,
  run,
  jump,
  fall,
  attack,
}

export type PlayerStateSprite = Record<
  PlayerState,
  {
    imageSrc: string;
    imageMaxFrames: number;
    framesHold: number;
  }
>;
