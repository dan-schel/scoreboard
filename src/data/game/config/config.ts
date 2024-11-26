import type { PropObject, PropObjectValue } from "./prop-object";

export abstract class GameConfig {
  constructor() {}

  // TODO: For showing the chosen rules in the UI.
  abstract toDisplayString(): string;

  abstract getPlayerCount(): number;
}

export abstract class GameConfigWriter<GameConfigType extends GameConfig> {
  constructor(readonly configProp: PropObject) {}

  defaultValue(): PropObjectValue {
    return this.configProp.getInitialValue();
  }

  validate(value: PropObjectValue): PropObjectValue {
    const validated = this.configProp.validate(value);
    if (!validated.isValid()) {
      return validated;
    }
    return this.doAdditionalValidation(validated);
  }

  abstract doAdditionalValidation(value: PropObjectValue): PropObjectValue;

  abstract build(value: PropObjectValue): GameConfigType;
}
