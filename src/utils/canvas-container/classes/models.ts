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
  attackingBoxOffset?: Position;

  stateSprite: PlayerStateSpriteArgument;
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
}

export type PlayerStateSprite = Record<
  PlayerState,
  {
    image: HTMLImageElement;
    imageMaxFrames: number;
  }
>;

export type PlayerStateSpriteArgument = Record<
  PlayerState,
  {
    imageSrc: string;
    imageMaxFrames: number;
  }
>;
