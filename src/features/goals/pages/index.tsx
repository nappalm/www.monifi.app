import {
  Box,
  Button,
  ButtonGroup,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  IconCalendarFilled,
  IconChevronsDown,
  IconChevronsUp,
  IconCategory,
  IconDots,
  IconSwipe,
  IconToggleLeftFilled,
  IconToggleRightFilled,
  IconTrash,
} from "@tabler/icons-react";
import { memo, useMemo, useState, useCallback, useEffect } from "react";
import {
  VirtualDataGrid,
  GridMenuItem,
  useGridContext,
  type GridColumn,
} from "@/shared/components/virtual-data-grid";
import { DatePicker } from "@/shared/components/date-picker";
import { formatDate } from "@/shared/utils/formats";
// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------
interface MockTransaction {
  id: number;
  occurred_at: string;
  category_id: number | null;
  account_id: number | null;
  type: "income" | "expense";
  description: string;
  amount: number;
  enabled: boolean;
}

const MOCK_CATEGORIES = [
  { id: 1, name: "Comida" },
  { id: 2, name: "Transporte" },
  { id: 3, name: "Entretenimiento" },
  { id: 4, name: "Salud" },
  { id: 5, name: "Educación" },
  { id: 6, name: "Servicios" },
  { id: 7, name: "Ropa" },
  { id: 8, name: "Otros" },
];

const MOCK_ACCOUNTS = [
  { id: 1, name: "Efectivo", color: "#48BB78" },
  { id: 2, name: "Banco Principal", color: "#4299E1" },
  { id: 3, name: "Tarjeta Crédito", color: "#ED8936" },
  { id: 4, name: "Ahorro", color: "#9F7AEA" },
];

const DESCRIPTIONS = [
  "Supermercado", "Uber", "Netflix", "Farmacia", "Curso online",
  "Luz", "Zapatos", "Gasolina", "Cine", "Consulta médica",
  "Spotify", "Agua", "Libros", "Internet", "Restaurante",
  "Seguro auto",
];

function generateMockData(count: number): MockTransaction[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    occurred_at: new Date(
      2025,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1,
    ).toISOString(),
    category_id: MOCK_CATEGORIES[i % MOCK_CATEGORIES.length].id,
    account_id: MOCK_ACCOUNTS[i % MOCK_ACCOUNTS.length].id,
    type: (i % 3 === 0 ? "income" : "expense") as "income" | "expense",
    description: DESCRIPTIONS[i % DESCRIPTIONS.length],
    amount: Math.round((Math.random() * 5000 + 50) * 100) / 100,
    enabled: i % 7 !== 0,
  }));
}

// ---------------------------------------------------------------------------
// Inline select components (same pattern as TransactionsTable)
// ---------------------------------------------------------------------------
const MockDatePickerSelect = memo(function MockDatePickerSelect({
  defaultValue,
  onChange,
}: {
  defaultValue: Date;
  onChange?: (date: Date | null) => void;
}) {
  const [date, setDate] = useState<Date | null>(defaultValue);

  useEffect(() => {
    setDate(defaultValue);
  }, [defaultValue]);

  const handleDateChange = (newDate: Date | null) => {
    setDate(newDate);
    onChange?.(newDate);
  };

  const dateFormat = date ? formatDate(date) : "Unknown";

  return (
    <Menu isLazy>
      <MenuButton
        size="xs"
        variant="unstyled"
        as={Button}
        w="full"
        cursor="default"
        borderRadius="inherit"
        fontWeight="semibold"
        leftIcon={<IconCalendarFilled size={13} />}
        textAlign="left"
        pl={2}
        _focus={{ outline: "none", boxShadow: "none" }}
      >
        {dateFormat}
      </MenuButton>
      <Portal>
        <MenuList>
          <DatePicker
            onChange={handleDateChange}
            defaultValue={defaultValue}
            value={date}
          />
        </MenuList>
      </Portal>
    </Menu>
  );
});

const MockCategorySelect = memo(function MockCategorySelect({
  defaultValue,
  onChange,
}: {
  defaultValue: number | null;
  onChange?: (category: { id: number; name: string }) => void;
}) {
  const [selected, setSelected] = useState(defaultValue);

  useEffect(() => {
    setSelected(defaultValue);
  }, [defaultValue]);

  const current = MOCK_CATEGORIES.find((c) => c.id === selected);

  return (
    <Menu isLazy>
      <MenuButton
        size="xs"
        variant="unstyled"
        as={Button}
        w="full"
        cursor="default"
        borderRadius="inherit"
        fontWeight="semibold"
        leftIcon={<IconCategory size={13} />}
        textAlign="left"
        pl={2}
        _focus={{ outline: "none", boxShadow: "none" }}
      >
        {current?.name ?? "Sin categoría"}
      </MenuButton>
      <Portal>
        <MenuList maxH="200px" overflowY="auto">
          {MOCK_CATEGORIES.map((cat) => (
            <MenuItem
              key={cat.id}
              fontWeight={cat.id === selected ? "bold" : "normal"}
              onClick={() => {
                setSelected(cat.id);
                onChange?.(cat);
              }}
            >
              {cat.name}
            </MenuItem>
          ))}
        </MenuList>
      </Portal>
    </Menu>
  );
});

