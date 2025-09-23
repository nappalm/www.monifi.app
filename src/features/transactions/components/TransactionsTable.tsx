import { Tables } from "@/lib/supabase/database.types";
import {
  AccountSelect,
  CategorySelect,
  Column,
  InlineEditorGrid,
} from "@/shared";
import DatePickerSelect from "./DatePickerSelect";
import TableRowMenu from "./TableRowMenu";
import TypeSelect from "./TypeSelect";

type Props = {
  data: Tables<"transactions">[];
  isLoading: boolean;
  onRowChange: (updatedData: Tables<"transactions">, rowIndex: number) => void;
  onRemoveRow: (id: number) => void;
  onSeeDetailsRow: (id: number) => void;
  onDisabledRow: (id: number, previous: boolean) => void;
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
      isEditable: false,
      sx: {
        w: "130px",
        minW: "130px",
        p: 0,
      },
      render: (value, _, updateCell) => {
        return (
          <DatePickerSelect
            defaultValue={new Date(value as string)}
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
      isEditable: false,
      sx: {
        w: "150px",
        minW: "150px",
        p: 0,
      },
      render: (value, _, updateCell) => {
        return (
          <CategorySelect
            defaultValue={value as number | null}
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
      isEditable: false,
      sx: {
        w: "150px",
        minW: "150px",
        p: 0,
      },
      render: (value, _, updateCell) => {
        return (
          <AccountSelect
            defaultValue={value as number | null}
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
      isEditable: false,
      sx: {
        w: "100px",
        minW: "100px",
        p: 0,
      },
      render: (value, _, updateCell) => {
        return (
          <TypeSelect
            defaultValue={value as "income" | "expense"}
            onChange={(type) => {
              if (type) {
                updateCell(type);
              }
            }}
          />
        );
      },
    },
    {
      header: "Description",
      accessor: "description",
      sx: {
        maxW: "200px",
      },
    },
    {
      header: "Amount",
      accessor: "amount",
      isAmount: true,
      sx: {
        w: "120px",
        minW: "120px",
      },
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
          isDisabled={!row.enabled}
          onDelete={() => onRemoveRow(row.id)}
          onDisabled={() => onDisabledRow(row.id, row.enabled)}
          onSeeDetails={() => onSeeDetailsRow(row.id)}
        />
      ),
    },
  ];

  return (
    <InlineEditorGrid<Tables<"transactions">>
      columns={columns}
      data={data}
      isLoading={isLoading}
      onRowChange={onRowChange}
      showRowNumber
    />
  );
}
