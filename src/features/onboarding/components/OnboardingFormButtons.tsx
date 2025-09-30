import { Button, ButtonGroup, HStack } from "@chakra-ui/react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { CommmonFormProps } from "../utils/types";

export default function OnboardingFormButtons({
  onSkip,
  onBack,
  onNext,
  isLoading,
}: CommmonFormProps) {
  const { t } = useTranslation();

  return (
    <HStack justify="space-between">
      <Button
        onClick={onBack}
        size="sm"
        variant="ghost"
        leftIcon={<IconArrowLeft size={16} />}
      >
        {t("common.back")}
      </Button>
      <ButtonGroup spacing="1px" isDisabled={isLoading} size="sm">
        <Button
          onClick={onSkip}
          variant="ghost"
          isDisabled={isLoading}
          borderRightRadius={0}
        >
          {t("common.skip")}
        </Button>
        <Button
          type="submit"
          borderLeftRadius={0}
          onClick={onNext}
          isLoading={isLoading}
          rightIcon={<IconArrowRight size={16} />}
        >
          {t("common.next")}
        </Button>
      </ButtonGroup>
    </HStack>
  );
}
