import { Direction, JumpState, Phase, Position, Size } from "./models";
import { gravity } from "./constants";

const defaultJumpState = { counter: 0, phase: Phase.ended };

export class Sprite {
  private readonly canvasSize: Size;

  private readonly canvasContext: CanvasRenderingContext2D;

  private readonly size: Size = { width: 50, height: 150 };

  private readonly color: string;

  private position: Position;

  private velocityY = 0;

  private currentDirections: Direction[] = [];

  private jumpState: JumpState = defaultJumpState;

  constructor({
    canvasSize,
    canvasContext,
    position,
    color = "red",
  }: {
    canvasSize: Size;
    canvasContext: CanvasRenderingContext2D;
    position: Position;
    color?: string;
  }) {
    this.canvasSize = canvasSize;
    this.canvasContext = canvasContext;
    this.position = position;
    this.color = color;
  }

  public draw(): void {
    this.canvasContext.fillStyle = this.color;
    this.canvasContext.fillRect(
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.height
    );
  }

  public update(): void {
    this.draw();

    this.position.y += this.velocityY;

    if (this.position.y + this.size.height >= this.canvasSize.height) {
      this.position.y = this.canvasSize.height - this.size.height;
      this.velocityY = 0;

      if (this.jumpState.phase === Phase.ended) {
        this.jumpState = defaultJumpState;
      }
    } else {
      this.velocityY += gravity;
    }

    if (this.currentDirections.length) {
      const direction =
        this.currentDirections[this.currentDirections.length - 1];
      this.position.x += direction === Direction.left ? -6 : 6;
    }
  }

  public moveInDirection(direction: Direction): void {
    this.currentDirections.push(direction);
  }

  public stopInDirection(direction: Direction): void {
    this.currentDirections = this.currentDirections.filter(
      (currentDirection) => currentDirection !== direction
    );
  }

  public starJumpPhase(): void {
    if (
      this.jumpState.phase === Phase.started ||
      this.jumpState.counter === 2
    ) {
      return;
    }

    this.velocityY = -8;
    this.jumpState = {
      counter: this.jumpState.counter + 1,
      phase: Phase.started,
    };
  }

  public stopJumpPhase(): void {
    if (this.velocityY === 0) {
      this.jumpState = defaultJumpState;
    } else if (this.jumpState.phase === Phase.started) {
      this.jumpState = { ...this.jumpState, phase: Phase.ended };
    }
  }
}
