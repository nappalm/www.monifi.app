export type PostTransactionsExtractRequest = {
  file: File;
};

export type PostTransactionsExtractResponse = {
  success: boolean;
  filename: string;
  count: number;
  data: Array<{
    date: string;
    description: string;
    type: "income" | "expense";
    amount: number;
  }>;
};
