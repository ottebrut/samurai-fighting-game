import { Sprite } from "./classes/sprite";
import { Direction, Size } from "./models";
import { Position } from "./classes/position";

export class CanvasContainer {
  public static setupCanvas(
    canvas: HTMLCanvasElement,
    player0HealthBar: HTMLDivElement,
    player1HealthBar: HTMLDivElement,
    timerContainer: HTMLDivElement,
    resultContainer: HTMLDivElement
  ): void {
    const canvasContainer = new CanvasContainer(
      canvas,
      player0HealthBar,
      player1HealthBar,
      timerContainer,
      resultContainer
    );
    canvasContainer.setupCanvas();
  }

  private readonly context: CanvasRenderingContext2D;

  public readonly size: Size = {
    width: 1024,
    height: 576,
  };

  private readonly player0: Sprite;

  private readonly player1: Sprite;

  private isGameFinished = false;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    player0HealthBar: HTMLDivElement,
    player1HealthBar: HTMLDivElement,
    private readonly timerContainer: HTMLDivElement,
    private readonly resultContainer: HTMLDivElement
  ) {
    this.context = canvas.getContext("2d")!;

    this.canvas.width = this.size.width;
    this.canvas.height = this.size.height;

    const playerArguments = {
      canvasSize: this.size,
      canvasContext: this.context,
    };
    this.player0 = new Sprite({
      ...playerArguments,
      position: new Position({ x: 0, y: 0 }),
      healthBar: player0HealthBar,
    });
    this.player1 = new Sprite({
      ...playerArguments,
      position: new Position({ x: 400, y: 100 }),
      color: "blue",
      attackingBoxOffset: new Position({ x: 50, y: 0 }),
      healthBar: player1HealthBar,
    });
  }

  private setupCanvas(): void {
    const animate = () => {
      window.requestAnimationFrame(animate);

      this.context.fillStyle = "black";
      this.context.fillRect(0, 0, this.size.width, this.size.height);

      this.player0.update();
      this.player1.update();
    };
    animate();

    this.setupKeyListeners();
    this.setupTimer();
  }

  private setupKeyListeners(): void {
    window.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "a":
          this.player0.moveInDirection(Direction.left);
          break;
        case "d":
          this.player0.moveInDirection(Direction.right);
          break;
        case "w":
          this.player0.starJumpPhase();
          break;
        case "s":
          this.player0.startAttackPhase(this.player1);
          if (this.player1.health <= 0) {
            this.finishGame();
          }
          break;

        case "ArrowLeft":
          this.player1.moveInDirection(Direction.left);
          break;
        case "ArrowRight":
          this.player1.moveInDirection(Direction.right);
          break;
        case "ArrowUp":
          this.player1.starJumpPhase();
          break;
        case "ArrowDown":
          this.player1.startAttackPhase(this.player0);
          if (this.player0.health <= 0) {
            this.finishGame();
          }
          break;
        // no default
      }
    });

    window.addEventListener("keyup", (event) => {
      switch (event.key) {
        case "a":
          this.player0.stopInDirection(Direction.left);
          break;
        case "d":
          this.player0.stopInDirection(Direction.right);
          break;
        case "w":
          this.player0.stopJumpPhase();
          break;
        case "s":
          this.player0.stopAttackPhase();
          break;

        case "ArrowLeft":
          this.player1.stopInDirection(Direction.left);
          break;
        case "ArrowRight":
          this.player1.stopInDirection(Direction.right);
          break;
        case "ArrowUp":
          this.player1.stopJumpPhase();
          break;
        case "ArrowDown":
          this.player1.stopAttackPhase();
          break;
        // no default
      }
    });
  }

  private setupTimer() {
    const setSecondsToHtml = (seconds: number) => {
      this.timerContainer.innerHTML = seconds.toString();
    };

    let seconds = 10;
    setSecondsToHtml(seconds);

    const decreaseSecond = () => {
      if (this.isGameFinished) {
        return;
      }

      seconds -= 1;
      setSecondsToHtml(seconds);

      if (seconds) {
        setTimeout(decreaseSecond, 1000);
      } else {
        this.finishGame();
      }
    };
    setTimeout(decreaseSecond, 1000);
  }

  private finishGame(): void {
    this.isGameFinished = true;

    const setResult = (result: string) => {
      this.resultContainer.innerHTML = result;
    };
    if (this.player0.health === this.player1.health) {
      setResult("Draw");
    } else if (this.player0.health > this.player1.health) {
      setResult("Maoko wins");
    } else {
      setResult("Kenji wins");
    }
  }
}
