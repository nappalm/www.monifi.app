import { AccountSelect, CategorySelect, InlineEditorGrid } from "@/shared";
import TableRowMenu from "./TableRowMenu";
import TypeSelect from "./TypeSelect";

type Props = {
  data: any[];
  onDataChange: (data: any) => void;
};

export default function TransactionsTable({ data, onDataChange }: Props) {
  const columns = [
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
    { header: "Date", accessor: "date" },
    {
      header: "Category",
      accessor: "category",
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
      sx: {
        padding: 0,
      },
      render: () => {
        return <TypeSelect />;
      },
    },
    { header: "Notes", accessor: "notes" },
    { header: "Amount", accessor: "amount" },
    {
      header: "",
      accessor: "options",
      sx: {
        w: "10px",
        opacity: 0.7,
      },
      render: () => <TableRowMenu />,
    },
  ];

  return (
    <InlineEditorGrid
      columns={columns}
      data={data}
      onDataChange={onDataChange}
    />
  );
}
