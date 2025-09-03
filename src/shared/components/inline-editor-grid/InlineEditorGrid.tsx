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

const initialData = [
  ["Jun 13, 2025", "Plans", "BBVA credit card", "Expense", "", "2590.99"],
  ["Jun 14, 2025", "Food", "Cash", "Expense", "Lunch", "50.00"],
  ["Jun 15, 2025", "Salary", "Bank Account", "Income", "", "5000.00"],
];

const headers = ["Date", "Category", "Account", "Type", "Notes", "Amount"];

export function InlineEditorGrid() {
  const { tableRef, data, activeCell, isEditing, getCellProps, getInputProps } =
    useInlineEditor({ initialData });

  const inputProps = getInputProps();
  const isNumeric = (col: number) => col === 5;

  const focusBorderColor = useColorModeValue("blue.500", "blue.300");
  const rowFocusBorderColor = useColorModeValue("red.500", "red.300");
  const cellFocusBg = useColorModeValue("red.100", "red.900");
  const cellEditStyle = {
    opacity: 1,
    transform: "scale(1)",
    border: "1px solid",
    borderColor: "green.500",
    background: "rgba(107,198,124,0.15)",
    borderRadius: "md", // Assuming "md" is a valid Chakra borderRadius value
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
            {headers.map((header, i) => (
              <Th key={header} isNumeric={isNumeric(i)}>
                {header}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row, rowIndex) => {
            const isRowActive = activeCell?.row === rowIndex;
            return (
              <Tr
                key={rowIndex}
                sx={{
                  ...(isRowActive && {
                    "& > td": {
                      boxShadow: `inset 0 0 0 1px ${rowFocusBorderColor}`,
                    },
                  }),
                }}
              >
                {row.map((cell, colIndex) => (
                  <Td
                    key={colIndex}
                    {...getCellProps(rowIndex, colIndex)}
                    isNumeric={isNumeric(colIndex)}
                    sx={{
                      outline: "none",
                      cursor: "cell",
                      position: "relative",
                      overflow: "hidden",

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
                        isEditing &&
                        activeCell?.row === rowIndex &&
                        activeCell?.col === colIndex
                          ? "hidden"
                          : "visible",
                    }}
                  >
                    {cell}
                  </Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
