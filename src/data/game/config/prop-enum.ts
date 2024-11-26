import {
  accentColorDisplayStrings,
  AccentColors,
  type AccentColor,
} from "@/data/game-utils/accent-color";
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

  static accentColors(initialValue: AccentColor) {
    return PropEnum.fromArray<AccentColor>(
      AccentColors,
      accentColorDisplayStrings,
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

  requireAccentColor(): AccentColor {
    return this.requireOneOf<AccentColor>(AccentColors);
  }
}
