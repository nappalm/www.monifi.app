import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

type ParamsObject = Record<string, string | number | boolean | null | undefined>;

const useQueryParams = (defaultParams: ParamsObject = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { hasOwnProperty } = Object.prototype;

  const setParams = (newParams: ParamsObject) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    const mergedParams = { ...defaultParams, ...currentParams, ...newParams };

    const cleanedParams: Record<string, string> = {};
    Object.keys(mergedParams).forEach((key) => {
      const value = mergedParams[key];
      if (value !== null && value !== undefined) {
        cleanedParams[key] = String(value);
      }
    });

    setSearchParams(cleanedParams, { replace: true });
  };

  useEffect(() => {
    const currentParams = Object.fromEntries(searchParams.entries());
    const missingDefaults: Record<string, string> = {};

    Object.keys(defaultParams).forEach((key) => {
      if (!hasOwnProperty.call(currentParams, key)) {
        const value = defaultParams[key];
        if (value !== null && value !== undefined) {
          missingDefaults[key] = String(value);
        }
      }
    });

    if (Object.keys(missingDefaults).length > 0) {
      setSearchParams(
        { ...currentParams, ...missingDefaults },
        { replace: true },
      );
    }
  }, [searchParams, setSearchParams, defaultParams, hasOwnProperty]);

  const currentParamsWithDefaults = {
    ...defaultParams,
    ...Object.fromEntries(searchParams.entries()),
  };

  return [currentParamsWithDefaults, setParams];
};

export default useQueryParams;
