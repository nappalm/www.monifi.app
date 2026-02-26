import { Tables } from "@/lib/supabase/database.types";
import { useGlobalUI } from "@/lib/global-ui";
import { AccountSelect, CategorySelect } from "@/shared";
import {
  VirtualDataGrid,
  type GridColumn,
} from "@/shared/components/virtual-data-grid";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  focusRowIndex?: number | null;
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
  focusRowIndex,
}: Props) {
  const { t } = useTranslation();
  const { alert: globalAlert } = useGlobalUI();

  // Internal data state — syncs with prop (React Query) and allows
  // immediate UI updates before the backend round-trip completes.
  const [internalData, setInternalData] = useState(data);
  useEffect(() => {
    setInternalData(data);
  }, [data]);

  // Ref so cascade handler always reads latest data without being a dep of columns useMemo.
  const internalDataRef = useRef(internalData);
  useEffect(() => {
    internalDataRef.current = internalData;
  }, [internalData]);

  // When a category is assigned, update the current row and — if other rows share
  // the same description without a category — ask the user whether to apply it there too.
  const handleCategoryChangeCascade = useCallback(
    (
      changedRow: Tables<"transactions">,
      categoryId: number,
      updateCell: (value: number) => void,
    ) => {
      updateCell(categoryId);

      const description = changedRow.description;
      if (!description) return;

      const currentData = internalDataRef.current;
      const cascadeRows = currentData.filter(
        (r) =>
          r.id !== changedRow.id &&
          r.description === description &&
          r.category_id === null,
      );

      if (cascadeRows.length === 0) return;

      globalAlert.onOpen({
        title: t("transactions.table.cascadeCategory.title"),
        description: t("transactions.table.cascadeCategory.description", {
          count: cascadeRows.length,
          description,
        }),
        colorScheme: "cyan",
        onOk: () => {
          const cascadeIds = new Set(cascadeRows.map((r) => r.id));
          setInternalData((prev) =>
            prev.map((r) =>
              cascadeIds.has(r.id) ? { ...r, category_id: categoryId } : r,
            ),
          );
          cascadeRows.forEach((r) => {
            const rowIndex = currentData.findIndex((d) => d.id === r.id);
            onRowChange({ ...r, category_id: categoryId }, rowIndex);
          });
        },
      });
    },
    [globalAlert, t, setInternalData, onRowChange],
  );

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
        render: (value, row, updateCell) => (
          <CategorySelect
            defaultValue={value as number | null}
            onAdmin={onAdminCategories}
            onChange={(category) => {
              if (category)
                handleCategoryChangeCascade(row, category.id, updateCell);
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
      handleCategoryChangeCascade,
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
      focusRowIndex={focusRowIndex}
    />
  );
}
