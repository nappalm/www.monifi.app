import { Heading, Stack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import AuthenticationForm from "../components/authentication/Authentication";

export default function Authentication() {
  const { t } = useTranslation();
  return (
    <Stack>
      <Heading fontWeight={500} size="lg">
        {t("settings.authentication.title")}
      </Heading>
      <AuthenticationForm />
    </Stack>
  );
}
