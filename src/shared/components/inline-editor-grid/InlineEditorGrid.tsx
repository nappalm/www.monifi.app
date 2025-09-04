import {
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { useInlineEditor } from "./useInlineEditor";

interface Column {
  header: string;
  accessor: string;
  render?: (value: any, row: any) => React.ReactNode;
  isEditable?: boolean;
}

interface InlineEditorGridProps {
  columns: Column[];
  data: any[];
  onDataChange: (newData: any[]) => void;
}

export function InlineEditorGrid({
  columns,
  data,
  onDataChange,
}: InlineEditorGridProps) {
  const { tableRef, activeCell, getCellProps, getInputProps } = useInlineEditor(
    { columns, data: data, onDataChange: onDataChange },
  );

  const inputProps = getInputProps();

  const rowFocusBorderColor = useColorModeValue("red.500", "red.300");
  const cellEditStyle = {
    opacity: 1,
    transform: "scale(1)",
    border: "1px solid",
    borderColor: "green.500",
    background: "rgba(107,198,124,0.15)",
    borderRadius: "md",
  };

  const inputBg = useColorModeValue("white", "gray.700");

  return (
    <TableContainer
      border="1px solid"
      borderColor="gray.800"
      borderRadius="xl"
      pos="relative"
      overflow="auto"
      tabIndex={0} // Make the container focusable
      ref={tableRef}
      onFocus={(e) => {
        // If the focus event originated from the container itself, not a child cell
        if (e.target === tableRef.current) {
          // Focus the active cell (which defaults to 0,0 or the last active cell)
          tableRef.current
            ?.querySelector<HTMLElement>(
              `[data-row="${activeCell?.row || 0}"][data-col="${activeCell?.col || 0}"]`,
            )
            ?.focus();
        }
      }}
    >
      <Input
        {...inputProps}
        size="sm"
        variant="unstyled"
        bg={inputBg}
        fontSize="sm"
        px="3"
        sx={{
          ...inputProps.style,
          ...cellEditStyle,
          boxSizing: "border-box",
          _focus: {
            outline: "none",
          },
        }}
      />
      <Table variant="striped" size="sm">
        <Thead>
          <Tr>
            {columns.map((column) => (
              <Th
                key={column.accessor}
                isNumeric={column.accessor === "amount"}
              >
                {column.header}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row, rowIndex) => {
            const isRowActive = activeCell?.row === rowIndex;
            return (
              <Tr
                key={rowIndex} // Use rowIndex as key for the row
                sx={{
                  ...(isRowActive && {
                    "& > td": {
                      boxShadow: `inset 0 0 0 1px ${rowFocusBorderColor}`,
                    },
                  }),
                }}
              >
                {columns.map((column, colIndex) => {
                  const cellValue = row[column.accessor]; // Get value using accessor
                  const isNumericColumn = column.accessor === "amount"; // Check if column is numeric

                  return (
                    <Td
                      key={column.accessor} // Use accessor as key for the cell
                      {...getCellProps(rowIndex, colIndex)}
                      isNumeric={isNumericColumn} // Pass isNumeric based on column
                      sx={{
                        outline: "none",
                        cursor: "cell",
                        position: "relative",
                        fontFamily: "Roboto Mono",

                        "&::after": {
                          content: '""',
                          position: "absolute",
                          inset: 0,
                          borderRadius: "md",
                          border: "1px solid",
                          borderColor: "green.500",
                          background: "rgba(107,198,124,0.15)", // overlay semitransparente
                          zIndex: 1,
                          pointerEvents: "none",

                          opacity: 0,
                          transform: "scale(0.95)",
                          boxShadow: "0 0 0px rgba(107,198,124,0.5)", // glow inicial
                          transition:
                            "opacity 0.25s ease, transform 0.25s ease, box-shadow 0.4s ease",
                        },

                        "&:hover::after": {
                          opacity: 1,
                          transform: "scale(1)",
                          boxShadow: "0 0 15px 3px rgba(107,198,124,0.7)", // glow intenso
                        },

                        "&[tabindex='0']:focus::after": {
                          opacity: 1,
                          transform: "scale(1)",
                          boxShadow: "0 0 15px 3px rgba(107,198,124,0.7)", // glow intenso
                        },

                        "> *": {
                          position: "relative",
                          zIndex: 2,
                        },

                        visibility:
                          inputProps.shouldShowInput &&
                          activeCell?.row === rowIndex &&
                          activeCell?.col === colIndex
                            ? "hidden"
                            : "visible",
                        ...column.sx,
                      }}
                    >
                      {column.render
                        ? column.render(cellValue, row)
                        : cellValue}{" "}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
