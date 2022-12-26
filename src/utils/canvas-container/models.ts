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
