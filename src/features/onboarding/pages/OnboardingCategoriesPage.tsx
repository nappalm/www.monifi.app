import { TablesInsert } from "@/lib";
import { ButtonSpinner, useAuthenticatedUser } from "@/shared";
import {
  useBulkCreateCategories,
  useCategories,
  useDeleteCategory,
  useUpdateCategory,
} from "@/shared/hooks/useCategories";
import { Button, Container, HStack, Stack, useToast } from "@chakra-ui/react";
import {
  IconArrowNarrowRight,
  IconRowInsertBottom,
  IconStack2,
} from "@tabler/icons-react";
import { isEmpty } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import OnboardingCategoriesTable from "../components/OnboardingCategoriesTable";
import PageTitle from "../components/PageTitle";
import StepLayout from "../layout/StepLayout";
import { ONBOARDING_PATHS } from "../router";
import { getTranslatedCategories } from "../utils/constants";
import { CategoriesLocalData } from "../utils/types";

export default function OnboardingCategoriesPage() {
  const { t } = useTranslation();
  const { user } = useAuthenticatedUser();

  const navigate = useNavigate();
  const toast = useToast();
  const categories = useCategories();
  const bulkCreateMutation = useBulkCreateCategories();
  const updateCategory = useUpdateCategory();
  const removeCategory = useDeleteCategory();

  const [localCategories, updateLocalCategories] = useState<
    CategoriesLocalData[]
  >([]);

  useEffect(() => {
    if (categories.data && categories.data.length > 0) {
      updateLocalCategories(categories.data);
    }
  }, [categories.data]);

  const preloadedCategories = useMemo(() => {
    const categories = getTranslatedCategories(t);
    return Object.entries(categories).map(([_, value], index) => ({
      id: -(index + 1),
      name: value,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTranslatedCategories(t)]);

  const handlePreloadCategories = () => {
    updateLocalCategories(preloadedCategories);
  };

  const handleAddNewRow = () => {
    updateLocalCategories((prev) => {
      return [
        {
          id: -Date.now(),
          name: "",
        },
        ...prev,
      ];
    });
  };

  const handleRowChange = (updatedData: CategoriesLocalData) => {
    if (updatedData.id > 0) {
      updateCategory.mutate({
        id: updatedData.id,
        category: {
          name: updatedData.name,
        },
      });
      return;
    }

    updateLocalCategories((prev) => {
      return prev.map((item) => {
        if (item.id === updatedData.id) {
          return updatedData;
        }
        return item;
      });
    });
  };

  const handleDelete = (id: number) => {
    if (id > 0) {
      removeCategory.mutate(id);
      return;
    }

    updateLocalCategories((prev) => {
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleNext = async () => {
    if (!user?.id) return;
    const dataBulk: TablesInsert<"categories">[] = localCategories
      .filter((item) => !isEmpty(item.name) && item.id < 0)
      .map(({ name }) => ({
        user_id: user?.id,
        name,
      }));

    if (dataBulk.length > 0) {
      try {
        await bulkCreateMutation.mutateAsync(dataBulk);
      } catch {
        toast({
          variant: "toast",
          title: "Error produced",
          description: "Se ha presentado un problema intentalo mas tarde",
          position: "bottom-right",
        });
      }
    }

    navigate(ONBOARDING_PATHS.appFeatures);
  };

  const onBack = () => navigate(ONBOARDING_PATHS.accounts);

  return (
    <>
      <StepLayout activeStep={3}>
        <Container>
          <Stack gap={3}>
            <PageTitle
              title={t("onboarding.categories.title")}
              description={t("onboarding.categories.description")}
              onBack={onBack}
            />
            <HStack justifyContent="space-between">
              <Button
                size="sm"
                variant="solid"
                leftIcon={<IconStack2 size={16} />}
                onClick={handlePreloadCategories}
              >
                Preload categories
              </Button>
              <Button
                size="sm"
                variant="outline"
                colorScheme="teal"
                leftIcon={<IconRowInsertBottom size={16} />}
                onClick={handleAddNewRow}
              >
                Add new row
              </Button>
            </HStack>
            <OnboardingCategoriesTable
              isLoading={categories?.isLoading}
              data={localCategories}
              onRowChange={handleRowChange}
              onRemoveRow={handleDelete}
            />

            <Stack align="end">
              <Button
                colorScheme="cyan"
                variant="solid"
                onClick={handleNext}
                rightIcon={<IconArrowNarrowRight size={16} />}
                isLoading={bulkCreateMutation.isPending}
                spinner={<ButtonSpinner />}
                loadingText={t("common.continue") + "..."}
              >
                {t("common.continue")}
              </Button>
            </Stack>
          </Stack>
        </Container>
      </StepLayout>
    </>
  );
}
