import { CategorySelect, Column, InlineEditorGrid } from "@/shared";
import { IconButton } from "@chakra-ui/react";
import { IconCancel } from "@tabler/icons-react";

type Props = {
  data: any[];
  onDataChange: (data: any) => void;
  onRemoveRow: (id: string) => void;
};

export default function BudgetsCategoriesTable({
  data,
  onDataChange,
  onRemoveRow,
}: Props) {
  const columns: Column<any>[] = [
    {
      accessor: "id",
      header: "ID",
      isVisible: false,
    },
    {
      header: "",
      accessor: "rowNumber",
      isEditable: false,
      sx: {
        w: "10px",
        opacity: 0.7,
      },
    },
    {
      header: "Category",
      accessor: "category",
      isEditable: false,
      sx: {
        padding: 0,
      },
      render: () => {
        return <CategorySelect />;
      },
    },
    { header: "Description", accessor: "description" },
    { header: "Budget", accessor: "budget", isAmount: true },
    {
      header: "",
      accessor: "actions",
      isEditable: false,
      sx: {
        padding: 0,
        w: "10px",
        opacity: 0.5,
      },
      render: (_, row) => {
        return (
          <IconButton
            aria-label="Delete"
            variant="unstyled"
            size="xs"
            w="full"
            pl={2}
            icon={<IconCancel size={16} />}
            onClick={() => onRemoveRow(row.id)}
          />
        );
      },
    },
  ];

  return (
    <InlineEditorGrid
      columns={columns}
      data={data}
      isLoading={false}
      onDataChange={onDataChange}
    />
  );
}
