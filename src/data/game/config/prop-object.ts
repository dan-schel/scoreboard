import { Prop, PropValue, type Validated } from "./prop";
import { PropArrayValue } from "./prop-array";
import { PropIntegerValue } from "./prop-integer";

export class PropObjectField {
  constructor(
    readonly key: string,
    readonly displayString: string,
    readonly prop: Prop<any>,
  ) {}
}

export class PropObject extends Prop<PropObjectValue> {
  constructor(readonly fields: PropObjectField[]) {
    super();
  }

  getInitialValue(): PropObjectValue {
    return new PropObjectValue(
      Object.fromEntries(
        this.fields.map((f) => [f.key, f.prop.getInitialValue()]),
      ),
      null,
    );
  }

  validate(value: PropObjectValue): Validated<PropObjectValue> {
    let allFieldsValid = true;
    let error = null;

    const validatedFields: Record<string, PropValue> = {};

    for (const field of this.fields) {
      const fieldValue = value.fields[field.key];
      if (fieldValue == null) {
        error = `Missing "${field.key}" field.`;
        continue;
      }

      const validatedField = field.prop.validate(fieldValue);
      validatedFields[field.key] = validatedField.validated;
      if (!validatedField.isValid) {
        allFieldsValid = false;
      }
    }

    return {
      validated: new PropObjectValue(validatedFields, error),
      isValid: allFieldsValid && error == null,
    };
  }
}

export class PropObjectValue extends PropValue {
  constructor(
    readonly fields: Record<string, PropValue>,
    readonly error: string | null,
  ) {
    super();
  }

  withField(key: string, value: PropValue) {
    return new PropObjectValue(
      {
        ...this.fields,
        [key]: value,
      },
      null,
    );
  }

  require(key: string): PropValue {
    const value = this.fields[key];
    if (value == null) {
      throw new Error(`Prop "${key}" not found.`);
    }
    return value;
  }

  requireObject(key: string): PropObjectValue {
    const prop = this.require(key);
    if (prop instanceof PropObjectValue) {
      return prop;
    }
    throw new Error(`Prop "${key}" is not an object.`);
  }

  requireArray(key: string): PropArrayValue {
    const prop = this.require(key);
    if (prop instanceof PropArrayValue) {
      return prop;
    }
    throw new Error(`Prop "${key}" is not an array.`);
  }

  requireInteger(key: string): PropIntegerValue {
    const prop = this.require(key);
    if (prop instanceof PropIntegerValue) {
      return prop;
    }
    throw new Error(`Prop "${key}" is not an integer.`);
  }
}
