import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const useQueryParams = (defaultParams = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { hasOwnProperty } = Object.prototype;

  const setParams = (newParams) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    const mergedParams = { ...defaultParams, ...currentParams, ...newParams };

    Object.keys(mergedParams).forEach((key) => {
      if (mergedParams[key] === null || mergedParams[key] === undefined) {
        delete mergedParams[key];
      }
    });

    setSearchParams(mergedParams, { replace: true });
  };

  useEffect(() => {
    const currentParams = Object.fromEntries(searchParams.entries());
    const missingDefaults = {};

    Object.keys(defaultParams).forEach((key) => {
      if (!hasOwnProperty.call(currentParams, key)) {
        missingDefaults[key] = defaultParams[key];
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
