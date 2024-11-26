import { parseIntNull } from "@dan-schel/js-utils";
import { Prop, PropValue } from "./prop";

export class PropInteger extends Prop<PropIntegerValue> {
  constructor(
    readonly initialValue: number,
    readonly min: number | null,
    readonly max: number | null,
  ) {
    super();
  }

  getInitialValue(): PropIntegerValue {
    return new PropIntegerValue(this.initialValue.toFixed(), null);
  }

  validate(value: PropIntegerValue): PropIntegerValue {
    if (value.value == null) {
      return new PropIntegerValue(value.textValue, "Must be an integer.");
    }

    const error = this._rangeError(value.value);
    return new PropIntegerValue(value.textValue, error);
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

export class PropIntegerValue extends PropValue {
  readonly value: number | null;

  constructor(
    readonly textValue: string,
    readonly error: string | null,
  ) {
    super();
    this.value = parseIntNull(this.textValue);
  }

  isValid(): boolean {
    return this.error == null;
  }

  withValue(newTextValue: string) {
    return new PropIntegerValue(newTextValue, null);
  }

  require(): number {
    if (this.value == null) {
      throw new Error("Integer was not valid.");
    }
    return this.value;
  }
}
