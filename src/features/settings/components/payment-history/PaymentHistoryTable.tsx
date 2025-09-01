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
            <Th>ID</Th>
            <Th>Paid at</Th>
            <Th isNumeric>Amount</Th>
            <Th>Brand</Th>
            <Th>Last4</Th>
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
                  aria-label="Download invoice"
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
