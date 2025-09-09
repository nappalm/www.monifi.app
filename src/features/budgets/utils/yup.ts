import * as yup from "yup";

export const budgetSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
});
