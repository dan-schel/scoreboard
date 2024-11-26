import type { Validated } from "./prop";
import type { PropObject, PropObjectValue } from "./prop-object";

export abstract class GameConfig {
  constructor() {}

  // TODO: For showing the chosen rules in the UI.
  abstract toDisplayString(): string;

  abstract getPlayerCount(): number;
}

export abstract class GameConfigWriter<GameConfigType extends GameConfig> {
  constructor(readonly configProp: PropObject) {}

  validate(value: PropObjectValue): Validated<PropObjectValue> {
    const validated = this.configProp.validate(value);
    if (!validated.isValid) {
      return validated;
    }
    return this.doAdditionalValidation(validated.validated);
  }

  defaultValue(): PropObjectValue {
    return this.configProp.getInitialValue();
  }

  abstract doAdditionalValidation(
    values: PropObjectValue,
  ): Validated<PropObjectValue>;

  abstract build(values: PropObjectValue): GameConfigType;
}
