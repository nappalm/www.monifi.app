import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Radio,
  RadioGroup,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";
import {
  addMonths,
  addYears,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
  subMonths,
  subYears,
} from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type DateRangeValue = {
  initial_date: Date | null;
  end_date: Date | null;
};

type SelectionMode = "range" | "month";

export type DateRangeProps = {
  value?: DateRangeValue;
  defaultValue?: DateRangeValue;
  onChange?: (value: DateRangeValue) => void;
};

const MotionGrid = motion(Grid);

export function DateRange({
  value,
  defaultValue = { initial_date: null, end_date: null },
  onChange,
}: DateRangeProps) {
  const { t } = useTranslation();

  const WEEK_DAYS = [
    t("components.dateRange.weekDays.sun"),
    t("components.dateRange.weekDays.mon"),
    t("components.dateRange.weekDays.tue"),
    t("components.dateRange.weekDays.wed"),
    t("components.dateRange.weekDays.thu"),
    t("components.dateRange.weekDays.fri"),
    t("components.dateRange.weekDays.sat"),
  ];
  const [currentDate, setCurrentDate] = useState(
    defaultValue.initial_date || new Date(),
  );
  const [selection, setSelection] = useState<DateRangeValue>(() => {
    if (defaultValue.initial_date || defaultValue.end_date) {
      return defaultValue;
    }
    const today = new Date();
    return {
      initial_date: startOfMonth(today),
      end_date: endOfMonth(today),
    };
  });
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("month");

  useEffect(() => {
    if (
      !defaultValue.initial_date &&
      !defaultValue.end_date &&
      selection.initial_date &&
      selection.end_date
    ) {
      onChange?.(selection);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (value) {
      setSelection(value);
    }
  }, [value]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate]);

  const handleSelectionModeChange = (newMode: SelectionMode) => {
    setSelectionMode(newMode);
    if (newMode === "month") {
      const newSelection = {
        initial_date: startOfMonth(currentDate),
        end_date: endOfMonth(currentDate),
      };
      setSelection(newSelection);
      onChange?.(newSelection);
    }
  };

  const handleCurrentDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
    if (selectionMode === "month") {
      const newSelection = {
        initial_date: startOfMonth(newDate),
        end_date: endOfMonth(newDate),
      };
      setSelection(newSelection);
      onChange?.(newSelection);
    }
  };

  const handleDateClick = (day: Date) => {
    if (selectionMode === "month") {
      const newSelection = {
        initial_date: startOfMonth(day),
        end_date: endOfMonth(day),
      };
      setSelection(newSelection);
      onChange?.(newSelection);
      return;
    }

    const { initial_date, end_date } = selection;

    if (!initial_date || (initial_date && end_date)) {
      const newSelection = { initial_date: day, end_date: null };
      setSelection(newSelection);
      onChange?.(newSelection);
    } else if (initial_date && !end_date) {
      let newSelection: DateRangeValue;
      if (day < initial_date) {
        newSelection = { initial_date: day, end_date: initial_date };
      } else {
        newSelection = { ...selection, end_date: day };
      }
      setSelection(newSelection);
      onChange?.(newSelection);
    }
  };

  const rangeBg = useColorModeValue("cyan.100", "cyan.700");

  const getDayStyle = (day: Date) => {
    const { initial_date, end_date } = selection;
    const isInitial = initial_date && isSameDay(day, initial_date);
    const isEnd = end_date && isSameDay(day, end_date);
    const isInRange =
      initial_date &&
      end_date &&
      isWithinInterval(day, { start: initial_date, end: end_date });
    const isSingleDayRange = isInitial && isEnd;

    const gridItemStyle: any = {
      opacity: isSameMonth(day, currentDate) ? 1 : 0.4,
      bg: "transparent",
    };
    const buttonStyle: any = {
      color: "inherit",
      bg: "transparent",
      borderRadius: "lg",
      transition: "all 0.15s ease-in-out",
      _hover: { bg: "cyan.400", color: "white" },
    };

    if (isSingleDayRange) {
      buttonStyle.bg = "cyan.500";
      buttonStyle.color = "white";
    } else if (isInitial) {
      buttonStyle.bg = "cyan.500";
      buttonStyle.color = "white";
    } else if (isEnd) {
      buttonStyle.bg = "cyan.500";
      buttonStyle.color = "white";
    } else if (isInRange) {
      gridItemStyle.bg = rangeBg;
      gridItemStyle.borderRadius = "lg";
      buttonStyle.color = "inherit";
    }

    const isToday = isSameDay(day, new Date());
    if (isToday && !isInRange && !isInitial && !isEnd) {
      buttonStyle.border = "1px solid";
      buttonStyle.borderColor = "cyan.500";
      buttonStyle.color = "cyan.500";
    }

    return { gridItemStyle, buttonStyle };
  };

  return (
    <VStack spacing={3} align="stretch">
      <Box p={3}>
        <HStack justifyContent="space-between" mb={3}>
          <HStack spacing={1}>
            <IconButton
              aria-label={t("components.dateRange.previousYear")}
              icon={<IconChevronsLeft size={16} />}
              size="xs"
              variant="ghost"
              onClick={() => handleCurrentDateChange(subYears(currentDate, 1))}
            />
            <IconButton
              aria-label={t("components.dateRange.previousMonth")}
              icon={<IconChevronLeft size={16} />}
              size="xs"
              variant="ghost"
              onClick={() => handleCurrentDateChange(subMonths(currentDate, 1))}
            />
          </HStack>

          <Text fontSize="md" textTransform="capitalize" letterSpacing="wide">
            {format(currentDate, "MMM yyyy")}
          </Text>

          <HStack spacing={1}>
            <IconButton
              aria-label={t("components.dateRange.nextMonth")}
              icon={<IconChevronRight size={16} />}
              size="xs"
              variant="ghost"
              onClick={() => handleCurrentDateChange(addMonths(currentDate, 1))}
            />
            <IconButton
              aria-label={t("components.dateRange.nextYear")}
              icon={<IconChevronsRight size={16} />}
              size="xs"
              variant="ghost"
              onClick={() => handleCurrentDateChange(addYears(currentDate, 1))}
            />
          </HStack>
        </HStack>

        <HStack justify="center" mb={3}>
          <RadioGroup
            onChange={(val) => handleSelectionModeChange(val as SelectionMode)}
            value={selectionMode}
            colorScheme="gray"
          >
            <HStack spacing={4}>
              <Radio size="sm" value="range">
                {t("components.dateRange.range")}
              </Radio>
              <Radio size="sm" value="month">
                {t("components.dateRange.month")}
              </Radio>
            </HStack>
          </RadioGroup>
        </HStack>

        <AnimatePresence mode="wait">
          <MotionGrid
            key={format(currentDate, "yyyy-MM")}
            templateColumns="repeat(7, 1fr)"
            gap={1}
            justifyItems="center"
            textAlign="center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {WEEK_DAYS.map((day) => (
              <GridItem key={day} w="25px" h="25px">
                <Text fontSize="10px" fontWeight="bold" color="gray.500">
                  {day}
                </Text>
              </GridItem>
            ))}
            {calendarDays.map((day) => {
              const { gridItemStyle, buttonStyle } = getDayStyle(day);
              return (
                <GridItem
                  key={day.toString()}
                  w="25px"
                  h="25px"
                  {...gridItemStyle}
                >
                  <Button
                    w="full"
                    onClick={() => handleDateClick(day)}
                    variant="unstyled"
                    size="xs"
                    {...buttonStyle}
                  >
                    {format(day, "d")}
                  </Button>
                </GridItem>
              );
            })}
          </MotionGrid>
        </AnimatePresence>
      </Box>
    </VStack>
  );
}
