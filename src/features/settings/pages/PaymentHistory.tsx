import { TablePagination, usePagination } from "@/shared";
import { Heading, Stack } from "@chakra-ui/react";
import PaymentHistoryTable from "../components/payment-history/PaymentHistoryTable";
import usePaymentHistory from "../hooks/usePaymentHistory";
import { useStripeDownloadInvoice } from "../hooks/useStripe";

export default function PaymentHistory() {
  const { currentPage, onNext, onPrev } = usePagination();
  const { data, count, lastPage, isLoading } = usePaymentHistory(currentPage);
  const { mutate: onDownloadInvoce, pendingInvoiceIds } =
    useStripeDownloadInvoice();

  const handleDownloadInvoice = (id: string) => {
    onDownloadInvoce(
      { invoiceId: id },
      {
        onSuccess: (data) => {
          if (data.invoice_pdf) {
            window.open(data.invoice_pdf, "_blank");
          }
        },
      },
    );
  };

  return (
    <Stack>
      <Heading fontWeight={500} size="lg">
        Payment History
      </Heading>
      <PaymentHistoryTable
        data={data}
        isLoading={isLoading}
        onDownloadInvoce={handleDownloadInvoice}
        pendingInvoiceIds={pendingInvoiceIds}
      >
        <TablePagination
          total={count}
          onNext={onNext}
          onPrev={onPrev}
          currentPage={currentPage}
          lastPage={lastPage}
        />
      </PaymentHistoryTable>
    </Stack>
  );
}
