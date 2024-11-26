export type Validated<ValueType extends PropValue> = {
  validated: ValueType;
  isValid: boolean;
};

export abstract class Prop<ValueType extends PropValue> {
  constructor() {}

  abstract getInitialValue(): ValueType;

  abstract validate(value: ValueType): Validated<ValueType>;
}

export abstract class PropValue {
  // TODO: Originally I was going to remove this base class, since it's empty
  // right now. But I actually might keep it around, because I think I want to
  // refactor the error/validation/isValid stuff to potentially have errors
  // stored in the base class, or at least an isValid() abstract function that
  // regular types return true if their error field is set, and objects/arrays
  // also set to true if any child has an error. That way the error string is
  // the source of truth and we don't need to also implement separate isValid()
  // logic in validate().
  constructor() {}
}
