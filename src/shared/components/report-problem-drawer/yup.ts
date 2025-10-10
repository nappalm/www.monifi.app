import * as yup from "yup";

export const getReportProblemSchema = (t: (key: string) => string) => {
  return yup.object().shape({
    problem: yup
      .string()
      .required(t("components.reportProblem.validation.required"))
      .min(10, t("components.reportProblem.validation.minLength"))
      .max(1000, t("components.reportProblem.validation.maxLength")),
  });
};

export type ReportProblemFormValues = {
  problem: string;
};
