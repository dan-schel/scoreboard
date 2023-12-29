import { PlayerColors, type PlayerColor } from "./player-color";

export abstract class ConfigProp<
  PropType extends string = string,
  ValueType = unknown,
> {
  constructor(
    readonly key: string,
    readonly type: PropType,
  ) {}

  abstract parse(value: unknown): ValueType;
}

export class IntegerConfigProp extends ConfigProp<"integer", number> {
  readonly min: number | null;
  readonly max: number | null;

  constructor(key: string, { min, max }: { min?: number; max?: number } = {}) {
    super(key, "integer");
    this.min = min ?? null;
    this.max = max ?? null;
  }

  parse(value: unknown): number {
    if (typeof value !== "number" || !Number.isInteger(value)) {
      throw new Error(`Expected integer for "${this.key}".`);
    }
    if (this.min !== null && value < this.min) {
      throw new Error(`Expected "${this.key}" to be at least ${this.min}.`);
    }
    if (this.max !== null && value > this.max) {
      throw new Error(`Expected "${this.key}" to be at most ${this.max}.`);
    }
    return value;
  }
}

export class PlayerColorConfigProp extends ConfigProp<
  "player-color",
  PlayerColor
> {
  constructor(key: string) {
    super(key, "player-color");
  }

  parse(value: unknown): PlayerColor {
    if (typeof value !== "string") {
      throw new Error(`Expected string for "${this.key}".`);
    }
    if (!PlayerColors.includes(value as PlayerColor)) {
      throw new Error(`Expected "${this.key}" to be a valid player color.`);
    }
    return value as PlayerColor;
  }
}
