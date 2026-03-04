import { LicensingFeatureType } from "@/shared";
import { ListIcon } from "@chakra-ui/react";
import { Check, PiCircle, Cancel } from "pixelarticons/react";
import { ElementType } from "react";

type Props = {
  type: LicensingFeatureType;
  color: string;
};

const iconMap: Partial<Record<LicensingFeatureType, ElementType>> = {
  unlimited: PiCircle,
  check: Check,
};

export default function LicensingFeatureIcon({ type, color }: Props) {
  const IconComponent = iconMap[type] ?? Cancel;

  return <ListIcon as={IconComponent} color={color} />;
}
