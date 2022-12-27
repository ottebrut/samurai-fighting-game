import { PartialPlayerParameters } from "./models";
import { Position } from "../../classes/position";
import { PlayerState } from "../../classes/models";

export const kenjiParameters: PartialPlayerParameters = {
  name: "Kenji",
  healthBoxSize: { width: 42, height: 110 },
  healthDamage: 20,
  attackingBox: {
    size: { width: 100, height: 60 },
    offset: new Position({ x: 150, y: -10 }),
  },
  imageSrc: "./assets/kenji/Idle.png",
  imageMaxFrames: 4,
  framesHold: 25,
  scale: 2.24,
  offset: new Position({ x: 195, y: 176 }),
  attackFrame: 2,
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
    [PlayerState.take_hit]: {
      imageSrc: "./assets/kenji/Take hit.png",
      imageMaxFrames: 3,
      framesHold: 8,
    },
    [PlayerState.death]: {
      imageSrc: "./assets/kenji/Death.png",
      imageMaxFrames: 7,
      framesHold: 8,
    },
  },
};
