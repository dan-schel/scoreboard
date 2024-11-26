import { Prop, PropValue, type Validated } from "./prop";
import { PropIntegerValue } from "./prop-integer";
import { PropObjectValue } from "./prop-object";

export class PropArray extends Prop<PropArrayValue> {
  constructor(
    readonly initialLength: number,
    readonly minLen: number | null,
    readonly maxLen: number | null,

    // TODO: This will get called a lot. Maybe it would be better to have a
    // single itemType: Prop<any> field, and have a overrideInitialValue method
    // for the "different defaults per element" use case?
    readonly propByIndex: (index: number) => Prop<any>,
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

  validate(value: PropArrayValue): Validated<PropArrayValue> {
    const rangeError = this._rangeError(value.items.length);

    let allElementsValid = true;
    const validatedItems: PropValue[] = [];

    const maxIndexToCheck = Math.min(
      value.items.length,
      this.maxLen ?? Number.POSITIVE_INFINITY,
    );
    for (let i = 0; i < maxIndexToCheck; i++) {
      const prop = this.propByIndex(i);
      const elementValue = value.items[i];

      const validatedElement = prop.validate(elementValue);
      validatedItems.push(validatedElement.validated);
      if (!validatedElement.isValid) {
        allElementsValid = false;
      }
    }

    return {
      validated: new PropArrayValue(validatedItems, rangeError),
      isValid: allElementsValid && rangeError == null,
    };
  }

  private _rangeError(count: number): string | null {
    if (
      count < (this.minLen ?? Number.NEGATIVE_INFINITY) ||
      count > (this.maxLen ?? Number.POSITIVE_INFINITY)
    ) {
      return `Must be ${this._stateRange()}.`;
    }
    return null;
  }

  private _stateRange(): string {
    if (this.minLen != null && this.maxLen != null) {
      return `between ${this.minLen} and ${this.maxLen} item(s)`;
    } else if (this.minLen != null && this.maxLen == null) {
      return `at least ${this.minLen} item(s)`;
    } else if (this.minLen == null && this.maxLen != null) {
      return `at most ${this.maxLen} item(s)`;
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
}
