import {
  AccountSelect,
  CategorySelect,
  Column,
  InlineEditorGrid,
} from "@/shared";
import { Tables } from "@/lib/supabase/database.types";
import DatePickerSelect from "./DatePickerSelect";
import TableRowMenu from "./TableRowMenu";
import TypeSelect from "./TypeSelect";

type Props = {
  data: Tables<"transactions">[];
  isLoading: boolean;
  onRowChange: (
    updatedData: Partial<Tables<"transactions">>,
    rowIndex: number,
  ) => void;
  onRemoveRow: (id: number) => void;
  onSeeDetailsRow: (id: number) => void;
  onDisabledRow: (id: number) => void;
};

export default function TransactionsTable({
  data,
  isLoading,
  onRowChange,
  onRemoveRow,
  onSeeDetailsRow,
  onDisabledRow,
}: Props) {
  const columns: Column<Tables<"transactions">>[] = [
    {
      accessor: "id",
      header: "ID",
      isVisible: false,
    },
    {
      header: "Date",
      accessor: "occurred_at",
      isEditable: true,
      sx: {
        p: 0,
      },
      render: (value, row, updateCell) => {
        return (
          <DatePickerSelect
            defaultValue={new Date(value)}
            // value={new Date(value)}
            onChange={(date) => {
              if (date) {
                updateCell(date.toISOString());
              }
            }}
          />
        );
      },
    },
    {
      header: "Category",
      accessor: "category_id",
      isEditable: true,
      sx: {
        padding: 0,
      },
      render: (value, row, updateCell) => {
        return (
          <CategorySelect
            defaultValue={value}
            onChange={(category) => {
              if (category) {
                updateCell(category.id);
              }
            }}
          />
        );
      },
    },
    {
      header: "Account",
      accessor: "account_id",
      isEditable: true,
      sx: {
        padding: 0,
      },
      render: (value, row, updateCell) => {
        return (
          <AccountSelect
            defaultValue={value}
            onChange={(account) => {
              if (account) {
                updateCell(account.id);
              }
            }}
          />
        );
      },
    },
    {
      header: "Type",
      accessor: "type",
      isEditable: true,
      sx: {
        padding: 0,
      },
      render: (value, row, updateCell) => {
        return (
          <TypeSelect
            defaultValue={value}
            onChange={(type) => {
              if (type) {
                updateCell(type);
              }
            }}
          />
        );
      },
    },
    { header: "Description", accessor: "description" },
    { header: "Amount", accessor: "amount", isAmount: true },
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
          onSeeDetails={() => onSeeDetailsRow(row.id)}
        />
      ),
    },
  ];

  return (
    <InlineEditorGrid
      columns={columns}
      data={data}
      isLoading={isLoading}
      onRowChange={onRowChange}
    />
  );
}
