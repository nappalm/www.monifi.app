import { HStack, IconButton, Stack, Text } from "@chakra-ui/react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

type Props = {
  period: { year: number; month: number };
  onPrev: () => void;
  onNext: () => void;
};

export default function PeriodNavigation({ period, onPrev, onNext }: Props) {
  const label = new Date(period.year, period.month - 1).toLocaleString(
    "default",
    { month: "short", year: "numeric" },
  );

  return (
    <Stack gap={0}>
      <Text fontSize="sm" color="gray.500" textAlign="center" mb={-1}>
        Period
      </Text>
      <HStack>
        <IconButton
          aria-label="Prev period"
          size="xs"
          variant="ghost"
          icon={<IconChevronLeft size={15} />}
          onClick={onPrev}
        />
        <Text>{label}</Text>
        <IconButton
          aria-label="Next period"
          size="xs"
          variant="ghost"
          icon={<IconChevronRight size={15} />}
          onClick={onNext}
        />
      </HStack>
    </Stack>
  );
}
