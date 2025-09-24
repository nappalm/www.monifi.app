import { DatePicker, formatDate } from "@/shared";
import { Button, Menu, MenuButton, MenuList, Portal } from "@chakra-ui/react";
import { IconCalendarFilled } from "@tabler/icons-react";
import { isValid } from "date-fns";
import { useEffect, useState } from "react";

type Props = {
  defaultValue: Date;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
};

export default function DatePickerSelect({
  defaultValue,
  value,
  onChange,
}: Props) {
  const [date, setDate] = useState<Date | null>(
    value !== undefined ? value : defaultValue,
  );

  useEffect(() => {
    if (value !== undefined) {
      setDate(value);
    }
  }, [value]);

  const handleDateChange = (newDate: Date | null) => {
    setDate(newDate);
    onChange?.(newDate);
  };

  const dateFormat = isValid(date) ? formatDate(date as Date) : "Unknown";

  return (
    <Menu isLazy>
      <MenuButton
        size="xs"
        variant="unstyled"
        as={Button}
        w="full"
        borderRadius="inherit"
        fontWeight="semibold"
        leftIcon={<IconCalendarFilled size={13} />}
        textAlign="left"
        pl={2}
        _focus={{
          outline: "none",
          boxShadow: "none",
        }}
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
}
