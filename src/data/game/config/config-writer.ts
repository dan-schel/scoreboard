import type { GameConfig } from "../game-config";
import type { ConfigPath, InvalidConfigError } from "./prop-object";
import type { ObjectConfigProp, ObjectConfigValue } from "./prop-object";

export abstract class GameConfigWriter<GameConfigType extends GameConfig> {
  private _values: ObjectConfigValue = {};

  constructor(readonly shape: ObjectConfigProp) {}

  getValue(): ObjectConfigValue {}

  validate(): InvalidConfigError[] {}

  abstract defaultValue(): object;

  abstract doAdditionalValidation(values: object): InvalidConfigError[];

  abstract build(values: object): GameConfigType;
}
