import { Heading, Stack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import ChangePasswordForm from "../components/change-password/ChangePasswordForm";

export default function ChangePassword() {
  const { t } = useTranslation();
  return (
    <Stack w={["100%", "100%", "100%", "50%"]}>
      <Heading fontWeight={500} size="lg">
        {t("settings.changePassword.title")}
      </Heading>
      <ChangePasswordForm />
    </Stack>
  );
}
