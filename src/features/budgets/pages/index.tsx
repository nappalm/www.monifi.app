import { useGlobalUI } from "@/lib";
import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/supabase/database.types";
import {
  useAuthenticatedUser,
  useUpdateCategory,
} from "@/shared";
import {
  Button,
  Grid,
  HStack,
  Stack,
  Tag,
  TagLabel,
  TagLeftIcon,
  useDisclosure,
} from "@chakra-ui/react";
import { IconBucket, IconPlus } from "@tabler/icons-react";
import { isEmpty } from "lodash";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import BudgetSelector from "../components/BudgetSelector";
import BudgetsTable from "../components/BudgetsTable";
import EmptyBudgets from "../components/EmptyBudgets";
import NewBudgetModal from "../components/NewBudgetModal";
import RightPanel from "../components/RightPanel";
import {
  useBudgetCategories,
  useBulkUpsertBudgetCategories,
  useCreateBudgetCategory,
  useDeleteBudgetCategory,
  useUpdateBudgetCategory,
} from "../hooks/useBudgetCategories";
import {
  useBudgets,
  useCreateBudget,
  useDeleteBudget,
  useUpdateBudget,
} from "../hooks/useBudgets";
import { useTransactions } from "../../transactions/hooks/useTransactions";
import PageLoading from "../components/PageLoading";

type BudgetCategoryRow = {
  id: number;
  category_id: number;
  category_name: string;
  amount: number;
  description?: string;
};

