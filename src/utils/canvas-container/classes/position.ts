export class Position {
  public x: number;

  public y: number;

  constructor({ x, y }: { x: number; y: number }) {
    this.x = x;
    this.y = y;
  }

  public lte(position: Position): boolean {
    return this.x <= position.x && this.y <= position.y;
  }

  public minus(position: Position): Position {
    return new Position({ x: this.x - position.x, y: this.y - position.y });
  }
}
