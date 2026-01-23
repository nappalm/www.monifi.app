import { Button, HStack, Text } from "@chakra-ui/react";
import {
  Icon3dCubeSphere,
  IconArrowBarToDownDashed,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

type Props = {
  isLoadingNewRow: boolean;
  onClickNewRow: VoidFunction;
  onClickLoadFile: VoidFunction;
};

export default function ActionButtons({
  isLoadingNewRow = false,
  onClickLoadFile,
  onClickNewRow,
}: Props) {
  const { t } = useTranslation();

  return (
    <HStack gap={0}>
      <Button
        w={["full", "full", "fit-content"]}
        size="sm"
        leftIcon={<Icon3dCubeSphere size={16} />}
        borderRightRadius={0}
        onClick={onClickLoadFile}
      >
        Load File
      </Button>
      <Button
        colorScheme="cyan"
        w={["full", "full", "fit-content"]}
        size="sm"
        borderLeftRadius={0}
        leftIcon={<IconArrowBarToDownDashed size={16} />}
        onClick={onClickNewRow}
        isLoading={isLoadingNewRow}
        rightIcon={
          <Text fontSize="xs" opacity={0.5}>
            Ctrl + I
          </Text>
        }
      >
        {t("transactions.newRow")}
      </Button>
    </HStack>
  );
}
