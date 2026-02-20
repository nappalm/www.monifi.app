import * as yup from "yup";

export const newBudgetSchema = (t: (key: string) => string) =>
  yup.object({
    name: yup.string().required(t("common.fieldRequired")),
    amount: yup
      .number()
      .typeError(t("common.fieldRequired"))
      .min(1, t("common.fieldRequired"))
      .required(t("common.fieldRequired")),
  });
