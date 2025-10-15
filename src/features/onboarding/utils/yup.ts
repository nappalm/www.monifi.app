import * as yup from "yup";

export const onboardingAccountFormSchema = (t: (key: string) => string) => {
  return yup.object({
    name: yup.string().default("").required(t("common.fieldRequired")),
    color: yup.string().nullable().notRequired(),
  });
};

export const onboardingCategoryFormSchema = (t: (key: string) => string) => {
  return yup.object({
    name: yup.string().default("").required(t("common.fieldRequired")),
  });
};
