import {
  Box,
  Divider,
  Flex,
  Select,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconChevronDown } from "@tabler/icons-react";
import { getDaysInMonth } from "date-fns";
import { Controller, useFormContext } from "react-hook-form";
import RHFError from "./RHFError";

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

type Props = {
  label?: string;
  dayName: string;
  monthName: string;
};

export default function RHFDayMonth({ label, dayName, monthName }: Props) {
  const { control, watch } = useFormContext();
  const selectedMonth = watch(monthName);

  const bg = useColorModeValue("gray.100", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.800");

  const daysCount = selectedMonth
    ? getDaysInMonth(new Date(2024, Number(selectedMonth) - 1))
    : 31;

  const days = Array.from({ length: daysCount }, (_, i) => i + 1);

  return (
    <Stack w="full" spacing={1}>
      {label && (
        <Text
          as="label"
          fontSize="sm"
          color="gray.500"
          fontFamily="Geist Mono"
          textTransform="uppercase"
          px="1"
        >
          {label}
        </Text>
      )}
      <Box
        border="1px solid"
        borderColor={borderColor}
        bg={bg}
        borderRadius="lg"
        overflow="hidden"
      >
        <Flex>
          <Controller
            name={dayName}
            control={control}
            render={({ field }) => (
              <Select
                height="48px"
                placeholder="Día"
                icon={<IconChevronDown size={18} />}
                variant="unstyled"
                px={4}
                flex={1}
                {...field}
              >
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
            )}
          />
          <Divider orientation="vertical" h="48px" borderColor={borderColor} />
          <Controller
            name={monthName}
            control={control}
            render={({ field }) => (
              <Select
                height="48px"
                placeholder="Mes"
                icon={<IconChevronDown size={18} />}
                variant="unstyled"
                px={4}
                flex={1}
                {...field}
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>
                    {m}
                  </option>
                ))}
              </Select>
            )}
          />
        </Flex>
      </Box>
      <Controller
        name={dayName}
        control={control}
        render={({ fieldState: { error } }) => (
          <RHFError error={error?.message} />
        )}
      />
      <Controller
        name={monthName}
        control={control}
        render={({ fieldState: { error } }) => (
          <RHFError error={error?.message} />
        )}
      />
    </Stack>
  );
}
