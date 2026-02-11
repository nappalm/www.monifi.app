import { Column, InlineEditorGrid } from "@/shared";
import { IconButton, Stack } from "@chakra-ui/react";
import { IconTrashFilled } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { CategoriesLocalData } from "../utils/types";

type Props = {
  data: CategoriesLocalData[];
  isLoading: boolean;
  onRemoveRow: (id: number) => void;
  onRowChange: (updatedData: CategoriesLocalData, rowIndex: number) => void;
};

export default function OnboardingCategoriesTable({
  data,
  isLoading,
  onRemoveRow,
  onRowChange,
}: Props) {
  const { t } = useTranslation();

  const columns: Column<CategoriesLocalData>[] = [
    {
      accessor: "id",
      header: "ID",
      isVisible: false,
    },
    {
      header: t("onboarding.categoriesForm.category"),
      accessor: "name",
      sx: {
        minW: "200px",
        maxW: "400px",
      },
    },
    {
      header: "",
      accessor: "options",
      isEditable: false,
      isDraggable: false,
      sx: {
        w: "40px",
        minW: "40px",
        opacity: 0.5,
        p: 0,
        textAlign: "center",
      },
      render: (_, row) => (
        <IconButton
          icon={<IconTrashFilled size={16} />}
          variant="ghost"
          bg="transparent"
          _hover={{
            bg: "transparent",
            color: "teal.500",
          }}
          size="sm"
          w="full"
          aria-label="Remove"
          onClick={() => onRemoveRow(row.id)}
        />
      ),
    },
  ];

  return (
    <Stack spacing={6}>
      <InlineEditorGrid<CategoriesLocalData>
        columns={columns}
        data={data}
        isLoading={isLoading}
        onRowChange={onRowChange}
        showRowNumber
      />
    </Stack>
  );
}
