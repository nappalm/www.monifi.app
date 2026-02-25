import { Tables } from "@/lib/supabase/database.types";
import { AccountSelect, CategorySelect } from "@/shared";
import {
  VirtualDataGrid,
  type GridColumn,
} from "@/shared/components/virtual-data-grid";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DatePickerSelect from "./DatePickerSelect";
import TableRowMenu from "./TableRowMenu";
import TypeSelect from "./TypeSelect";

type Props = {
  data: Tables<"transactions">[];
  isLoading: boolean;
  onRowChange: (updatedData: Tables<"transactions">, rowIndex: number) => void;
  onAdminCategories: VoidFunction;
  onAdminAccounts: VoidFunction;
  onRemoveRow: (id: number) => void;
  onSeeDetailsRow: (id: number) => void;
  onDisabledRow: (id: number, previous: boolean) => void;
  height?: string;
};

export default function TransactionsTable({
  data,
  isLoading,
  onRowChange,
  onRemoveRow,
  onSeeDetailsRow,
  onDisabledRow,
  onAdminCategories,
  onAdminAccounts,
  height,
}: Props) {
  const { t } = useTranslation();

  // Internal data state — syncs with prop (React Query) and allows
  // immediate UI updates before the backend round-trip completes.
  const [internalData, setInternalData] = useState(data);
  useEffect(() => {
    setInternalData(data);
  }, [data]);

  const columns = useMemo<GridColumn<Tables<"transactions">>[]>(
    () => [
      {
        accessor: "id",
        header: t("transactions.table.id"),
        isVisible: false,
      },
      {
        header: t("transactions.table.date"),
        accessor: "occurred_at",
        isEditable: false,
        width: 130,
        minWidth: 130,
        cellStyle: { padding: 0 },
        render: (value, _, updateCell) => (
          <DatePickerSelect
            defaultValue={new Date(value as string)}
            onChange={(date) => {
              if (date) updateCell(date.toISOString());
            }}
          />
        ),
      },
      {
        header: t("transactions.table.category"),
        accessor: "category_id",
        isEditable: false,
        width: 250,
        minWidth: 250,
        cellStyle: { padding: 0 },
        render: (value, _, updateCell) => (
          <CategorySelect
            defaultValue={value as number | null}
            onAdmin={onAdminCategories}
            onChange={(category) => {
              if (category) updateCell(category.id);
            }}
          />
        ),
      },
      {
        header: t("transactions.table.account"),
        accessor: "account_id",
        isEditable: false,
        width: 250,
        minWidth: 250,
        cellStyle: { padding: 0 },
        render: (value, _, updateCell) => (
          <AccountSelect
            defaultValue={value as number | null}
            onAdmin={onAdminAccounts}
            onChange={(account) => {
              if (account) updateCell(account.id);
            }}
          />
        ),
      },
      {
        header: t("transactions.table.type"),
        accessor: "type",
        isEditable: false,
        width: 100,
        minWidth: 100,
        cellStyle: { padding: 0 },
        render: (value, _, updateCell) => (
          <TypeSelect
            defaultValue={value as "income" | "expense"}
            onChange={(type) => {
              if (type) updateCell(type);
            }}
          />
        ),
      },
      {
        header: t("transactions.table.description"),
        accessor: "description",
        fullWidth: true,
      },
      {
        header: t("transactions.table.amount"),
        accessor: "amount",
        isAmount: true,
        width: 150,
        minWidth: 150,
        cellStyle: { fontFamily: "'Geist Mono', monospace" },
      },
      {
        header: "",
        accessor: "options" as keyof Tables<"transactions">,
        isEditable: false,
        isDraggable: false,
        width: 32,
        minWidth: 32,
        cellStyle: { padding: 0, opacity: 0.5 },
        render: (_, row) => (
          <TableRowMenu
            isDisabled={!row.enabled}
            onDelete={() => onRemoveRow(row.id)}
            onDisabled={() => onDisabledRow(row.id, row.enabled)}
            onSeeDetails={() => onSeeDetailsRow(row.id)}
          />
        ),
      },
    ],
    [
      t,
      onAdminCategories,
      onAdminAccounts,
      onRemoveRow,
      onSeeDetailsRow,
      onDisabledRow,
    ],
  );

  return (
    <VirtualDataGrid<Tables<"transactions">>
      columns={columns}
      data={internalData}
      enableColumnResize
      onDataChange={setInternalData}
      onRowChange={onRowChange}
      isLoading={isLoading}
      showRowNumber
      height={height}
      rowHeight={30}
      overscan={5}
      currency="MXN"
    />
  );
}
