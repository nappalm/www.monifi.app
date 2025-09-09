import { FormProvider, RHFInput } from "@/shared";
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
import { yupResolver } from "@hookform/resolvers/yup";
import { budgetSchema } from "../utils/yup";
import { OnSubmitBudget } from "../utils/types";

type Props = UseDisclosureProps & {
  onSubmit: (values: OnSubmitBudget) => void;
};
export default function BudgetForm({
  isOpen = false,
  onClose,
  onSubmit,
}: Props) {
  const methods = useForm<OnSubmitBudget>({
    resolver: yupResolver(budgetSchema),
  });

  const handleSubmit = (values: OnSubmitBudget) => {
    onSubmit(values);
  };

  return (
    <Drawer isOpen={isOpen} onClose={() => onClose?.()} size="xs">
      <FormProvider
        methods={methods}
        onSubmit={methods.handleSubmit(handleSubmit)}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Budget</DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody>
            <Stack>
              <RHFInput name="name" label="Budget name" isRequired autoFocus />
            </Stack>
          </DrawerBody>
          <DrawerFooter>
            <Button w="full" colorScheme="cyan" type="submit">
              Done
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </FormProvider>
    </Drawer>
  );
}
