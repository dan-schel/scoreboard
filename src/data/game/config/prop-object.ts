import { Prop, PropValue } from "./prop";
import { PropArrayValue } from "./prop-array";
import { PropEnumValue } from "./prop-enum";
import { PropIntegerValue } from "./prop-integer";

export class PropObjectField {
  constructor(
    readonly key: string,
    readonly displayString: string,
    readonly prop: Prop<PropValue>,
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

  validate(value: PropObjectValue): PropObjectValue {
    let error = null;

    const validatedFields: Record<string, PropValue> = {};

    for (const field of this.fields) {
      const fieldValue = value.fields[field.key];

      // Checking null here is fine, since we expect all values to be wrapped in
      // a PropValue object of some type, even intentionally "null" values.
      if (fieldValue == null) {
        error = `Missing "${field.key}" field.`;
        continue;
      }

      validatedFields[field.key] = field.prop.validate(fieldValue);
    }

    return new PropObjectValue(validatedFields, error);
  }
}

export class PropObjectValue extends PropValue {
  constructor(
    readonly fields: Record<string, PropValue>,
    readonly error: string | null,
  ) {
    super();
  }

  isValid(): boolean {
    return (
      this.error == null && Object.values(this.fields).every((f) => f.isValid())
    );
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

  requireEnum(key: string): PropEnumValue {
    const prop = this.require(key);
    if (prop instanceof PropEnumValue) {
      return prop;
    }
    throw new Error(`Prop "${key}" is not an enum.`);
  }
}
