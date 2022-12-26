import { SpriteParameters } from "./models";
import { Position } from "./position";
import { Size } from "../models";

export class Sprite {
  protected readonly canvasSize: Size;

  protected readonly canvasContext: CanvasRenderingContext2D;

  protected readonly _position: Position;

  protected readonly image: HTMLImageElement;

  protected readonly scale: number;

  protected readonly imageMaxFrames: number;

  protected imageCurrentFrame = 0;

  protected framesElapsed = 0;

  protected readonly framesHold: number;

  public get position(): Position {
    return new Position(this._position);
  }

  constructor({
    canvasSize,
    canvasContext,
    position,
    imageSrc,
    scale = 1,
    imageMaxFrames = 1,
    framesHold = 1,
  }: SpriteParameters) {
    this.canvasSize = canvasSize;
    this.canvasContext = canvasContext;

    this._position = position;

    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.imageMaxFrames = imageMaxFrames;
    this.framesHold = framesHold;
  }

  public draw(): void {
    const frameWidth = this.image.width / this.imageMaxFrames;
    const imageOffset = frameWidth * this.imageCurrentFrame;

    this.canvasContext.drawImage(
      this.image,
      imageOffset,
      0,
      frameWidth,
      this.image.height,
      this._position.x,
      this._position.y,
      frameWidth * this.scale,
      this.image.height * this.scale
    );
  }

  public update(): void {
    this.draw();

    this.framesElapsed += 1;
    if (this.framesElapsed === this.framesHold) {
      this.framesElapsed = 0;

      this.imageCurrentFrame += 1;
      if (this.imageCurrentFrame === this.imageMaxFrames) {
        this.imageCurrentFrame = 0;
      }
    }
  }
}
