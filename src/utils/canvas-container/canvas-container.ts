import { Size } from "./models";
import { Position } from "./classes/position";
import { Player } from "./classes/player";
import { Sprite } from "./classes/sprite";
import { Direction, SpriteParameters } from "./classes/models";
import { mackParameters } from "./constants/players/mack";
import { kenjiParameters } from "./constants/players/kenji";

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
    canvasContainer.setupAnimation();
  }

  private readonly context: CanvasRenderingContext2D;

  public readonly size: Size = {
    width: 1024,
    height: 576,
  };

  private readonly player0: Player;

  private readonly player1: Player;

  private isGameFinished = false;

  private get spriteParams(): Pick<
    SpriteParameters,
    "canvasSize" | "canvasContext"
  > {
    return {
      canvasSize: { ...this.size },
      canvasContext: this.context,
    };
  }

  constructor(
    private readonly canvas: HTMLCanvasElement,
    player0HealthBar: HTMLDivElement,
    player1HealthBar: HTMLDivElement,
    private readonly timerContainer: HTMLDivElement,
    private readonly resultContainer: HTMLDivElement
  ) {
    this.canvas.width = this.size.width;
    this.canvas.height = this.size.height;
    this.context = canvas.getContext("2d")!;

    this.player0 = new Player({
      ...this.spriteParams,
      ...mackParameters,
      type: "left",
      healthBar: player0HealthBar,
      position: new Position({ x: 200, y: 400 }),
    });
    this.player1 = new Player({
      ...this.spriteParams,
      ...kenjiParameters,
      type: "right",
      healthBar: player1HealthBar,
      position: new Position({ x: 700, y: 400 }),
      attackingBoxOffset: new Position({ x: 50, y: 0 }),
    });
  }

  private setupAnimation(): void {
    const background = new Sprite({
      ...this.spriteParams,
      position: new Position({ x: 0, y: 0 }),
      imageSrc: "./assets/background.png",
    });
    const shop = new Sprite({
      ...this.spriteParams,
      position: new Position({ x: 620, y: 127 }),
      imageSrc: "./assets/shop.png",
      scale: 2.75,
      imageMaxFrames: 6,
      framesHold: 22,
    });

    const animate = () => {
      window.requestAnimationFrame(animate);

      this.context.fillStyle = "black";
      this.context.fillRect(0, 0, this.size.width, this.size.height);

      background.update();
      shop.update();

      this.player0.update();
      this.player1.update();
    };
    animate();

    this.setupKeyListeners();
    this.setupTimer();
  }

  private setupKeyListeners(): void {
    this.setupKeyListenerForPlayer(this.player0, this.player1);

    this.setupKeyListenerForPlayer(this.player1, this.player0);
  }

  private setupKeyListenerForPlayer(player0: Player, player1: Player) {
    window.addEventListener("keydown", (event) => {
      switch (event.key) {
        case player0.keyType.left:
          player0.addDirection(Direction.left);
          break;
        case player0.keyType.right:
          player0.addDirection(Direction.right);
          break;
        case player0.keyType.jump:
          player0.starJumpPhase();
          break;
        case player0.keyType.attack:
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
        case player0.keyType.left:
          player0.removeDirection(Direction.left);
          break;
        case player0.keyType.right:
          player0.removeDirection(Direction.right);
          break;
        case player0.keyType.jump:
          player0.stopJumpPhase();
          break;
        case player0.keyType.attack:
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
      setResult("Mack wins");
    } else {
      setResult("Kenji wins");
    }
  }
}
