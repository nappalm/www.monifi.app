import { formatDate } from "@/shared";
import { useReports } from "@/shared/hooks/useReports";
import {
  Badge,
  Box,
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
import { useTranslation } from "react-i18next";
import { ReportStatus } from "./types";

const statusColors: Record<ReportStatus, string> = {
  pending: "yellow",
  resolved: "green",
};

export default function ReportProblemList() {
  const { t } = useTranslation();
  const { data: reports, isLoading, isError, error } = useReports();

  const statusLabels: Record<ReportStatus, string> = {
    pending: t("components.reportProblem.list.statusPending"),
    resolved: t("components.reportProblem.list.statusResolved"),
  };

  if (isError) {
    return (
      <Box p={4}>
        <Text color="red.500">
          {t("components.reportProblem.list.loadError")}: {error?.message}
        </Text>
      </Box>
    );
  }

  if (!isLoading && (!reports || reports.length === 0)) {
    return (
      <Box p={4}>
        <Text color="gray.500" fontSize="sm">
          {t("components.reportProblem.list.noReports")}
        </Text>
      </Box>
    );
  }

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
            <Th>{t("components.reportProblem.list.problem")}</Th>
            <Th>{t("components.reportProblem.list.status")}</Th>
            <Th>{t("components.reportProblem.list.date")}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {reports?.map((report) => (
            <Tr key={report.id}>
              <Td maxW="250px">
                <Text noOfLines={2} fontSize="sm" title={report.problem}>
                  {report.problem}
                </Text>
              </Td>
              <Td>
                <Badge colorScheme={statusColors[report.status]}>
                  {statusLabels[report.status]}
                </Badge>
              </Td>
              <Td>
                <Text fontSize="xs" color="gray.600">
                  {formatDate(report.created_at)}
                </Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
