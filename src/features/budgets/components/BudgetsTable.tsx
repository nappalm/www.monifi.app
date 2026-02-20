import { Column, formatCurrency, InlineEditorGrid } from "@/shared";
import { useTranslation } from "react-i18next";
import TableRowMenu from "./TableRowMenu";

type BudgetCategoryRow = {
  id: number;
  category_id: number;
  category_name: string;
  amount: number;
  description?: string;
};

type Props = {
  data: BudgetCategoryRow[];
  isLoading: boolean;
  onRowChange: (
    updatedData: BudgetCategoryRow,
    rowIndex: number,
    colIndex: number,
  ) => void;
  onRemoveRow: (id: number) => void;
  height?: string;
  spentByCategory?: Record<number, number>;
};

export default function BudgetsTable({
  data,
  isLoading,
  onRowChange,
  onRemoveRow,
  height,
  spentByCategory = {},
}: Props) {
  const { t } = useTranslation();

  const columns: Column<BudgetCategoryRow>[] = [
    {
      accessor: "id",
      header: t("budgets.table.id"),
      isVisible: false,
    },
    {
      header: t("budgets.table.category"),
      accessor: "category_name",
      isDraggable: false,
      sx: {
        w: "200px",
        minW: "200px",
      },
    },
    {
      header: t("budgets.table.limitValue"),
      accessor: "amount",
      isAmount: true,
      sx: {
        w: "150px",
        minW: "150px",
        fontFamily: "Geist Mono",
      },
    },
    {
      header: t("budgets.table.currentSpent"),
      accessor: "currentSpent",
      isEditable: false,
      isDraggable: false,
      sx: {
        w: "150px",
        minW: "150px",
        fontFamily: "Geist Mono",
      },
      render: (_, row) =>
        formatCurrency(spentByCategory[row.category_id] ?? 0),
    },
    {
      header: t("budgets.table.description"),
      accessor: "description",
      sx: {
        w: "200px",
        minW: "200px",
      },
    },
    {
      header: "",
      accessor: "options",
      isEditable: false,
      isDraggable: false,
      sx: {
        w: "15px",
        maxW: "15px",
        minW: "15px",
        opacity: 0.5,
        p: 0,
      },
      render: (_, row) => (
        <TableRowMenu onDelete={() => onRemoveRow(row.category_id)} />
      ),
    },
  ];

  return (
    <InlineEditorGrid<BudgetCategoryRow>
      columns={columns}
      data={data}
      isLoading={isLoading}
      onRowChange={onRowChange}
      showRowNumber
      height={height}
    />
  );
}
