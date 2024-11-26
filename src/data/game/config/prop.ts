export type Validated<ValueType extends PropValue<any>> = {
  validated: ValueType;
  isValid: boolean;
};

export abstract class Prop<ValueType extends PropValue<any>> {
  constructor() {}

  abstract getInitialValue(): ValueType;

  abstract validate(value: ValueType): Validated<ValueType>;
}

export abstract class PropValue<PropType extends Prop<any>> {
  // TODO: I think prop here is unused, and can be removed, along with the
  // generic, and probably this entire base class?
  constructor(readonly prop: PropType) {}
}
