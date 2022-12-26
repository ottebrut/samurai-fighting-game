import { SpriteParameters } from "./models";
import { Position } from "./position";
import { Size } from "../models";

export class Sprite {
  protected readonly canvasSize: Size;

  protected readonly canvasContext: CanvasRenderingContext2D;

  protected readonly _position: Position;

  protected readonly image: HTMLImageElement;

  protected readonly scale: number;

  protected imageMaxFrames: number;

  protected imageCurrentFrame = 0;

  protected framesElapsed = 0;

  protected framesHold: number;

  protected readonly offset: Position;

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
    offset = new Position({ x: 0, y: 0 }),
  }: SpriteParameters) {
    this.canvasSize = canvasSize;
    this.canvasContext = canvasContext;

    this._position = position;

    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.imageMaxFrames = imageMaxFrames;
    this.framesHold = framesHold;
    this.offset = offset;
  }

  protected draw(): void {
    const frameWidth = this.image.width / this.imageMaxFrames;
    const imageOffset = frameWidth * this.imageCurrentFrame;

    this.canvasContext.drawImage(
      this.image,
      imageOffset,
      0,
      frameWidth,
      this.image.height,
      this._position.x - this.offset.x,
      this._position.y - this.offset.y,
      frameWidth * this.scale,
      this.image.height * this.scale
    );
  }

  protected animateFrames(): void {
    this.framesElapsed += 1;
    if (this.framesElapsed === this.framesHold) {
      this.framesElapsed = 0;

      this.imageCurrentFrame += 1;
      if (this.imageCurrentFrame === this.imageMaxFrames) {
        this.imageCurrentFrame = 0;
      }
    }
  }

  public update(): void {
    this.draw();
    this.animateFrames();
  }
}
