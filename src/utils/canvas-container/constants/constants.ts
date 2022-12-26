import { KeyType } from "../classes/models";

export const gravity = 0.2;

export const keyTypeByPlayerType: Record<"left" | "right", KeyType> = {
  left: {
    left: "a",
    right: "d",
    jump: "w",
    attack: "s",
  },
  right: {
    left: "ArrowLeft",
    right: "ArrowRight",
    jump: "ArrowUp",
    attack: "ArrowDown",
  },
};

export const groundOffset = 95;
