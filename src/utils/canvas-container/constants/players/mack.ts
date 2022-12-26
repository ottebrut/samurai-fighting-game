import { PartialPlayerParameters } from "./models";
import { Position } from "../../classes/position";
import { PlayerState } from "../../classes/models";

export const mackParameters: PartialPlayerParameters = {
  healthBoxSize: { width: 55, height: 110 },
  imageSrc: "./assets/samuraiMack/Idle.png",
  imageMaxFrames: 8,
  framesHold: 25,
  scale: 2.5,
  offset: new Position({ x: 220, y: 195 }),
  stateSprite: {
    [PlayerState.idle]: {
      imageSrc: "./assets/samuraiMack/Idle.png",
      imageMaxFrames: 8,
    },
    [PlayerState.run]: {
      imageSrc: "./assets/samuraiMack/Run.png",
      imageMaxFrames: 8,
    },
  },
};
