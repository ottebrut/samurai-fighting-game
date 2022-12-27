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
    player0NameContainer: HTMLDivElement,
    player1HealthBar: HTMLDivElement,
    player1NameContainer: HTMLDivElement,
    timerContainer: HTMLDivElement,
    resultContainer: HTMLDivElement,
    mainContainer: HTMLDivElement
  ): void {
    const canvasContainer = new CanvasContainer(
      canvas,
      player0HealthBar,
      player0NameContainer,
      player1HealthBar,
      player1NameContainer,
      timerContainer,
      resultContainer,
      mainContainer
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
    player0NameContainer: HTMLDivElement,
    player1HealthBar: HTMLDivElement,
    player1NameContainer: HTMLDivElement,
    private readonly timerContainer: HTMLDivElement,
    private readonly resultContainer: HTMLDivElement,
    private readonly mainContainer: HTMLDivElement
  ) {
    this.canvas.width = this.size.width;
    this.canvas.height = this.size.height;
    this.context = canvas.getContext("2d")!;

    const gameParams = {
      isGameFinished: () => this.isGameFinished,
      finishGame: () => this.finishGame(),
    };
    this.player0 = new Player({
      ...this.spriteParams,
      ...gameParams,
      ...mackParameters,
      type: "left",
      healthBar: player0HealthBar,
      position: new Position({ x: 200, y: 400 }),
    });
    this.player1 = new Player({
      ...this.spriteParams,
      ...gameParams,
      ...kenjiParameters,
      type: "right",
      healthBar: player1HealthBar,
      position: new Position({ x: 750, y: 400 }),
    });

    // eslint-disable-next-line no-param-reassign
    player0NameContainer.innerHTML = this.player0.name;
    // eslint-disable-next-line no-param-reassign
    player1NameContainer.innerHTML = this.player1.name;
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

      this.context.fillStyle = "rgba(255, 255, 255, 0.1)";
      this.context.fillRect(0, 0, this.size.width, this.size.height);

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
      setResult(`${this.player0.name} wins`);
      this.mainContainer.className += " player-0";
    } else {
      setResult(`${this.player1.name} wins`);
      this.mainContainer.className += " player-1";
    }
  }
}
