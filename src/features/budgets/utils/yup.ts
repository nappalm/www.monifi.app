import * as yup from "yup";

export const newBudgetSchema = (t: (key: string) => string) =>
  yup.object({
    name: yup.string().required(t("common.fieldRequired")),
    amount: yup
      .number()
      .typeError(t("common.fieldRequired"))
      .min(1, t("common.fieldRequired"))
      .required(t("common.fieldRequired")),
    recurrent: yup.boolean().default(true),
    includeYear: yup.boolean().default(false),
    start_day: yup
      .number()
      .nullable()
      .when("recurrent", {
        is: false,
        then: (s) => s.required(t("common.fieldRequired")).min(1).max(31),
        otherwise: (s) => s.nullable().notRequired(),
      }),
    start_month: yup
      .number()
      .nullable()
      .when("recurrent", {
        is: false,
        then: (s) => s.required(t("common.fieldRequired")).min(1).max(12),
        otherwise: (s) => s.nullable().notRequired(),
      }),
    end_day: yup
      .number()
      .nullable()
      .when("recurrent", {
        is: false,
        then: (s) => s.required(t("common.fieldRequired")).min(1).max(31),
        otherwise: (s) => s.nullable().notRequired(),
      }),
    end_month: yup
      .number()
      .nullable()
      .when("recurrent", {
        is: false,
        then: (s) => s.required(t("common.fieldRequired")).min(1).max(12),
        otherwise: (s) => s.nullable().notRequired(),
      }),
    specific_year: yup
      .string()
      .nullable()
      .when(["recurrent", "includeYear"], {
        is: (recurrent: boolean, includeYear: boolean) =>
          !recurrent && !includeYear,
        then: (s) =>
          s
            .required(t("common.fieldRequired"))
            .matches(/^\d{4}$/, t("common.fieldRequired")),
        otherwise: (s) => s.nullable().notRequired(),
      }),
  });
