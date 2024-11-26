import { Prop, PropValue } from "./prop";
import { PropEnumValue } from "./prop-enum";
import { PropIntegerValue } from "./prop-integer";
import { PropObjectValue } from "./prop-object";

export class PropArray extends Prop<PropArrayValue> {
  constructor(
    readonly initialLength: number,
    readonly minLength: number | null,
    readonly maxLength: number | null,

    // TODO: This will get called a lot. Maybe it would be better to have a
    // single itemType: Prop<PropValue> field, and have a overrideInitialValue
    // method for the "different defaults per element" use case?
    readonly propByIndex: (index: number) => Prop<PropValue>,
  ) {
    super();
  }

  getInitialValue(): PropArrayValue {
    const items: PropValue[] = [];

    for (let i = 0; i < this.initialLength; i++) {
      const prop = this.propByIndex(i);
      items.push(prop.getInitialValue());
    }

    return new PropArrayValue(items, null);
  }

  validate(value: PropArrayValue): PropArrayValue {
    const rangeError = this._rangeError(value.items.length);

    const validatedItems: PropValue[] = [];

    // Never try to check beyond maxLen, because propByIndex() might not expect
    // to run for that index.
    const maxIndexToCheck = Math.min(
      value.items.length,
      this.maxLength ?? Number.POSITIVE_INFINITY,
    );

    for (let i = 0; i < maxIndexToCheck; i++) {
      validatedItems.push(this.propByIndex(i).validate(value.items[i]));
    }

    return new PropArrayValue(validatedItems, rangeError);
  }

  private _rangeError(count: number): string | null {
    if (
      count < (this.minLength ?? Number.NEGATIVE_INFINITY) ||
      count > (this.maxLength ?? Number.POSITIVE_INFINITY)
    ) {
      return `Must be ${this._stateRange()}.`;
    }
    return null;
  }

  private _stateRange(): string {
    if (this.minLength != null && this.maxLength != null) {
      return `between ${this.minLength} and ${this.maxLength} item(s)`;
    } else if (this.minLength != null && this.maxLength == null) {
      return `at least ${this.minLength} item(s)`;
    } else if (this.minLength == null && this.maxLength != null) {
      return `at most ${this.maxLength} item(s)`;
    } else {
      throw new Error("No range to state.");
    }
  }
}

export class PropArrayValue extends PropValue {
  constructor(
    readonly items: PropValue[],
    readonly error: string | null,
  ) {
    super();
  }

  isValid(): boolean {
    return this.error == null && this.items.every((f) => f.isValid());
  }

  withElement(index: number, value: PropValue) {
    const items = [...this.items];
    items[index] = value;
    return new PropArrayValue(items, null);
  }

  require(index: number): PropValue {
    if (index < 0 || index >= this.items.length) {
      throw new Error(
        `Index "${index}" was not within the bounds of the array.`,
      );
    }
    return this.items[index];
  }

  requireObject(index: number): PropObjectValue {
    const prop = this.require(index);
    if (prop instanceof PropObjectValue) {
      return prop;
    }
    throw new Error(`Prop at index "${index}" is not an object.`);
  }

  requireArray(index: number): PropArrayValue {
    const prop = this.require(index);
    if (prop instanceof PropArrayValue) {
      return prop;
    }
    throw new Error(`Prop at index "${index}" is not an array.`);
  }

  requireInteger(index: number): PropIntegerValue {
    const prop = this.require(index);
    if (prop instanceof PropIntegerValue) {
      return prop;
    }
    throw new Error(`Prop at index "${index}" is not an integer.`);
  }

  requireEnum(index: number): PropEnumValue {
    const prop = this.require(index);
    if (prop instanceof PropEnumValue) {
      return prop;
    }
    throw new Error(`Prop at index "${index}" is not an enum.`);
  }
}
