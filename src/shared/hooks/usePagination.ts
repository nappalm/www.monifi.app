import { useState } from "react";

export default function usePagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const onNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const onPrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return {
    currentPage,
    onNext,
    onPrev,
  };
}
