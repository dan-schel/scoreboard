import type { ConfigProp } from "./config-prop";

export abstract class PlayerConfig {
  // This is a hack to make the type system work. It can be removed if other
  // fields/methods are added.
  readonly _isPlayerConfig = true;
}

export abstract class PlayerConfigWriter<
  PlayerConfigType extends PlayerConfig,
> {
  abstract readonly props: ConfigProp[];

  abstract get(config: PlayerConfigType, prop: string): unknown;

  abstract set(
    config: PlayerConfigType,
    prop: string,
    value: unknown,
  ): PlayerConfigType;
}
