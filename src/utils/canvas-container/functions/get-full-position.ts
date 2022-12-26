import { Position } from "../classes/position";
import { Size } from "../models";

export function getFullPosition(box: { position: Position; size: Size }): {
  leftTop: Position;
  rightBottom: Position;
} {
  return {
    leftTop: box.position,
    rightBottom: new Position({
      x: box.position.x + box.size.width,
      y: box.position.y + box.size.height,
    }),
  };
}
