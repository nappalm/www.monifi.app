import {
  Button,
  HStack,
  Progress,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { PaymentMethod } from "@stripe/stripe-js";
import { IconCreditCardFilled } from "@tabler/icons-react";
import { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  data?: PaymentMethod[] | null;
  isLoading?: boolean;
  onRemove: (id: string) => void;
  deletingIds: string[];
} & PropsWithChildren;

export default function PaymentMethodsTable({
  data = [],
  isLoading,
  children,
  onRemove,
  deletingIds = [],
}: Props) {
  const { t } = useTranslation();
  return (
    <TableContainer>
      <Table size="sm">
        {isLoading && (
          <TableCaption>
            <Progress size="xs" isIndeterminate />
          </TableCaption>
        )}
        <Thead>
          <Tr>
            <Th>{t("settings.paymentInformation.brand")}</Th>
            <Th>{t("settings.paymentInformation.last4")}</Th>
            <Th>{t("settings.paymentInformation.expires")}</Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {data?.map((item) => (
            <Tr key={item.id}>
              <Td>
                <HStack>
                  <IconCreditCardFilled size={18} />
                  <Text>{item.card?.brand?.toUpperCase()}</Text>
                </HStack>
              </Td>
              <Td>{item.card?.last4}</Td>
              <Td>
                {item.card?.exp_month}/{item.card?.exp_year}
              </Td>
              <Td isNumeric>
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  onClick={() => onRemove(item.id)}
                  isLoading={deletingIds.includes(item.id)}
                >
                  {t("settings.paymentInformation.remove")}
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {children}
    </TableContainer>
  );
}
