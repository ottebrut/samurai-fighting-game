import { Direction, JumpState, Phase, Size } from "../models";
import { gravity } from "../constants";
import { getFullPosition } from "../functions/get-full-position";
import { Position } from "./position";

const defaultJumpState: JumpState = { counter: 0, phase: Phase.ended };

export class Sprite {
  private readonly canvasSize: Size;

  private readonly canvasContext: CanvasRenderingContext2D;

  private readonly _size: Size = { width: 50, height: 150 };

  private readonly color: string;

  private readonly _position: Position;

  private velocityY = 0;

  private currentDirections: Direction[] = [];

  private jumpState = defaultJumpState;

  private readonly attackingBox: {
    position: Position;
    size: Size;
    offset: Position;
  };

  private isAttacking = false;

  private attackPhase = Phase.started;

  private _health = 100;

  private readonly healthBar: HTMLDivElement;

  public get size(): Size {
    return { ...this._size };
  }

  public get position(): Position {
    return new Position(this._position);
  }

  public get health(): number {
    return this._health;
  }

  constructor({
    canvasSize,
    canvasContext,
    position,
    color = "red",
    attackingBoxOffset = new Position({ x: 0, y: 0 }),
    healthBar,
  }: {
    canvasSize: Size;
    canvasContext: CanvasRenderingContext2D;
    position: Position;
    color?: string;
    attackingBoxOffset?: Position;
    healthBar: HTMLDivElement;
  }) {
    this.canvasSize = canvasSize;
    this.canvasContext = canvasContext;

    this.color = color;
    this._position = position;
    this.attackingBox = {
      position: new Position(this._position),
      size: { width: 100, height: 50 },
      offset: attackingBoxOffset,
    };

    this.healthBar = healthBar;
  }

  public draw(): void {
    this.canvasContext.fillStyle = this.color;
    this.canvasContext.fillRect(
      this._position.x,
      this._position.y,
      this._size.width,
      this._size.height
    );

    if (this.isAttacking) {
      this.canvasContext.fillStyle = "green";
      this.canvasContext.fillRect(
        this.attackingBox.position.x,
        this.attackingBox.position.y,
        this.attackingBox.size.width,
        this.attackingBox.size.height
      );
    }
  }

  public update(): void {
    this.draw();

    this._position.y += this.velocityY;
    if (this._position.y + this._size.height >= this.canvasSize.height) {
      this._position.y = this.canvasSize.height - this._size.height;
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
      this._position.x += direction === Direction.left ? -6 : 6;
    }

    this.attackingBox.position = this._position.minus(this.attackingBox.offset);
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

  public startAttackPhase(playerToAttack: Sprite): void {
    if (this.isAttacking || this.attackPhase === Phase.started) {
      return;
    }

    this.attackPhase = Phase.started;
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);

    const attackingPosition = getFullPosition(this.attackingBox);
    const playerToAttackPosition = getFullPosition(playerToAttack);
    if (
      attackingPosition.leftTop.lte(playerToAttackPosition.rightBottom) &&
      playerToAttackPosition.leftTop.lte(attackingPosition.rightBottom)
    ) {
      playerToAttack.getHit();
    }
  }

  public stopAttackPhase(): void {
    this.attackPhase = Phase.ended;
  }

  public getHit(): void {
    this._health -= 20;
    this.healthBar.style.width = `${this._health}%`;
  }
}
