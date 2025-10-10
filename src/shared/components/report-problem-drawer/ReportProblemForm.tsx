import { useAuthenticatedUser } from "@/shared/hooks";
import { useCreateReport } from "@/shared/hooks/useReports";
import { Alert, AlertIcon, Button, Stack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import FormProvider from "../hook-form/FormProvider";
import RHFTextarea from "../hook-form/RHFTextarea";
import { getReportProblemSchema, ReportProblemFormValues } from "./yup";

export default function ReportProblemForm() {
  const { t } = useTranslation();
  const { user } = useAuthenticatedUser();
  const { mutate: createReport, isSuccess, isPending } = useCreateReport();

  const methods = useForm<ReportProblemFormValues>({
    resolver: yupResolver(getReportProblemSchema(t)),
    defaultValues: {
      problem: "",
    },
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = handleSubmit((data) => {
    if (!user?.id) return;

    createReport({
      problem: data.problem,
      user_id: user?.id,
    });

    reset();
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={4}>
        <RHFTextarea
          name="problem"
          label={t("components.reportProblem.form.label")}
          placeholder={t("components.reportProblem.form.placeholder")}
          rows={8}
        />

        {isSuccess && (
          <Alert status="info" colorScheme="cyan">
            <AlertIcon />
            {t("components.reportProblem.form.thankYouMessage")}
          </Alert>
        )}

        <Button
          type="submit"
          colorScheme="cyan"
          isLoading={isPending}
          width="full"
        >
          {t("components.reportProblem.form.submitButton")}
        </Button>
      </Stack>
    </FormProvider>
  );
}
