import { Tables } from "@/lib";
import { formatDate } from "@/shared";
import {
  IconButton,
  Progress,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { IconDownload } from "@tabler/icons-react";
import { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  data?: Tables<"stripe_payments">[];
  onDownloadInvoce?: (id: string) => void;
  isLoading?: boolean;
  pendingInvoiceIds: string[];
} & PropsWithChildren;

export default function PaymentHistoryTable({
  data = [],
  onDownloadInvoce,
  isLoading,
  pendingInvoiceIds = [],
  children,
}: Props) {
  const { t } = useTranslation();
  return (
    <TableContainer>
      <Table size="sm" variant="striped">
        {isLoading && (
          <TableCaption>
            <Progress size="xs" isIndeterminate />
          </TableCaption>
        )}
        <Thead>
          <Tr>
            <Th>{t("settings.paymentHistory.id")}</Th>
            <Th>{t("settings.paymentHistory.paidAt")}</Th>
            <Th isNumeric>{t("settings.paymentHistory.amount")}</Th>
            <Th>{t("settings.paymentHistory.brand")}</Th>
            <Th>{t("settings.paymentHistory.last4")}</Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {data?.map((item) => (
            <Tr key={item.id}>
              <Td>{item.stripe_invoice_id}</Td>
              <Td title={item.paid_at}>{formatDate(item.paid_at)}</Td>
              <Td isNumeric>
                {item.amount_paid} {item.currency.toUpperCase()}
              </Td>
              <Td>{item.payment_method_brand?.toUpperCase()}</Td>
              <Td>{item.payment_method_last4}</Td>
              <Td>
                <IconButton
                  variant="ghost"
                  aria-label={t("settings.paymentHistory.downloadInvoice")}
                  size="sm"
                  icon={<IconDownload size={18} />}
                  onClick={() => onDownloadInvoce?.(item.stripe_invoice_id)}
                  isLoading={pendingInvoiceIds.includes(item.stripe_invoice_id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {children}
    </TableContainer>
  );
}
