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
  data: any[];
  onDataChange: (data: any) => void;
  onRemoveRow?: () => void;
};

export default function TransactionsTable({
  data,
  onDataChange,
  onRemoveRow,
}: Props) {
  const columns: Column[] = [
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
      render: (value: any) => value,
    },
    {
      header: "Date",
      accessor: "date",
      isEditable: false,
      sx: {
        p: 0,
      },
      render: () => {
        return (
          <DatePickerSelect defaultValue={new Date()} value={new Date()} />
        );
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
    {
      header: "Account",
      accessor: "account",
      isEditable: false,
      sx: {
        padding: 0,
      },
      render: () => {
        return <AccountSelect />;
      },
    },
    {
      header: "Type",
      accessor: "type",
      isEditable: false,
      sx: {
        padding: 0,
      },
      render: () => {
        return <TypeSelect />;
      },
    },
    { header: "Notes", accessor: "notes" },
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
        <TableRowMenu onDelete={() => console.log({ row })} />
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
