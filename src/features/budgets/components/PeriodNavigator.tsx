import { Tables } from "@/lib/supabase/database.types";
import { HStack, IconButton, Text } from "@chakra-ui/react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import {
  canGoNext,
  getBudgetPeriodType,
  getNextPeriod,
  getPeriodLabel,
  getPreviousPeriod,
  SelectedPeriod,
} from "../utils/period";

type Props = {
  budget: Tables<"budgets">;
  period: SelectedPeriod;
  onChange: (period: SelectedPeriod) => void;
};

export default function PeriodNavigator({ budget, period, onChange }: Props) {
  if (getBudgetPeriodType(budget) === "onetime") {
    return (
      <Text fontSize="sm" color="gray.500">
        {getPeriodLabel(budget, period)}
      </Text>
    );
  }

  return (
    <HStack gap={0}>
      <IconButton
        aria-label="Periodo anterior"
        icon={<IconChevronLeft size={14} />}
        size="xs"
        variant="ghost"
        onClick={() => onChange(getPreviousPeriod(budget, period))}
      />
      <Text fontSize="sm" fontWeight="medium" minW="120px" textAlign="center">
        {getPeriodLabel(budget, period)}
      </Text>
      <IconButton
        aria-label="Periodo siguiente"
        icon={<IconChevronRight size={14} />}
        size="xs"
        variant="ghost"
        isDisabled={!canGoNext(budget, period)}
        onClick={() => onChange(getNextPeriod(budget, period))}
      />
    </HStack>
  );
}
