import { FormProvider, RHFInput, RHFSelect } from "@/shared";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Stack,
  UseDisclosureProps,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

type Props = UseDisclosureProps;
export default function BudgetForm({ isOpen = false, onClose }: Props) {
  const methods = useForm();

  return (
    <Drawer isOpen={isOpen} onClose={() => onClose?.()} size="sm">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>Budget</DrawerHeader>
        <DrawerCloseButton />
        <DrawerBody>
          <FormProvider methods={methods}>
            <Stack>
              <RHFInput name="name" label="Budget name" />
              <RHFSelect name="repeat" label="Plan for" isRequired>
                <option value="empty">Any dates</option>
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
                <option value="custom">Custom dates</option>
              </RHFSelect>
            </Stack>
          </FormProvider>
        </DrawerBody>
        <DrawerFooter>
          <Button w="full" colorScheme="green" color="#000">
            Done
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
