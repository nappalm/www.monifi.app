import { Tables } from "@/lib";

export type CommmonFormProps = {
  onSubmit?: () => void;
  onSkip?: () => void;
  onNext?: () => void;
  onBack?: () => void;
  isLoading?: boolean;
};

export type BaseQuestionsFormValues = {
  priority: string;
  finance_management: string;
};

export type OnboardingBaseFormValues = {
  currency: string;
  language: string;
};

export type OnboardingAccountFormData = {
  name: string;
  color?: string | null | undefined;
};

export type OnboardingCategoryFormData = {
  name: string;
};

export type CategoriesLocalData = Pick<Tables<"categories">, "name" | "id">;
