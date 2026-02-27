import { DateRange, formatDate } from "@/shared";
import {
  Button,
  ButtonGroup,
  Menu,
  MenuButton,
  MenuList,
  Portal,
} from "@chakra-ui/react";
import {
  IconCalendarEventFilled,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import {
  addDays,
  addMonths,
  differenceInDays,
  endOfMonth,
  format,
  startOfMonth,
} from "date-fns";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type DateRangeValue = {
  initial_date: Date | null;
  end_date: Date | null;
};

type Props = {
  onChange?: (initialDate: string, endDate: string) => void;
};

export default function FilterDateMenu({ onChange }: Props) {
  const { t } = useTranslation();
  const [date, setDate] = useState<DateRangeValue>({
    initial_date: null,
    end_date: null,
  });

  useEffect(() => {
    dateFormat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const dateFormat = () => {
    if (!date.initial_date) return;
    if (!date.end_date) return;

    handleChange(date.initial_date, date.end_date);
  };

  const handleChange = (initialDate: Date, endDate: Date) => {
    const formattedInitialDate = format(initialDate, "yyyy-MM-dd");
    const formattedEndDate = format(endDate, "yyyy-MM-dd");

    onChange?.(formattedInitialDate, formattedEndDate);
  };

  const shiftRange = (direction: 1 | -1) => {
    if (!date.initial_date || !date.end_date) return;

    const isFullMonth =
      date.initial_date.getDate() === 1 &&
      date.initial_date.getMonth() === date.end_date.getMonth() &&
      date.initial_date.getFullYear() === date.end_date.getFullYear() &&
      date.end_date.getDate() === endOfMonth(date.end_date).getDate();

    if (isFullMonth) {
      const targetMonth = addMonths(date.initial_date, direction);
      setDate({
        initial_date: startOfMonth(targetMonth),
        end_date: endOfMonth(targetMonth),
      });
    } else {
      const days = differenceInDays(date.end_date, date.initial_date) + 1;
      const newInitial = addDays(date.initial_date, direction * days);
      const newEnd = addDays(date.end_date, direction * days);
      setDate({ initial_date: newInitial, end_date: newEnd });
    }
  };

  const hasRange = date.initial_date && date.end_date;

  const formattedDate = hasRange
    ? `${formatDate(date.initial_date!)} - ${formatDate(date.end_date!)}`
    : t("components.filterDateMenu.selectRange");

  return (
    <ButtonGroup isAttached size="sm">
      <Button
        onClick={() => shiftRange(-1)}
        isDisabled={!hasRange}
        variant="solid"
        borderLeftRadius={0}
        color="gray.500"
        px={2}
      >
        <IconChevronLeft size={16} />
      </Button>
      <Menu>
        <MenuButton
          as={Button}
          leftIcon={<IconCalendarEventFilled size={18} />}
          size="sm"
          borderRadius={0}
          variant="solid"
        >
          {formattedDate}
        </MenuButton>
        <Portal>
          <MenuList>
            <DateRange onChange={setDate} />
          </MenuList>
        </Portal>
      </Menu>
      <Button
        onClick={() => shiftRange(1)}
        isDisabled={!hasRange}
        variant="solid"
        color="gray.500"
        px={2}
      >
        <IconChevronRight size={16} />
      </Button>
    </ButtonGroup>
  );
}
