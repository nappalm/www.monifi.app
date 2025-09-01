import { LicensingFeatureType } from "@/shared";
import { ListIcon } from "@chakra-ui/react";
import { IconCheck, IconInfinity, IconX } from "@tabler/icons-react";
import { ElementType } from "react";

type Props = {
  type: LicensingFeatureType;
  color: string;
};

const iconMap: Partial<Record<LicensingFeatureType, ElementType>> = {
  unlimited: IconInfinity,
  check: IconCheck,
};

export default function LicensingFeatureIcon({ type, color }: Props) {
  const IconComponent = iconMap[type] ?? IconX;

  return <ListIcon as={IconComponent} color={color} />;
}
