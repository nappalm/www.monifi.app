import { DatePicker, formatDate } from "@/shared";
import { Button, Menu, MenuButton, MenuList, Portal } from "@chakra-ui/react";
import { IconCalendar } from "@tabler/icons-react";
import { isValid } from "date-fns";
import { useState } from "react";

type Props = {
  defaultValue: Date;
  value: Date;
};

export default function DatePickerSelect({ defaultValue, value }: Props) {
  const [date, setDate] = useState<Date | null>(value);

  const dateFormat = isValid(date) ? formatDate(date as Date) : "Unkwnow";

  return (
    <Menu isLazy>
      <MenuButton
        size="xs"
        variant="unstyled"
        as={Button}
        w="full"
        borderRadius="inherit"
        fontWeight="semibold"
        leftIcon={<IconCalendar size={15} />}
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
            onChange={setDate}
            defaultValue={defaultValue}
            value={value}
          />
        </MenuList>
      </Portal>
    </Menu>
  );
}
