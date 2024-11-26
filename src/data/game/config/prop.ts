export abstract class Prop<ValueType extends PropValue> {
  constructor() {}

  abstract getInitialValue(): ValueType;

  abstract validate(value: ValueType): ValueType;
}

export abstract class PropValue {
  constructor() {}

  abstract isValid(): boolean;
}
