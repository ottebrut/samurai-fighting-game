import { Size } from "../models";
import {
  gravity,
  groundOffset,
  keyTypeByPlayerType,
} from "../constants/constants";
import { getBorderCoordinates } from "../functions/get-border-coordinates";
import { Position } from "./position";
import { Sprite } from "./sprite";
import {
  Direction,
  JumpState,
  KeyType,
  Phase,
  PlayerParameters,
  PlayerState,
  PlayerStateSprite,
} from "./models";

const defaultJumpState: JumpState = { counter: 0, phase: Phase.ended };

export class Player extends Sprite {
  protected readonly healthBoxSize: Size;

  private velocityY = 0;

  /**
   * Contains directions, in which player must go. Last element is the main direction.
   * As soon as movement button is pressed/released new direction is added/removed;
   */
  private currentDirections: Direction[] = [];

  private readonly maxJumps = 2;

  /**
   * In `started` phase, when user pressed jump button and didn't release it yet.
   */
  private jumpState = defaultJumpState;

  private readonly attackingBox: {
    position: Position;
    offset: Position;
    size: Size;
  };

  /**
   * True, if player is in attack mode.
   */
  private isAttacking = false;

  /**
   * In `started` phase, when user pressed attack button and didn't release it yet.
   */
  private attackPhase = Phase.started;

  private _health = 100;

  private readonly healthBar: HTMLDivElement;

  public readonly keyType: KeyType;

  private readonly stateSprite: PlayerStateSprite;

  private currentState: PlayerState = PlayerState.idle;

  public get health(): number {
    return this._health;
  }

  constructor(data: PlayerParameters) {
    super(data);

    const {
      attackingBoxOffset = new Position({ x: 0, y: 0 }),
      healthBar,
      healthBoxSize,
    } = data;

    this.attackingBox = {
      position: new Position(this._position),
      size: { width: 100, height: 50 },
      offset: attackingBoxOffset,
    };
    this.keyType = keyTypeByPlayerType[data.type];

    this.healthBar = healthBar;
    this.healthBoxSize = healthBoxSize;

    this.stateSprite = data.stateSprite;
  }

  public update(): void {
    super.update();

    this.moveY();
    this.moveX();

    if (this.velocityY < 0) {
      this.switchState(PlayerState.jump);
    } else if (this.velocityY > 0) {
      this.switchState(PlayerState.fall);
    } else if (this.currentDirections.length) {
      this.switchState(PlayerState.run);
    } else {
      this.switchState(PlayerState.idle);
    }
  }

  private moveY(): void {
    this._position.y += this.velocityY;
    if (
      this._position.y + this.healthBoxSize.height >=
      this.canvasSize.height - groundOffset
    ) {
      this._position.y =
        this.canvasSize.height - this.healthBoxSize.height - groundOffset;
      this.velocityY = 0;

      if (this.jumpState.phase === Phase.ended) {
        this.jumpState = defaultJumpState;
      }
    } else {
      this.velocityY += gravity;
    }
  }

  private moveX(): void {
    if (this.currentDirections.length) {
      const direction =
        this.currentDirections[this.currentDirections.length - 1];
      this._position.x += direction === Direction.left ? -6 : 6;
    }

    this.attackingBox.position = this._position.minus(this.attackingBox.offset);
  }

  /**
   * Must be called, when user pressed direction 'left' or 'right' button.
   */
  public addDirection(direction: Direction): void {
    this.currentDirections.push(direction);
  }

  /**
   * Must be called, when user released direction 'left' or 'right' button.
   */
  public removeDirection(direction: Direction): void {
    this.currentDirections = this.currentDirections.filter(
      (currentDirection) => currentDirection !== direction
    );
  }

  /**
   * Must be called, when user pressed jump button.
   */
  public starJumpPhase(): void {
    if (
      this.jumpState.phase === Phase.started ||
      this.jumpState.counter === this.maxJumps
    ) {
      return;
    }

    this.velocityY = -8;
    this.jumpState = {
      counter: this.jumpState.counter + 1,
      phase: Phase.started,
    };
  }

  /**
   * Must be called, when user released jump button.
   */
  public stopJumpPhase(): void {
    if (this.velocityY === 0) {
      this.jumpState = defaultJumpState;
    } else if (this.jumpState.phase === Phase.started) {
      this.jumpState = { ...this.jumpState, phase: Phase.ended };
    }
  }

  /**
   * Must be called, when user pressed attack button.
   */
  public startAttackPhase(playerToAttack: Player): void {
    if (this.isAttacking || this.attackPhase === Phase.started) {
      return;
    }

    this.attackPhase = Phase.started;
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);

    const attackingPosition = getBorderCoordinates(this.attackingBox);
    const playerToAttackPosition = getBorderCoordinates({
      position: playerToAttack.position,
      size: playerToAttack.healthBoxSize,
    });
    if (
      attackingPosition.leftTop.lte(playerToAttackPosition.rightBottom) &&
      playerToAttackPosition.leftTop.lte(attackingPosition.rightBottom)
    ) {
      playerToAttack.getHit();
    }
  }

  /**
   * Must be called, when user released attack button.
   */
  public stopAttackPhase(): void {
    this.attackPhase = Phase.ended;
  }

  private switchState(state: PlayerState) {
    if (this.currentState !== state) {
      this.currentState = state;

      const stateSprite = this.stateSprite[state];
      this.image.src = stateSprite.imageSrc;
      this.imageMaxFrames = stateSprite.imageMaxFrames;

      this.imageCurrentFrame = 0;
      this.framesElapsed = 0;
    }
  }

  public getHit(): void {
    this._health -= 20;
    this.healthBar.style.width = `${this._health}%`;
  }
}
