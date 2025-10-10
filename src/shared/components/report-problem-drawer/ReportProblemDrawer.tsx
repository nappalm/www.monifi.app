import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  UseDisclosureProps,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import ReportProblemForm from "./ReportProblemForm";
import ReportProblemList from "./ReportProblemList";

type ReportProblemDrawerProps = UseDisclosureProps;

export default function ReportProblemDrawer({
  isOpen = false,
  onClose,
}: ReportProblemDrawerProps) {
  const { t } = useTranslation();

  return (
    <Drawer isOpen={isOpen} onClose={() => onClose?.()} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{t("components.reportProblem.title")}</DrawerHeader>

        <DrawerBody>
          <ReportProblemForm />
        </DrawerBody>
        <DrawerFooter>
          <ReportProblemList />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
