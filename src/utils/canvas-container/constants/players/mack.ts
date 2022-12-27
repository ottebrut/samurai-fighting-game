import { PartialPlayerParameters } from "./models";
import { Position } from "../../classes/position";
import { PlayerState } from "../../classes/models";

export const mackParameters: PartialPlayerParameters = {
  name: "Mack",
  healthBoxSize: { width: 55, height: 110 },
  attackingBox: {
    size: { width: 145, height: 60 },
    offset: new Position({ x: -100, y: 10 }),
  },
  imageSrc: "./assets/samuraiMack/Idle.png",
  imageMaxFrames: 8,
  framesHold: 25,
  scale: 2.5,
  offset: new Position({ x: 220, y: 195 }),
  attackFrame: 5,
  stateSprite: {
    [PlayerState.idle]: {
      imageSrc: "./assets/samuraiMack/Idle.png",
      imageMaxFrames: 8,
      framesHold: 25,
    },
    [PlayerState.run]: {
      imageSrc: "./assets/samuraiMack/Run.png",
      imageMaxFrames: 8,
      framesHold: 10,
    },
    [PlayerState.jump]: {
      imageSrc: "./assets/samuraiMack/Jump.png",
      imageMaxFrames: 2,
      framesHold: 25,
    },
    [PlayerState.fall]: {
      imageSrc: "./assets/samuraiMack/Fall.png",
      imageMaxFrames: 2,
      framesHold: 25,
    },
    [PlayerState.attack]: {
      imageSrc: "./assets/samuraiMack/Attack1.png",
      imageMaxFrames: 6,
      framesHold: 10,
    },
    [PlayerState.take_hit]: {
      imageSrc: "./assets/samuraiMack/Take Hit - white silhouette.png",
      imageMaxFrames: 4,
      framesHold: 8,
    },
    [PlayerState.death]: {
      imageSrc: "./assets/samuraiMack/Death.png",
      imageMaxFrames: 6,
      framesHold: 8,
    },
  },
};
