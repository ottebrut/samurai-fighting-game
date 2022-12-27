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

  private readonly maxJumps = 1;

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
   * In `started` phase, when user pressed attack button and didn't release it yet.
   */
  private attackPhase = Phase.ended;

  private readonly attackFrame: number;

  private playerToAttack: Player | undefined;

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

    const { attackingBox, healthBar, healthBoxSize, attackFrame } = data;

    this.healthBar = healthBar;
    this.healthBoxSize = healthBoxSize;
    this.attackingBox = {
      position: new Position(this._position).minus(attackingBox.offset),
      size: attackingBox.size,
      offset: attackingBox.offset,
    };
    this.attackFrame = attackFrame;

    this.keyType = keyTypeByPlayerType[data.type];
    this.stateSprite = data.stateSprite;
  }

  public update(): void {
    this.draw();

    if (
      this.currentState === PlayerState.take_hit &&
      (this.imageCurrentFrame < this.imageMaxFrames - 1 ||
        this.framesElapsed < this.framesHold - 1)
    ) {
      this.animateFrames();
      return;
    }

    this.checkAttack();

    this.moveY();
    this.moveX();
    this.attackingBox.position = this._position.minus(this.attackingBox.offset);

    if (this.velocityY < 0) {
      this.switchState(PlayerState.jump);
    } else if (this.velocityY > 0) {
      this.switchState(PlayerState.fall);
    } else if (this.currentDirections.length) {
      this.switchState(PlayerState.run);
    } else {
      this.switchState(PlayerState.idle);
    }

    this.animateFrames();
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
  }

  private checkAttack(): void {
    if (
      this.currentState === PlayerState.attack &&
      this.playerToAttack &&
      this.imageCurrentFrame === this.attackFrame &&
      this.framesElapsed === 0
    ) {
      const attackingPosition = getBorderCoordinates(this.attackingBox);
      const playerToAttackPosition = getBorderCoordinates({
        position: this.playerToAttack.position,
        size: this.playerToAttack.healthBoxSize,
      });
      if (
        attackingPosition.leftTop.lte(playerToAttackPosition.rightBottom) &&
        playerToAttackPosition.leftTop.lte(attackingPosition.rightBottom)
      ) {
        this.playerToAttack.takeHit();
      }
    }
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

    this.velocityY = -9;
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
    if (
      this.currentState === PlayerState.attack ||
      this.attackPhase === Phase.started
    ) {
      return;
    }

    this.attackPhase = Phase.started;
    this.switchState(PlayerState.attack);
    this.playerToAttack = playerToAttack;
  }

  /**
   * Must be called, when user released attack button.
   */
  public stopAttackPhase(): void {
    this.attackPhase = Phase.ended;
  }

  public takeHit(): void {
    this._health -= 20;
    this.healthBar.style.width = `${this._health}%`;

    this.velocityY = 0;
    this.switchState(PlayerState.take_hit);
  }

  private switchState(state: PlayerState) {
    if (
      this.currentState === PlayerState.attack &&
      (this.imageCurrentFrame < this.imageMaxFrames - 1 ||
        this.framesElapsed < this.framesHold - 1)
    ) {
      return;
    }

    if (this.currentState !== state) {
      this.currentState = state;

      const stateSprite = this.stateSprite[state];
      this.image.src = stateSprite.imageSrc;
      this.imageMaxFrames = stateSprite.imageMaxFrames;
      this.framesHold = stateSprite.framesHold;

      this.imageCurrentFrame = 0;
      this.framesElapsed = -1;
    }
  }
}
