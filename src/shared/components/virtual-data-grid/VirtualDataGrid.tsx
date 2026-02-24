import { Box, useColorModeValue } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { GridContext } from "./GridContext";
import { useVirtualGrid } from "./hooks/useVirtualGrid";
import { GridHeader } from "./components/GridHeader";
import { GridBody } from "./components/GridBody";
import { FloatingEditor } from "./components/FloatingEditor";
import { SelectionOverlay } from "./components/SelectionOverlay";
import { EmptyState } from "./components/EmptyState";
import { SkeletonRows } from "./components/SkeletonRows";
import { FilterBar } from "./components/FilterBar";
import { GridMenu } from "./components/GridMenu";
import type { ComputedColumn, DataRow, VirtualDataGridProps } from "./types";
import { DEFAULT_HEADER_HEIGHT } from "./constants";

export function VirtualDataGrid<T extends DataRow>(
  props: VirtualDataGridProps<T>,
) {
  const {
    isLoading = false,
    height,
    enableColumnResize = false,
    enableFilter = false,
    enableSelection = false,
    renderMenu,
  } = props;

  const {
    containerRef,
    virtualizer,
    contextValue,
    filterValue,
    handleFilterChange,
    startResize,
  } = useVirtualGrid(props);

  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const borderColor = useColorModeValue("gray.200", "gray.800");

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      setScrollTop(target.scrollTop);
      setScrollLeft(target.scrollLeft);
      setContainerHeight(target.clientHeight);
    },
    [],
  );

  const handleContainerFocus = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      if (e.target === containerRef.current) {
        const { activeCell } = contextValue;
        containerRef.current
          ?.querySelector<HTMLElement>(
            `[data-row="${activeCell?.row || 0}"][data-col="${activeCell?.col || 0}"]`,
          )
          ?.focus();
      }
    },
    [containerRef, contextValue],
  );

  const { data, totalWidth, rowHeight } = contextValue;
  const columns = contextValue.columns as ComputedColumn<DataRow>[];

  return (
    <GridContext.Provider value={contextValue}>
      {enableFilter && (
        <FilterBar value={filterValue} onChange={handleFilterChange} />
      )}
      <Box
        ref={containerRef}
        border="1px solid"
        borderColor={borderColor}
        position="relative"
        overflow="auto"
        tabIndex={0}
        onFocus={handleContainerFocus}
        onScroll={handleScroll}
        willChange="transform"
        {...(height && { h: height })}
        sx={{
          "&:focus": { outline: "none" },
        }}
      >
        <GridHeader
          startResize={startResize}
          enableColumnResize={enableColumnResize}
        />

        {isLoading ? (
          <SkeletonRows
            rows={5}
            cols={columns.length}
            rowHeight={rowHeight}
            totalWidth={totalWidth}
          />
        ) : data.length === 0 ? (
          <EmptyState height={height} />
        ) : (
          <GridBody
            virtualItems={virtualizer.getVirtualItems()}
            totalSize={virtualizer.getTotalSize()}
          />
        )}

        <FloatingEditor
          editState={contextValue.editState}
          inputValue={contextValue.inputValue}
          setInputValue={contextValue.setInputValue}
          stopEditing={contextValue.stopEditing}
          columns={columns}
          rowHeight={rowHeight}
          headerHeight={DEFAULT_HEADER_HEIGHT}
          scrollTop={scrollTop}
          containerHeight={containerHeight}
          showRowNumber={contextValue.showRowNumber}
        />

        {enableSelection && (
          <SelectionOverlay
            selectionRange={contextValue.selectionRange}
            columns={columns}
            rowHeight={rowHeight}
            headerHeight={DEFAULT_HEADER_HEIGHT}
            scrollTop={scrollTop}
            scrollLeft={scrollLeft}
            showRowNumber={contextValue.showRowNumber}
          />
        )}
      </Box>

      {renderMenu && (
        <GridMenu
          isOpen={!!contextValue.menuState}
          anchorRect={contextValue.menuState?.anchorRect ?? null}
          onClose={contextValue.closeMenu}
        >
          {contextValue.menuState &&
            renderMenu(
              contextValue.menuState.row as T,
              contextValue.menuState.rowIndex,
              contextValue.closeMenu,
            )}
        </GridMenu>
      )}
    </GridContext.Provider>
  );
}
