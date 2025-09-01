export function fromToPagination(page: number) {
  const itemsPerPage = 20;

  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  return { from, to, itemsPerPage };
}

export function lastPage(
  count: number | undefined | null,
  itemsPerPage: number,
) {
  return Math.ceil((count ?? 0) / itemsPerPage);
}
