import { PartialPlayerParameters } from "./models";
import { Position } from "../../classes/position";
import { PlayerState } from "../../classes/models";

export const kenjiParameters: PartialPlayerParameters = {
  healthBoxSize: { width: 42, height: 110 },
  imageSrc: "./assets/kenji/Idle.png",
  imageMaxFrames: 4,
  framesHold: 25,
  scale: 2.24,
  offset: new Position({ x: 195, y: 176 }),
  stateSprite: {
    [PlayerState.idle]: {
      imageSrc: "./assets/kenji/Idle.png",
      imageMaxFrames: 4,
      framesHold: 25,
    },
    [PlayerState.run]: {
      imageSrc: "./assets/kenji/Run.png",
      imageMaxFrames: 8,
      framesHold: 9,
    },
    [PlayerState.jump]: {
      imageSrc: "./assets/kenji/Jump.png",
      imageMaxFrames: 2,
      framesHold: 25,
    },
    [PlayerState.fall]: {
      imageSrc: "./assets/kenji/Fall.png",
      imageMaxFrames: 2,
      framesHold: 25,
    },
    [PlayerState.attack]: {
      imageSrc: "./assets/kenji/Attack1.png",
      imageMaxFrames: 4,
      framesHold: 10,
    },
  },
};
