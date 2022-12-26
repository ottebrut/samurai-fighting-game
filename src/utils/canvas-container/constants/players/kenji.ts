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
      imageMaxFrames: 8,
    },
    [PlayerState.run]: {
      imageSrc: "./assets/Kenji/Run.png",
      imageMaxFrames: 8,
    },
  },
};
