import { useState, useCallback } from "react";

const useBoolean = (initialState = false) => {
  const [value, setValue] = useState(initialState);

  const on = useCallback(() => setValue(true), []);
  const off = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue((prev) => !prev), []);

  return [value, { on, off, toggle }];
};

export default useBoolean;
