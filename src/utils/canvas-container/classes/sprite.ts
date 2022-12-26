import { Size } from "../models";
import { Position } from "./position";

export class Sprite {
  protected readonly canvasSize: Size;

  protected readonly canvasContext: CanvasRenderingContext2D;

  protected readonly _size: Size = { width: 50, height: 150 };

  protected readonly _position: Position;

  protected readonly image: HTMLImageElement;

  public get size(): Size {
    return { ...this._size };
  }

  public get position(): Position {
    return new Position(this._position);
  }

  constructor({
    canvasSize,
    canvasContext,
    position,
    imageSrc,
  }: {
    canvasSize: Size;
    canvasContext: CanvasRenderingContext2D;
    position: Position;
    imageSrc: string;
  }) {
    this.canvasSize = canvasSize;
    this.canvasContext = canvasContext;

    this._position = position;

    this.image = new Image();
    this.image.src = imageSrc;
  }

  public draw(): void {
    this.canvasContext.drawImage(
      this.image,
      this._position.x,
      this._position.y
    );
  }

  public update(): void {
    this.draw();
  }
}
