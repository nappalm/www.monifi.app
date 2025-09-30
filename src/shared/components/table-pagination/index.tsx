import {
  Button,
  ButtonGroup,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

type Props = {
  rowsPerPage?: number;
  total?: number | null;
  lastPage?: number;
  currentPage?: number;
  onNext?: VoidFunction;
  onPrev?: VoidFunction;
};

export function TablePagination({
  rowsPerPage = 20,
  total = 0,
  onNext,
  onPrev,
  currentPage = 1,
  lastPage,
}: Props) {
  const { t } = useTranslation();
  const bg = useColorModeValue("gray.200", "whiteAlpha.200");
  if (!total) return null;

  const from = (currentPage - 1) * rowsPerPage + 1;
  const to = Math.min(currentPage * rowsPerPage, total);

  return (
    <HStack
      borderTop="1px solid"
      borderColor={bg}
      justify="space-between"
      py={2}
      px={4}
    >
      <Text color="gray.400">
        {t("components.tablePagination.viewing", { from, to, total })}
      </Text>
      <ButtonGroup size="sm" alignItems="center" spacing={1}>
        <Button onClick={onPrev} isDisabled={currentPage === 1}>
          {t("components.tablePagination.back")}
        </Button>
        <Button onClick={onNext} isDisabled={currentPage === lastPage}>
          {t("components.tablePagination.next")}
        </Button>
      </ButtonGroup>
    </HStack>
  );
}
