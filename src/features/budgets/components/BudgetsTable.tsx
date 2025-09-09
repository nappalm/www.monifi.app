import { Column, InlineEditorGrid } from "@/shared";
import { HStack, Text } from "@chakra-ui/react";
import { IconAntennaBars2 } from "@tabler/icons-react";
import TableRowMenu from "./TableRowMenu";

type Props = {
  data: any[];
  onDataChange: (data: any) => void;
  onRemoveRow: (id: string) => void;
  onDisabledRow: (id: string) => void;
  onConfigRow: (id: string) => void;
  onEditRow: (id: string) => void;
};

export default function BudgetsTable({
  data,
  onDataChange,
  onRemoveRow,
  onDisabledRow,
  onConfigRow,
  onEditRow,
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
      render: (value: any) => `#${value}`,
    },
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Period",
      accessor: "period",
      isEditable: false,
    },
    {
      header: "Current",
      accessor: "current",
      isAmount: true,
      isEditable: false,
      render: (value: any) => (
        <HStack justifyContent="flex-end" w="full">
          <Text as="span">{value}</Text>
          <IconAntennaBars2 size={16} />
        </HStack>
      ),
    },
    {
      header: "Limit",
      accessor: "limit",
      isAmount: true,
      isEditable: false,
    },
    {
      header: "",
      accessor: "options",
      isEditable: false,
      sx: {
        w: "10px",
        opacity: 0.5,
        p: 0,
      },
      render: (_, row) => (
        <TableRowMenu
          onDelete={() => onRemoveRow(row.id)}
          onDisabled={() => onDisabledRow(row.id)}
          onConfig={() => onConfigRow(row.id)}
          onEdit={() => onEditRow(row.id)}
        />
      ),
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
