import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Text,
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
  startOfMonth,
  startOfWeek,
  subMonths,
  subYears,
} from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export type DatePickerProps = {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (value: Date) => void;
};

const MotionGrid = motion(Grid);

export function DatePicker({
  value,
  defaultValue = null,
  onChange,
}: DatePickerProps) {
  const { t } = useTranslation();

  const WEEK_DAYS = [
    t("components.datePicker.weekDays.sun"),
    t("components.datePicker.weekDays.mon"),
    t("components.datePicker.weekDays.tue"),
    t("components.datePicker.weekDays.wed"),
    t("components.datePicker.weekDays.thu"),
    t("components.datePicker.weekDays.fri"),
    t("components.datePicker.weekDays.sat"),
  ];
  const [currentDate, setCurrentDate] = useState(defaultValue || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(defaultValue);

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
    }
  }, [value]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate]);

  const handleCurrentDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    if (onChange) {
      onChange(day);
    }
  };

  const getDayStyle = (day: Date) => {
    const isSelected = selectedDate && isSameDay(day, selectedDate);

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

    if (isSelected) {
      buttonStyle.bg = "cyan.500";
      buttonStyle.color = "white";
    }

    const isToday = isSameDay(day, new Date());
    if (isToday && !isSelected) {
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
              aria-label={t("components.datePicker.previousYear")}
              icon={<IconChevronsLeft size={16} />}
              size="xs"
              variant="ghost"
              onClick={() => handleCurrentDateChange(subYears(currentDate, 1))}
            />
            <IconButton
              aria-label={t("components.datePicker.previousMonth")}
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
              aria-label={t("components.datePicker.nextMonth")}
              icon={<IconChevronRight size={16} />}
              size="xs"
              variant="ghost"
              onClick={() => handleCurrentDateChange(addMonths(currentDate, 1))}
            />
            <IconButton
              aria-label={t("components.datePicker.nextYear")}
              icon={<IconChevronsRight size={16} />}
              size="xs"
              variant="ghost"
              onClick={() => handleCurrentDateChange(addYears(currentDate, 1))}
            />
          </HStack>
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
                <Text fontSize="11px" fontWeight="bold" color="gray.500">
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
                    onClick={() => handleDateClick(day)}
                    variant="unstyled"
                    {...buttonStyle}
                    size="xs"
                    w="full"
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
