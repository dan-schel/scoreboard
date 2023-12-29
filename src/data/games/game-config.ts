export abstract class GameConfig {
  // Typescript doesn't type check the GameConfigType generic is actually a
  // GameConfig if GameConfig is an empty class. If GameConfig has another
  // property or method to give it shape then this field can be removed.
  private readonly _isGameConfig = true;
}

export abstract class GameConfigShape<GameConfigType extends GameConfig> {
  abstract readonly props: GameConfigProp<string, any>[];

  abstract parse(values: Map<string, unknown>): GameConfigType;

  static getValue<T>(
    prop: GameConfigProp<string, T>,
    values: Map<string, unknown>,
  ): T {
    const value = values.get(prop.key);
    if (value === undefined) {
      throw new Error(`Expected "${prop.key}" prop.`);
    }
    return prop.parse(value);
  }
}

export abstract class GameConfigProp<PropType extends string, ValueType> {
  constructor(
    readonly key: string,
    readonly type: PropType,
  ) {}

  abstract parse(value: unknown): ValueType;
}

export class IntegerGameConfigProp extends GameConfigProp<"integer", number> {
  readonly min: number | null;
  readonly max: number | null;

  constructor(key: string, { min, max }: { min?: number; max?: number } = {}) {
    super(key, "integer");
    this.min = min ?? null;
    this.max = max ?? null;
  }

  parse(value: unknown): number {
    if (typeof value !== "number") {
      throw new Error(`Expected number for "${this.key}".`);
    }
    if (!Number.isInteger(value)) {
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
