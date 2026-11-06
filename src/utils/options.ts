/*
 * Copyright (c) Jupyter Development Team.
 * Distributed under the terms of the Modified BSD License.
 */

/**
 * Resolves a configurable name list option.
 *
 * A user-supplied list is *added* to the built-in defaults, so a project only
 * has to name its own entries rather than restate this plugin's list. Passing
 * the matching `extendDefault...` option as `false` drops the defaults, whether
 * or not a replacement list is given.
 */
export function resolveNameListOption(
  provided: readonly string[] | undefined,
  defaults: readonly string[],
  extendDefaults: boolean
): Set<string> {
  const names = extendDefaults ? [...defaults] : [];
  if (provided) {
    names.push(...provided);
  }
  return new Set(names);
}
