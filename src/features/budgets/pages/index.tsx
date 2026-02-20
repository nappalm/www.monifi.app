import { useGlobalUI } from "@/lib";
import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/supabase/database.types";
import {
  useAuthenticatedUser,
  useCategories,
  useCreateCategory,
  useDeleteCategory,
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
  useUpdateBudgetCategory,
} from "../hooks/useBudgetCategories";
import {
  useBudgets,
  useCreateBudget,
  useDeleteBudget,
  useUpdateBudget,
} from "../hooks/useBudgets";
import { useTransactions } from "../../transactions/hooks/useTransactions";

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

  const handlePrevPeriod = () =>
    setPeriod((p) =>
      p.month === 1 ? { year: p.year - 1, month: 12 } : { ...p, month: p.month - 1 },
    );

  const handleNextPeriod = () =>
    setPeriod((p) =>
      p.month === 12 ? { year: p.year + 1, month: 1 } : { ...p, month: p.month + 1 },
    );

  const categories = useCategories();
  const createCategory = useCreateCategory();
  const budgets = useBudgets();
  const bcat = useBudgetCategories(activeBudgetId ?? undefined);
  const bulkUpsertCategories = useBulkUpsertBudgetCategories();
  const createBudgetCategory = useCreateBudgetCategory();
  const updateBudgetCategory = useUpdateBudgetCategory();
  const updateCategory = useUpdateCategory();
  const removeCategory = useDeleteCategory();
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
          .filter((bc) => categories.data?.some((c) => c.id === bc.category_id))
          .map((bc) => ({
            id: bc.id,
            category_id: bc.category_id,
            category_name:
              categories.data?.find((c) => c.id === bc.category_id)?.name ?? "",
            amount: bc.amount,
            description: bc.description ?? undefined,
          })),
      );
    } else if (categories.data && categories.data.length > 0) {
      setData(
        categories.data.map((category, index) => ({
          id: index + 1,
          category_id: category.id,
          category_name: category.name,
          amount: 0,
        })),
      );
    }
  }, [bcat.data, categories.data, activeBudgetId]);

  const handleAddCategory = () => {
    if (!user || !activeBudgetId) return;
    createCategory.mutate(
      { name: "My category", user_id: user.id },
      {
        onSuccess: (newCategory) => {
          createBudgetCategory.mutate({
            budget_id: activeBudgetId,
            category_id: newCategory.id,
            amount: 0,
            user_id: user.id,
          });
          setData((prev) => [
            ...prev,
            {
              id: newCategory.id,
              category_id: newCategory.id,
              category_name: newCategory.name,
              amount: 0,
            },
          ]);
        },
      },
    );
  };

  const handleRemoveCategory = (id: number) => {
    alert.onOpen({
      title: t("budgets.table.removeCategory.title"),
      description: t("budgets.table.removeCategory.description"),
      isLoading: () => removeCategory.isPending,
      onOk: () => {
        removeCategory.mutate(id, {
          onSuccess: () =>
            setData((prev) => prev.filter((r) => r.category_id !== id)),
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
        <Tag>
          <TagLeftIcon fontSize={14}>
            <IconBucket />
          </TagLeftIcon>
          <TagLabel>{t("budgets.title")}</TagLabel>
        </Tag>

        <HStack>
          <Button
            size="sm"
            leftIcon={<IconPlus size={16} />}
            variant="ghost"
            isDisabled={!activeBudgetId}
            isLoading={createCategory.isPending}
            onClick={handleAddCategory}
          >
            {t("budgets.table.addCategory")}
          </Button>
          {!isEmpty(budgets?.data) && (
            <BudgetSelector
              data={budgets.data ?? []}
              selected={activeBudget}
              onSelect={(b) => setActiveBudgetId(b.id)}
              onEdit={handleOpenEdit}
              onNew={newBudgetModal.onOpen}
            />
          )}
        </HStack>
      </HStack>
      {isEmpty(budgets?.data) && <EmptyBudgets onNew={newBudgetModal.onOpen} />}
      {!isEmpty(budgets?.data) && (
        <Grid templateColumns="1fr 300px" gap={5}>
          <BudgetsTable
            data={data}
            isLoading={categories.isLoading || bcat.isLoading}
            onRowChange={handleRowChange}
            onRemoveRow={handleRemoveCategory}
            height="calc(100vh - 55px)"
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
