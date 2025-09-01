import * as yup from "yup";

export const changePasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  repeat_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Repeat password is required"),
});

export const profileSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
});
