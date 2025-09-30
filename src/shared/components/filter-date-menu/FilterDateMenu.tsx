import { DateRange, formatDate } from "@/shared";
import { Button, Menu, MenuButton, MenuList, Portal } from "@chakra-ui/react";
import { IconCalendarFilled } from "@tabler/icons-react";
import { format } from "date-fns";
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

  const formattedDate =
    date.initial_date && date.end_date
      ? `${formatDate(date.initial_date)} - ${formatDate(date.end_date)}`
      : t("components.filterDateMenu.selectRange");

  return (
    <Menu>
      <MenuButton
        as={Button}
        leftIcon={<IconCalendarFilled size={18} />}
        size="sm"
        borderLeftRadius={0}
      >
        {formattedDate}
      </MenuButton>
      <Portal>
        <MenuList>
          <DateRange onChange={setDate} />
        </MenuList>
      </Portal>
    </Menu>
  );
}
