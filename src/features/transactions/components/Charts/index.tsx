import MonthlyBarChart from "./MonthlyBarChart";

interface ChartsProps {
  dateRange?: [string, string] | null;
}

export default function Charts({ dateRange }: ChartsProps) {
  return <MonthlyBarChart dateRange={dateRange} />;
}
