/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Removed as the rule '@typescript-eslint/ban-types' is not recognized or needed

const isFunction = (value: any): value is Function =>
  typeof value === "function";

export function runIfFn<T, U>(
  valueOrFn: T | ((...fnArgs: U[]) => T),
  ...args: U[]
): T {
  return isFunction(valueOrFn) ? valueOrFn(...args) : valueOrFn;
}
