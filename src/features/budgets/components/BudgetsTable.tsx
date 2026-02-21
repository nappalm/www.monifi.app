import { Column, formatCurrency, InlineEditorGrid } from "@/shared";
import {
  IconAntennaBars1,
  IconAntennaBars2,
  IconAntennaBars3,
  IconAntennaBars4,
  IconAntennaBars5,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import TableRowMenu from "./TableRowMenu";
import _colors from "@/lib/chakra-ui/_colors";

const ANTENNA_ICONS = [
  IconAntennaBars1,
  IconAntennaBars2,
  IconAntennaBars3,
  IconAntennaBars4,
  IconAntennaBars5,
];

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

  const getAntennaIcon = (spent: number, limit: number) => {
    const exceeded = limit > 0 && spent > limit;
    const level =
      limit === 0 ? 0 : Math.min(4, Math.round((spent / limit) * 4));
    const IconComponent = ANTENNA_ICONS[level];
    return (
      <IconComponent
        size={20}
        color={exceeded ? _colors.red[500] : undefined}
      />
    );
  };

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
        opacity: 0.7,
      },
      render: (_, row) => {
        const spent = spentByCategory[row.category_id] ?? 0;
        return (
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {getAntennaIcon(spent, row.amount)}
            {formatCurrency(spent)}
          </span>
        );
      },
    },
    {
      header: t("budgets.table.description"),
      accessor: "description",
      sx: {
        w: "full",
        minW: "full",
      },
    },
    {
      header: "",
      accessor: "options",
      isEditable: false,
      isDraggable: false,
      sx: {
        w: "25px",
        maxW: "25px",
        minW: "25px",
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
