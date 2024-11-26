import { parseIntNull } from "@dan-schel/js-utils/dist/types";
import { Prop, PropValue, type Validated } from "./prop";

export class PropInteger extends Prop<PropIntegerValue> {
  constructor(
    readonly initialValue: number,
    readonly min: number | null,
    readonly max: number | null,
  ) {
    super();
  }

  getInitialValue(): PropIntegerValue {
    return new PropIntegerValue(this, this.initialValue.toFixed(), null);
  }

  validate(value: PropIntegerValue): Validated<PropIntegerValue> {
    if (value.value == null) {
      const error = "Must be an integer.";
      return {
        validated: new PropIntegerValue(this, value.textValue, error),
        isValid: false,
      };
    }

    const error = this._rangeError(value.value);
    return {
      validated: new PropIntegerValue(this, value.textValue, error),
      isValid: error != null,
    };
  }

  private _rangeError(value: number): string | null {
    if (
      value < (this.min ?? Number.NEGATIVE_INFINITY) ||
      value > (this.max ?? Number.POSITIVE_INFINITY)
    ) {
      return `Must be ${this._stateRange()}.`;
    }
    return null;
  }

  private _stateRange(): string {
    if (this.min != null && this.max != null) {
      return `between ${this.min} and ${this.max}`;
    } else if (this.min != null && this.max == null) {
      return `at least ${this.min}`;
    } else if (this.min == null && this.max != null) {
      return `at most ${this.max}`;
    } else {
      throw new Error("No range to state.");
    }
  }
}

export class PropIntegerValue extends PropValue<PropInteger> {
  readonly value: number | null;

  constructor(
    prop: PropInteger,
    readonly textValue: string,
    readonly error: string | null,
  ) {
    super(prop);
    this.value = parseIntNull(this.textValue);
  }

  withValue(newTextValue: string) {
    return new PropIntegerValue(this.prop, newTextValue, null);
  }
}