export default function BudgetsPage() {
  const { t } = useTranslation();
  const { user } = useAuthenticatedUser();
  const { alert } = useGlobalUI();

  const [activeBudgetId, setActiveBudgetId] = useState<number | null>(null);
  const [selectedBudget, setSelectedBudget] =
    useState<Tables<"budgets"> | null>(null);

  const now = new Date();
  const [period, setPeriod] = useState({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  });

  const dateRange = useMemo((): [string, string] => {
    const { year, month } = period;
    const pad = (n: number) => String(n).padStart(2, "0");
    const lastDay = new Date(year, month, 0).getDate();
    return [`${year}-${pad(month)}-01`, `${year}-${pad(month)}-${lastDay}`];
  }, [period]);

  const transactions = useTransactions(dateRange);

  const spentAmount = useMemo(
    () =>
      (transactions.data ?? [])
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions.data],
  );

  const spentByCategory = useMemo(() => {
    const map: Record<number, number> = {};
    (transactions.data ?? [])
      .filter((t) => t.type === "expense" && t.category_id != null)
      .forEach((t) => {
        map[t.category_id!] = (map[t.category_id!] ?? 0) + t.amount;
      });
    return map;
  }, [transactions.data]);

  const handlePrevPeriod = () =>
    setPeriod((p) =>
      p.month === 1
        ? { year: p.year - 1, month: 12 }
        : { ...p, month: p.month - 1 },
    );

  const handleNextPeriod = () =>
    setPeriod((p) =>
      p.month === 12
        ? { year: p.year + 1, month: 1 }
        : { ...p, month: p.month + 1 },
    );

  const queryClient = useQueryClient();
  const budgets = useBudgets();
  const bcat = useBudgetCategories(activeBudgetId ?? undefined);
  const bulkUpsertCategories = useBulkUpsertBudgetCategories();
  const createBudgetCategory = useCreateBudgetCategory();
  const updateBudgetCategory = useUpdateBudgetCategory();
  const updateCategory = useUpdateCategory();
  const deleteBudgetCategory = useDeleteBudgetCategory();
  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget();
  const deleteBudget = useDeleteBudget();
  const newBudgetModal = useDisclosure();

  useEffect(() => {
    if (budgets.data && budgets.data.length > 0 && !activeBudgetId) {
      const first = budgets.data.find((b) => typeof b.id === "number");
      if (first) setActiveBudgetId(first.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budgets.data]);

  const activeBudget =
    budgets.data?.find((b) => b.id === activeBudgetId) ?? null;

  const [data, setData] = useState<BudgetCategoryRow[]>([]);

  useEffect(() => {
    if (bcat.data && bcat.data.length > 0) {
      setData(
        bcat.data
          .filter((bc) => bc.categories != null)
          .map((bc) => ({
            id: bc.id,
            category_id: bc.categories!.id,
            category_name: bc.categories!.name,
            amount: bc.amount,
            description: bc.description ?? undefined,
          })),
      );
    }
  }, [bcat.data, activeBudgetId]);

  const handleAddCategory = () => {
    if (!activeBudgetId || !user) return;
    createBudgetCategory.mutate({ budgetId: activeBudgetId, userId: user.id });
  };

  const handleRemoveCategory = (id: number) => {
    alert.onOpen({
      title: t("budgets.table.removeCategory.title"),
      description: t("budgets.table.removeCategory.description"),
      isLoading: () => deleteBudgetCategory.isPending,
      onOk: () => {
        deleteBudgetCategory.mutate(id, {
          onSuccess: () =>
            setData((prev) => prev.filter((r) => r.id !== id)),
        });
      },
    });
  };

  const handleRowChange = (
    updatedData: BudgetCategoryRow,
    rowIndex: number,
    colIndex: number,
  ) => {
    setData((prevData) =>
      prevData.map((row, index) => (index === rowIndex ? updatedData : row)),
    );

    if (colIndex === 0) {
      updateCategory.mutate({
        id: updatedData.category_id,
        category: { name: updatedData.category_name },
      });
      queryClient.setQueryData(
        ["budget_categories", activeBudgetId],
        (old: typeof bcat.data) =>
          old?.map((bc) =>
            bc.categories?.id === updatedData.category_id
              ? { ...bc, categories: { ...bc.categories, name: updatedData.category_name } }
              : bc,
          ),
      );
      return;
    }

    if (bcat.data && bcat.data.length > 0) {
      updateBudgetCategory.mutate({
        id: updatedData.id,
        amount: updatedData.amount,
        description: updatedData.description,
      });
    }
  };

  const handleOpenEdit = (budget: Tables<"budgets">) => {
    setSelectedBudget(budget);
    newBudgetModal.onOpen();
  };

  const handleClose = () => {
    setSelectedBudget(null);
    newBudgetModal.onClose();
  };

  const handleCreate = (values: Omit<TablesInsert<"budgets">, "user_id">) => {
    if (!user) return;
    createBudget.mutate(
      { ...values, user_id: user.id },
      {
        onSuccess: (newBudget) => {
          if (data.length > 0) {
            bulkUpsertCategories.mutate(
              data.map(({ category_id, amount }) => ({
                budget_id: newBudget.id,
                category_id,
                amount,
                user_id: user.id,
              })),
            );
          }
          handleClose();
        },
      },
    );
  };

  const handleUpdate = (values: Omit<TablesUpdate<"budgets">, "user_id">) => {
    if (!selectedBudget) return;
    updateBudget.mutate(
      { id: selectedBudget.id, ...values },
      { onSuccess: handleClose },
    );
  };

  const handleDelete = () => {
    if (!selectedBudget) return;
    const deletedId = selectedBudget.id;
    deleteBudget.mutate(deletedId, {
      onSuccess: () => {
        if (activeBudgetId === deletedId) {
          const remaining = (budgets.data ?? []).filter(
            (b) => b.id !== deletedId,
          );
          setActiveBudgetId(remaining[0]?.id ?? null);
        }
        handleClose();
      },
    });
  };

  const budgetDefaultValues = selectedBudget
    ? {
        name: selectedBudget.name,
        amount: selectedBudget.amount,
      }
    : undefined;

  if (budgets.isPending || bcat.isPending) return <PageLoading />;
  return (
    <Stack h="100%" spacing={3}>
      <NewBudgetModal
        {...newBudgetModal}
        onClose={handleClose}
        defaultValues={budgetDefaultValues}
        isLoading={createBudget.isPending || updateBudget.isPending}
        isLoadingDelete={deleteBudget.isPending}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
      <HStack p={2} pb={0} justify="space-between">
        <HStack>
          {!isEmpty(budgets?.data) && (
            <BudgetSelector
              data={budgets.data ?? []}
              selected={activeBudget}
              onSelect={(b) => setActiveBudgetId(b.id)}
              onEdit={handleOpenEdit}
              onNew={newBudgetModal.onOpen}
            />
          )}
          <Button
            size="sm"
            leftIcon={<IconPlus size={16} />}
            variant="ghost"
            isDisabled={!activeBudgetId}
            isLoading={createBudgetCategory.isPending}
            onClick={handleAddCategory}
          >
            {t("budgets.table.addCategory")}
          </Button>
        </HStack>
      </HStack>
      {isEmpty(budgets?.data) && <EmptyBudgets onNew={newBudgetModal.onOpen} />}
      {!isEmpty(budgets?.data) && (
        <Grid templateColumns="1fr 300px" gap={5}>
          <BudgetsTable
            data={data}
            isLoading={bcat.isLoading}
            onRowChange={handleRowChange}
            onRemoveRow={handleRemoveCategory}
            height="calc(100vh - 55px)"
            spentByCategory={spentByCategory}
          />
          <RightPanel
            categories={data}
            budgetAmount={activeBudget?.amount ?? 0}
            spentAmount={spentAmount}
            period={period}
            onPrevPeriod={handlePrevPeriod}
            onNextPeriod={handleNextPeriod}
          />
        </Grid>
      )}
    </Stack>
  );
}
