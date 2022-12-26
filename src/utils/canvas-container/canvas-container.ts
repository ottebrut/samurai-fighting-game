import { Sprite } from "./classes/sprite";
import { Direction, Size } from "./models";
import { Position } from "./classes/position";

export class CanvasContainer {
  public static setupCanvas(canvas: HTMLCanvasElement): void {
    new CanvasContainer(canvas).setupCanvas();
  }

  private readonly context: CanvasRenderingContext2D;

  public readonly size: Size = {
    width: 1024,
    height: 576,
  };

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.context = canvas.getContext("2d")!;
  }

  private setupCanvas(): void {
    this.canvas.width = 1024;
    this.canvas.height = 576;

    const playerArguments = {
      canvasSize: this.size,
      canvasContext: this.context,
    };
    const player0 = new Sprite({
      ...playerArguments,
      position: new Position({ x: 0, y: 0 }),
    });
    const player1 = new Sprite({
      ...playerArguments,
      position: new Position({ x: 400, y: 100 }),
      color: "blue",
      attackingBoxOffset: new Position({ x: 50, y: 0 }),
    });

    const animate = () => {
      window.requestAnimationFrame(animate);

      this.context.fillStyle = "black";
      this.context.fillRect(0, 0, this.size.width, this.size.height);
      player0.update();
      player1.update();
    };
    animate();

    this.setupMovement(player0, player1);
  }

  private setupMovement(player0: Sprite, player1: Sprite): void {
    window.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "a":
          player0.moveInDirection(Direction.left);
          break;
        case "d":
          player0.moveInDirection(Direction.right);
          break;
        case "w":
          player0.starJumpPhase();
          break;
        case "s":
          player0.startAttackPhase(player1);
          break;

        case "ArrowLeft":
          player1.moveInDirection(Direction.left);
          break;
        case "ArrowRight":
          player1.moveInDirection(Direction.right);
          break;
        case "ArrowUp":
          player1.starJumpPhase();
          break;
        case "ArrowDown":
          player1.startAttackPhase(player0);
          break;
        // no default
      }
    });

    window.addEventListener("keyup", (event) => {
      switch (event.key) {
        case "a":
          player0.stopInDirection(Direction.left);
          break;
        case "d":
          player0.stopInDirection(Direction.right);
          break;
        case "w":
          player0.stopJumpPhase();
          break;
        case "s":
          player0.stopAttackPhase();
          break;

        case "ArrowLeft":
          player1.stopInDirection(Direction.left);
          break;
        case "ArrowRight":
          player1.stopInDirection(Direction.right);
          break;
        case "ArrowUp":
          player1.stopJumpPhase();
          break;
        case "ArrowDown":
          player1.stopAttackPhase();
          break;
        // no default
      }
    });
  }
}
