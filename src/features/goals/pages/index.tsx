import {
  Box,
  Button,
  ButtonGroup,
  Heading,
  HStack,
  IconButton,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { IconDots } from "@tabler/icons-react";
import { useMemo, useState, useCallback } from "react";
import {
  VirtualDataGrid,
  GridMenuItem,
  useGridContext,
  type GridColumn,
} from "@/shared/components/virtual-data-grid";

// --- Mock data types ---
interface MockRow {
  id: number;
  name: string;
  category: string;
  status: "active" | "paused" | "completed";
  amount: number;
  progress: number;
  createdAt: string;
  enabled: boolean;
}

// --- Mock data generators ---
const CATEGORIES = ["Ahorro", "Inversión", "Viaje", "Educación", "Emergencia", "Retiro", "Tecnología", "Salud"];
const STATUSES: MockRow["status"][] = ["active", "paused", "completed"];
const NAMES = [
  "Fondo de emergencia", "Vacaciones Europa", "MacBook Pro", "Curso React",
  "Inversión ETF", "Retiro anticipado", "Auto nuevo", "Remodelación casa",
  "Boda", "Maestría online", "Gimnasio anual", "Seguro de vida",
  "Fondo universitario", "Viaje Japón", "Startup capital", "Deuda tarjeta",
];

function generateMockData(count: number): MockRow[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: NAMES[i % NAMES.length] + (i >= NAMES.length ? ` #${Math.floor(i / NAMES.length) + 1}` : ""),
    category: CATEGORIES[i % CATEGORIES.length],
    status: STATUSES[i % STATUSES.length],
    amount: Math.round((Math.random() * 50000 + 500) * 100) / 100,
    progress: Math.round(Math.random() * 100),
    createdAt: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split("T")[0],
    enabled: i % 7 !== 0,
  }));
}

// --- Menu trigger (uses grid context, renders only an IconButton) ---
function MenuTrigger({ row, rowIndex }: { row: MockRow; rowIndex: number }) {
  const { openMenu } = useGridContext<MockRow>();
  return (
    <IconButton
      aria-label="Row menu"
      icon={<IconDots size={16} />}
      size="xs"
      variant="ghost"
      onClick={(e) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        openMenu(row, rowIndex, { top: rect.bottom, left: rect.left });
      }}
    />
  );
}

// --- Scenario type ---
type Scenario = "full" | "empty" | "loading" | "large" | "minimal";

// --- Columns definition ---
function getColumns(): GridColumn<MockRow>[] {
  return [
    {
      accessor: "id",
      header: "ID",
      isEditable: false,
      isDraggable: false,
      width: 60,
      align: "right",
    },
    {
      accessor: "name",
      header: "Nombre",
      width: 220,
      minWidth: 150,
      maxWidth: 400,
      isResizable: true,
    },
    {
      accessor: "category",
      header: "Categoría",
      width: 140,
      isResizable: true,
      render: (value) => (
        <Tag size="sm" colorScheme="purple" variant="subtle">
          {value as string}
        </Tag>
      ),
      isEditable: false,
    },
    {
      accessor: "status",
      header: "Estado",
      width: 120,
      isEditable: false,
      render: (value) => {
        const colorMap = { active: "green", paused: "yellow", completed: "blue" };
        const labelMap = { active: "Activo", paused: "Pausado", completed: "Completado" };
        const s = value as MockRow["status"];
        return (
          <Tag size="sm" colorScheme={colorMap[s]} variant="solid">
            {labelMap[s]}
          </Tag>
        );
      },
    },
    {
      accessor: "amount",
      header: "Monto",
      isAmount: true,
      width: 140,
      isDraggable: true,
      isResizable: true,
    },
    {
      accessor: "progress",
      header: "Progreso",
      width: 120,
      align: "right",
      render: (value) => {
        const p = value as number;
        const color = p >= 75 ? "green.400" : p >= 40 ? "yellow.400" : "red.400";
        return (
          <HStack spacing={2} justify="flex-end" w="100%">
            <Box w="50px" h="6px" bg="gray.600" borderRadius="full" overflow="hidden">
              <Box h="100%" w={`${p}%`} bg={color} borderRadius="full" />
            </Box>
            <Text fontSize="xs" fontFamily="'Geist Mono', monospace" minW="32px" textAlign="right">
              {p}%
            </Text>
          </HStack>
        );
      },
      isEditable: false,
    },
    {
      accessor: "createdAt",
      header: "Fecha",
      width: 120,
      isEditable: false,
    },
    {
      accessor: "options" as any,
      header: "",
      width: 50,
      isEditable: false,
      isDraggable: false,
      render: (_value, row, _onChange, rowIndex) => (
        <MenuTrigger row={row as MockRow} rowIndex={rowIndex} />
      ),
    },
  ];
}

export default function Goals() {
  const [scenario, setScenario] = useState<Scenario>("full");
  const [data, setData] = useState<MockRow[]>(() => generateMockData(30));

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
      // "loading" keeps current data
    }
  };

  const isLoading = scenario === "loading";

  const handleDelete = useCallback(
    (row: MockRow) => {
      setData((prev) => prev.filter((r) => r.id !== row.id));
    },
    [],
  );

  const handleToggle = useCallback(
    (row: MockRow) => {
      setData((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, enabled: !r.enabled } : r)),
      );
    },
    [],
  );

  return (
    <VStack spacing={4} align="stretch" p={4} h="100%">
      <Heading size="md">VirtualDataGrid v2 — Demo</Heading>

      <HStack spacing={2} flexWrap="wrap">
        <Text fontSize="sm" fontWeight={600} mr={2}>Escenario:</Text>
        <ButtonGroup size="xs" isAttached variant="outline">
          {([
            ["full", "30 filas"],
            ["empty", "Vacío"],
            ["loading", "Loading"],
            ["large", "2000 filas"],
            ["minimal", "3 filas"],
          ] as [Scenario, string][]).map(([key, label]) => (
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
        <VirtualDataGrid<MockRow>
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
                  console.log("Edit:", row);
                  closeMenu();
                }}
              >
                Editar
              </GridMenuItem>
              <GridMenuItem
                onClick={() => {
                  handleToggle(row);
                  closeMenu();
                }}
              >
                {row.enabled ? "Deshabilitar" : "Habilitar"}
              </GridMenuItem>
              <GridMenuItem
                isDanger
                onClick={() => {
                  handleDelete(row);
                  closeMenu();
                }}
              >
                Eliminar
              </GridMenuItem>
            </>
          )}
        />
      </Box>
    </VStack>
  );
}
