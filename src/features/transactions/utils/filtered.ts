import { Tables } from "@/lib/supabase/database.types";
import { filter } from "lodash";
import { TransactionFilters } from "../hooks/useTransactionFilters";

export const filterTransactions = (
  transactions: Tables<"transactions">[],
  filters: Partial<TransactionFilters>,
) => {
  return filter(transactions, (transaction) => {
    const { categories, accounts, types } = filters;

    // Comprueba si la categoría de la transacción coincide con alguna de las categorías seleccionadas.
    // Si no se seleccionan categorías, esta comprobación se dará por superada.
    const isCategoryMatch =
      !categories?.length ||
      (transaction.category_id != null &&
        categories.includes(transaction.category_id.toString()));

    // Comprueba si la cuenta de la transacción coincide con alguna de las cuentas seleccionadas.
    // Si no se seleccionan cuentas, esta comprobación se dará por superada.
    const isAccountMatch =
      !accounts?.length ||
      (transaction.account_id != null &&
        accounts.includes(transaction.account_id.toString()));

    // Comprueba si el tipo de la transacción coincide con alguno de los tipos seleccionados.
    // Si no se seleccionan tipos, esta comprobación se dará por superada.
    const isTypeMatch = !types?.length || types.includes(transaction.type);

    // La transacción se incluye en el resultado si coincide con todos los criterios.
    return isCategoryMatch && isAccountMatch && isTypeMatch;
  });
};