const MockAccountSelect = memo(function MockAccountSelect({
  defaultValue,
  onChange,
}: {
  defaultValue: number | null;
  onChange?: (account: { id: number; name: string }) => void;
}) {
  const [selected, setSelected] = useState(defaultValue);

  useEffect(() => {
    setSelected(defaultValue);
  }, [defaultValue]);

  const current = MOCK_ACCOUNTS.find((a) => a.id === selected);

  return (
    <Menu isLazy>
      <MenuButton
        size="xs"
        variant="unstyled"
        as={Button}
        w="full"
        cursor="default"
        borderRadius="inherit"
        fontWeight="semibold"
        leftIcon={
          <Box
            w="10px"
            h="10px"
            borderRadius="full"
            bg={current?.color ?? "gray.500"}
          />
        }
        textAlign="left"
        pl={2}
        _focus={{ outline: "none", boxShadow: "none" }}
      >
        {current?.name ?? "Sin cuenta"}
      </MenuButton>
      <Portal>
        <MenuList>
          {MOCK_ACCOUNTS.map((acc) => (
            <MenuItem
              key={acc.id}
              icon={
                <Box w="10px" h="10px" borderRadius="full" bg={acc.color} />
              }
              fontWeight={acc.id === selected ? "bold" : "normal"}
              onClick={() => {
                setSelected(acc.id);
                onChange?.(acc);
              }}
            >
              {acc.name}
            </MenuItem>
          ))}
        </MenuList>
      </Portal>
    </Menu>
  );
});

const MockTypeSelect = memo(function MockTypeSelect({
  defaultValue,
  onChange,
}: {
  defaultValue: "income" | "expense";
  onChange?: (value: "income" | "expense") => void;
}) {
  const [type, setType] = useState(defaultValue);

  useEffect(() => {
    setType(defaultValue);
  }, [defaultValue]);

  const types = [
    { value: "income" as const, label: "Ingreso", icon: <IconChevronsUp size={13} color="#48BB78" /> },
    { value: "expense" as const, label: "Gasto", icon: <IconChevronsDown size={13} color="#FC8181" /> },
  ];

  const selected = types.find((t) => t.value === type);

  return (
    <Menu isLazy>
      <MenuButton
        size="xs"
        variant="unstyled"
        as={Button}
        leftIcon={selected?.icon}
        cursor="default"
        w="full"
        borderRadius="inherit"
        fontWeight="semibold"
        textAlign="left"
        pl={2}
        _focus={{ outline: "none", boxShadow: "none" }}
      >
        {selected?.label}
      </MenuButton>
      <Portal>
        <MenuList>
          {types.map((t) => (
            <MenuItem
              key={t.value}
              icon={t.icon}
              onClick={() => {
                setType(t.value);
                onChange?.(t.value);
              }}
            >
              {t.label}
            </MenuItem>
          ))}
        </MenuList>
      </Portal>
    </Menu>
  );
});

