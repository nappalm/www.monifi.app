import { InlineEditorGrid } from "@/shared";
import { IconChevronsDown, IconChevronsUp } from "@tabler/icons-react";
import TableRowMenu from "./TableRowMenu";
import _colors from "@/lib/chakra-ui/_colors";

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
        opacity: 0.8,
      },
      render: (value: any) => value,
    },
    {
      header: "",
      accessor: "icon",
      sx: {
        w: "10px",
        opacity: 0.8,
      },
      render: (value: any) =>
        value === "down" ? (
          <IconChevronsDown size={16} color={_colors.red[500]} />
        ) : (
          <IconChevronsUp size={16} color={_colors.green[500]} />
        ),
    },
    { header: "Date", accessor: "date" },
    { header: "Category", accessor: "category" },
    { header: "Account", accessor: "account" },
    { header: "Type", accessor: "type" },
    { header: "Notes", accessor: "notes" },
    { header: "Amount", accessor: "amount" },
    {
      header: "",
      accessor: "options",
      sx: {
        w: "10px",
        opacity: 0.8,
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
