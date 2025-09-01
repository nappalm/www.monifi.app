/* eslint-disable @typescript-eslint/no-explicit-any */
// form
import type { UseFormReturn } from "react-hook-form";
import { FormProvider as Form } from "react-hook-form";

// ----------------------------------------------------------------------

type Props = {
  id?: string;
  children: React.ReactNode;
  methods: UseFormReturn<any>;
  onSubmit?: VoidFunction;
};

export default function FormProvider({
  id = "form",
  children,
  onSubmit,
  methods,
}: Props) {
  return (
    <Form {...methods}>
      <form id={id} onSubmit={onSubmit}>
        {children}
      </form>
    </Form>
  );
}
