import { Tables } from "@/lib/supabase/database.types";

export type SelectedPeriod = {
  year: number;
  month?: number; // solo para presupuestos recurrentes (mensuales)
};

export type BudgetPeriodType = "recurrent" | "yearly" | "onetime";

export function getBudgetPeriodType(budget: Tables<"budgets">): BudgetPeriodType {
  if (budget.recurrent) return "recurrent";
  if (budget.specific_year) return "onetime";
  return "yearly";
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getPeriodDateRange(
  budget: Tables<"budgets">,
  period: SelectedPeriod,
): [string, string] | null {
  const type = getBudgetPeriodType(budget);

  if (type === "recurrent") {
    const startDay = budget.start_day ?? 1;
    const month = period.month ?? 1;
    const start = new Date(period.year, month - 1, startDay);
    // El periodo termina el día anterior al inicio del siguiente
    const nextPeriodStart = new Date(period.year, month, startDay);
    const end = new Date(nextPeriodStart.getTime() - 86_400_000);
    return [formatDate(start), formatDate(end)];
  }

  if (type === "yearly") {
    if (
      !budget.start_month ||
      !budget.start_day ||
      !budget.end_month ||
      !budget.end_day
    )
      return null;
    const start = new Date(period.year, budget.start_month - 1, budget.start_day);
    const end = new Date(period.year, budget.end_month - 1, budget.end_day);
    return [formatDate(start), formatDate(end)];
  }

  // onetime: el año está fijo en specific_year
  if (
    !budget.specific_year ||
    !budget.start_month ||
    !budget.start_day ||
    !budget.end_month ||
    !budget.end_day
  )
    return null;
  const year = parseInt(budget.specific_year);
  const start = new Date(year, budget.start_month - 1, budget.start_day);
  const end = new Date(year, budget.end_month - 1, budget.end_day);
  return [formatDate(start), formatDate(end)];
}

export function getCurrentPeriod(budget: Tables<"budgets">): SelectedPeriod {
  const now = new Date();
  const type = getBudgetPeriodType(budget);

  if (type === "recurrent") {
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  }

  if (type === "onetime") {
    return { year: parseInt(budget.specific_year ?? String(now.getFullYear())) };
  }

  return { year: now.getFullYear() };
}

export function getPreviousPeriod(
  budget: Tables<"budgets">,
  period: SelectedPeriod,
): SelectedPeriod {
  if (getBudgetPeriodType(budget) === "recurrent") {
    const month = period.month ?? 1;
    if (month === 1) return { year: period.year - 1, month: 12 };
    return { year: period.year, month: month - 1 };
  }
  return { year: period.year - 1 };
}

export function getNextPeriod(
  budget: Tables<"budgets">,
  period: SelectedPeriod,
): SelectedPeriod {
  if (getBudgetPeriodType(budget) === "recurrent") {
    const month = period.month ?? 1;
    if (month === 12) return { year: period.year + 1, month: 1 };
    return { year: period.year, month: month + 1 };
  }
  return { year: period.year + 1 };
}

/** Devuelve true si aún se puede avanzar al siguiente periodo (no es futuro). */
export function canGoNext(
  budget: Tables<"budgets">,
  period: SelectedPeriod,
): boolean {
  const now = new Date();
  const currentYear = now.getFullYear();

  if (getBudgetPeriodType(budget) === "recurrent") {
    const currentMonth = now.getMonth() + 1;
    if (period.year < currentYear) return true;
    return period.year === currentYear && (period.month ?? 1) < currentMonth;
  }

  return period.year < currentYear;
}

export function getPeriodLabel(
  budget: Tables<"budgets">,
  period: SelectedPeriod,
  locale = "es",
): string {
  if (getBudgetPeriodType(budget) === "recurrent") {
    const date = new Date(period.year, (period.month ?? 1) - 1, 1);
    const label = date.toLocaleDateString(locale, {
      month: "long",
      year: "numeric",
    });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }
  return String(period.year);
}
