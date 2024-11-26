import {
  playerColorDisplayStrings,
  PlayerColors,
  type PlayerColor,
} from "@/data/game-utils/player-color";
import { Prop, PropValue } from "./prop";

export class PropEnumOption {
  constructor(
    readonly value: string,
    readonly label: string,
  ) {}
}

export class PropEnum extends Prop<PropEnumValue> {
  constructor(
    readonly options: PropEnumOption[],
    readonly initialValue: string,
  ) {
    super();
  }

  getInitialValue(): PropEnumValue {
    return new PropEnumValue(this.initialValue, null);
  }

  validate(value: PropEnumValue): PropEnumValue {
    if (this.options.every((x) => x.value !== value.value)) {
      return new PropEnumValue(
        value.value,
        `"${value.value}" is not one of the options.`,
      );
    }
    return new PropEnumValue(value.value, null);
  }

  static fromArray<T extends string>(
    options: T[] | readonly T[],
    labels: Record<T, string>,
    initialValue: T,
  ) {
    return new PropEnum(
      options.map((x: T) => new PropEnumOption(x, labels[x])),
      initialValue,
    );
  }

  static playerColors(initialValue: PlayerColor) {
    return PropEnum.fromArray<PlayerColor>(
      PlayerColors,
      playerColorDisplayStrings,
      initialValue,
    );
  }
}

export class PropEnumValue extends PropValue {
  constructor(
    readonly value: string,
    readonly error: string | null,
  ) {
    super();
  }

  isValid(): boolean {
    return this.error == null;
  }

  withValue(newValue: string) {
    return new PropEnumValue(newValue, null);
  }

  requireOneOf<T extends string>(options: T[] | readonly T[]): T {
    if (!(options as string[]).includes(this.value)) {
      throw new Error(`Value "${this.value}" was not one of the options.`);
    }
    return this.value as T;
  }

  requirePlayerColor(): PlayerColor {
    return this.requireOneOf<PlayerColor>(PlayerColors);
  }
}
