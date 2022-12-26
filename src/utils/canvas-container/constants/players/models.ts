import { PlayerParameters } from "../../classes/models";

export type PartialPlayerParameters = Omit<
  PlayerParameters,
  "canvasSize" | "canvasContext" | "healthBar" | "position" | "type"
>;
