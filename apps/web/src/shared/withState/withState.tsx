import type React from "react";
import type { JSX } from "react";

export const withState =
  <
    State extends Record<string, unknown>,
    Props extends Record<string, unknown> = Record<string, never>,
  >(
    stateHook: (props: Props) => State,
    StateLessComponent: React.ComponentType<State & Props>,
  ): ((props: Props) => JSX.Element) =>
  (props: Props): JSX.Element => {
    const state = stateHook(props);
    return <StateLessComponent {...state} {...props} />;
  };
