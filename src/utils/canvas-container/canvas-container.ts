import { Direction, KeyType, Size } from "./models";
import { Position } from "./classes/position";
import { Fighter } from "./classes/fighter";
import { Sprite } from "./classes/sprite";

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

  private readonly player0: Fighter;

  private readonly player1: Fighter;

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
    this.player0 = new Fighter({
      ...playerArguments,
      position: new Position({ x: 0, y: 0 }),
      healthBar: player0HealthBar,
      imageSrc: "",
    });
    this.player1 = new Fighter({
      ...playerArguments,
      position: new Position({ x: 400, y: 100 }),
      color: "blue",
      attackingBoxOffset: new Position({ x: 50, y: 0 }),
      healthBar: player1HealthBar,
      imageSrc: "",
    });
  }

  private setupCanvas(): void {
    const background = new Sprite({
      canvasSize: this.size,
      canvasContext: this.context,
      position: new Position({ x: 0, y: 0 }),
      imageSrc: "./assets/background.png",
    });

    const animate = () => {
      window.requestAnimationFrame(animate);

      this.context.fillStyle = "black";
      this.context.fillRect(0, 0, this.size.width, this.size.height);

      background.update();

      this.player0.update();
      this.player1.update();
    };
    animate();

    this.setupKeyListeners();
    this.setupTimer();
  }

  private setupKeyListeners(): void {
    this.setupKeyListenerForPlayer(this.player0, this.player1, {
      left: "a",
      right: "d",
      jump: "w",
      attack: "s",
    });

    this.setupKeyListenerForPlayer(this.player1, this.player0, {
      left: "ArrowLeft",
      right: "ArrowRight",
      jump: "ArrowUp",
      attack: "ArrowDown",
    });
  }

  private setupKeyListenerForPlayer(
    player0: Fighter,
    player1: Fighter,
    keyType: KeyType
  ) {
    window.addEventListener("keydown", (event) => {
      switch (event.key) {
        case keyType.left:
          player0.moveInDirection(Direction.left);
          break;
        case keyType.right:
          player0.moveInDirection(Direction.right);
          break;
        case keyType.jump:
          player0.starJumpPhase();
          break;
        case keyType.attack:
          player0.startAttackPhase(player1);
          if (this.player1.health <= 0) {
            this.finishGame();
          }
          break;
        // no default
      }
    });

    window.addEventListener("keyup", (event) => {
      switch (event.key) {
        case keyType.left:
          player0.stopInDirection(Direction.left);
          break;
        case keyType.right:
          player0.stopInDirection(Direction.right);
          break;
        case keyType.jump:
          player0.stopJumpPhase();
          break;
        case keyType.attack:
          player0.stopAttackPhase();
          break;
        // no default
      }
    });
  }

  private setupTimer() {
    const setSecondsToHtml = (seconds: number) => {
      this.timerContainer.innerHTML = seconds.toString();
    };

    let seconds = 60;
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