// ---------------------------------------------------------------------------
// Row menu trigger (uses shared grid menu)
// ---------------------------------------------------------------------------
function RowMenuTrigger({
  row,
  rowIndex,
}: {
  row: MockTransaction;
  rowIndex: number;
}) {
  const { openMenu } = useGridContext<MockTransaction>();
  return (
    <IconButton
      aria-label="Row options"
      icon={<IconDots size={16} />}
      size="xs"
      variant="unstyled"
      w="full"
      pl="7px"
      onClick={(e) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        openMenu(row, rowIndex, { top: rect.bottom, left: rect.left });
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Columns (same structure as TransactionsTable)
// ---------------------------------------------------------------------------
function getColumns(): GridColumn<MockTransaction>[] {
  return [
    {
      accessor: "id",
      header: "ID",
      isVisible: false,
    },
    {
      accessor: "occurred_at",
      header: "Fecha",
      isEditable: false,
      width: 150,
      minWidth: 130,
      cellStyle: { padding: 0 },
      render: (value, _, updateCell) => (
        <MockDatePickerSelect
          defaultValue={new Date(value as string)}
          onChange={(date) => {
            if (date) updateCell(date.toISOString());
          }}
        />
      ),
    },
    {
      accessor: "category_id",
      header: "Categoría",
      isEditable: false,
      width: 160,
      minWidth: 150,
      cellStyle: { padding: 0 },
      render: (value, _, updateCell) => (
        <MockCategorySelect
          defaultValue={value as number | null}
          onChange={(cat) => updateCell(cat.id)}
        />
      ),
    },
    {
      accessor: "account_id",
      header: "Cuenta",
      isEditable: false,
      width: 160,
      minWidth: 150,
      cellStyle: { padding: 0 },
      render: (value, _, updateCell) => (
        <MockAccountSelect
          defaultValue={value as number | null}
          onChange={(acc) => updateCell(acc.id)}
        />
      ),
    },
    {
      accessor: "type",
      header: "Tipo",
      isEditable: false,
      width: 120,
      minWidth: 100,
      cellStyle: { padding: 0 },
      render: (value, _, updateCell) => (
        <MockTypeSelect
          defaultValue={value as "income" | "expense"}
          onChange={(type) => updateCell(type)}
        />
      ),
    },
    {
      accessor: "description",
      header: "Descripción",
      width: 200,
      minWidth: 150,
      maxWidth: 400,
      isResizable: true,
    },
    {
      accessor: "amount",
      header: "Monto",
      isAmount: true,
      width: 140,
      minWidth: 120,
      isDraggable: true,
      isResizable: true,
      cellStyle: { fontFamily: "'Geist Mono', monospace" },
    },
    {
      accessor: "options" as any,
      header: "",
      isEditable: false,
      isDraggable: false,
      width: 40,
      cellStyle: { padding: 0, opacity: 0.5 },
      render: (_value, row, _onChange, rowIndex) => (
        <RowMenuTrigger
          row={row as MockTransaction}
          rowIndex={rowIndex}
        />
      ),
    },
  ];
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
type Scenario = "full" | "empty" | "loading" | "large" | "minimal";

export default function Goals() {
  const [scenario, setScenario] = useState<Scenario>("full");
  const [data, setData] = useState<MockTransaction[]>(() =>
    generateMockData(30),
  );

  const columns = useMemo(() => getColumns(), []);

  const handleScenarioChange = (next: Scenario) => {
    setScenario(next);
    switch (next) {
      case "large":
        setData(generateMockData(2000));
        break;
      case "full":
        setData(generateMockData(30));
        break;
      case "minimal":
        setData(generateMockData(3));
        break;
      case "empty":
        setData([]);
        break;
    }
  };

  const isLoading = scenario === "loading";

  const handleDelete = useCallback((row: MockTransaction) => {
    setData((prev) => prev.filter((r) => r.id !== row.id));
  }, []);

  const handleToggle = useCallback((row: MockTransaction) => {
    setData((prev) =>
      prev.map((r) =>
        r.id === row.id ? { ...r, enabled: !r.enabled } : r,
      ),
    );
  }, []);

  return (
    <VStack spacing={4} align="stretch" p={4} h="100%">
      <Heading size="md">VirtualDataGrid v2 — Demo</Heading>

      <HStack spacing={2} flexWrap="wrap">
        <Text fontSize="sm" fontWeight={600} mr={2}>
          Escenario:
        </Text>
        <ButtonGroup size="xs" isAttached variant="outline">
          {(
            [
              ["full", "30 filas"],
              ["empty", "Vacío"],
              ["loading", "Loading"],
              ["large", "2000 filas"],
              ["minimal", "3 filas"],
            ] as [Scenario, string][]
          ).map(([key, label]) => (
            <Button
              key={key}
              onClick={() => handleScenarioChange(key)}
              colorScheme={scenario === key ? "cyan" : "gray"}
              variant={scenario === key ? "solid" : "outline"}
            >
              {label}
            </Button>
          ))}
        </ButtonGroup>
      </HStack>

      <Box flex={1} minH={0}>
        <VirtualDataGrid<MockTransaction>
          columns={columns}
          data={data}
          onDataChange={setData}
          onRowChange={(row, rowIndex) => {
            console.log("Row changed:", rowIndex, row);
          }}
          onCellChange={(change) => {
            console.log("Cell changed:", change);
          }}
          isLoading={isLoading}
          showRowNumber
          height="calc(100vh - 200px)"
          rowHeight={36}
          overscan={5}
          enableColumnResize
          enableFilter={scenario !== "loading"}
          enableSelection
          currency="MXN"
          renderMenu={(row, _rowIndex, closeMenu) => (
            <>
              <GridMenuItem
                onClick={() => {
                  console.log("Details:", row);
                  closeMenu();
                }}
              >
                <HStack spacing={2}>
                  <IconSwipe size={16} />
                  <Text>Ver detalles</Text>
                </HStack>
              </GridMenuItem>
              <GridMenuItem
                onClick={() => {
                  handleToggle(row);
                  closeMenu();
                }}
              >
                <HStack spacing={2}>
                  {row.enabled ? (
                    <IconToggleLeftFilled size={16} />
                  ) : (
                    <IconToggleRightFilled size={16} />
                  )}
                  <Text>{row.enabled ? "Deshabilitar" : "Habilitar"}</Text>
                </HStack>
              </GridMenuItem>
              <Box borderTop="1px solid" borderColor="gray.600" my={1} />
              <GridMenuItem
                isDanger
                onClick={() => {
                  handleDelete(row);
                  closeMenu();
                }}
              >
                <HStack spacing={2}>
                  <IconTrash size={16} />
                  <Text>Eliminar</Text>
                </HStack>
              </GridMenuItem>
            </>
          )}
        />
      </Box>
    </VStack>
  );
}
