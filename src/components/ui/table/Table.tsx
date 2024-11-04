/* eslint-disable @typescript-eslint/no-explicit-any */
// import cx from 'clsx';
import { paginationOptionsState } from "@/atoms";
import { cn, getObjValue } from "@/lib/utils.ts";
import { Pagination, rem, Table } from "@mantine/core";
import { useRecoilState } from "recoil";
import { Checkbox } from "../base/checkbox.tsx";
import EmptyView from "./EmptyView.tsx";
import SortableTH from "./SortableTH.tsx";

export interface RowContext<T = any> {
  selected: boolean;
  value: string;
  row: T;
  rows: T[];
  refresh?: () => void;
}

export interface Column<T = any> {
  /**
   * Header title of the column
   */
  title: string;
  /**
   * key in the row data object
   */
  key: string;
  /**
   * Accessor function to get the value of the cell
   */
  getValue?: (row: T) => string;
  /**
   * Whether the column can be sorted or not
   */
  sortable?: boolean;
  align?: "left" | "center" | "right";
  /**
   * Custom element to be rendered in the cell
   */
  Element?: (rowContext: RowContext<T>) => React.ReactNode;
  /**
   * for date columns, whether the date is filterable or not
   * @default false
   */
  isFilterableDate?: boolean;
}

interface CustomTableProps {
  className?: string;
  columns: Column[];
  data: any[];
  selection: string[];
  setSelection: React.Dispatch<React.SetStateAction<string[]>>;
  sortedData: any[];
  sortBy: string | null;
  reverseSortDirection: boolean;
  onSort: (sortBy: string) => void;
  pageSize?: number;
  page?: number;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  errorFetching?: boolean;
  loading?: boolean;
  dateRange?: [Date | null, Date | null];
  paginated?: boolean;
  pagination?: {
    totalPages: number;
    totalElements: number;
  };
  onRowClick?: (row: any) => void;
  emptyViewProps?: {
    message: string;
    description?: string;
    icon?: React.ReactNode;
    buttonLabel?: string;
    buttonAction?: () => void;
  };
  refresh?: () => void;
}

export function CustomTable({
  columns,
  data,
  selection,
  setSelection,
  sortedData,
  sortBy,
  reverseSortDirection,
  onSort,
  pageSize = 10,
  page = 1,
  setPage = () => {},
  errorFetching = false,
  loading,
  refresh,
  paginated = false,
  pagination,
  onRowClick,
  emptyViewProps,
}: CustomTableProps) {
  const [
    paginationOptions,
    // setPaginationOpts
  ] = useRecoilState(paginationOptionsState);

  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  // const toggleAll = () =>
  //   setSelection((current) =>
  //     current.length === data.length ? [] : data.map((item) => item.id)
  //   );
  // console.log('sortedData', sortedData);
  const rows =
    //check if paginated is true
    !paginated
      ? Array.isArray(sortedData) && sortedData.length > 0
        ? sortedData
            .slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize)
            .map((item: any, item_index: number) => {
              return (
                <Table.Tr
                  role="data-rows"
                  key={item_index}
                  className={cn("", onRowClick && "cursor-pointer")}
                >
                  <Table.Td>
                    <Checkbox
                      checked={selection.includes(item.id)}
                      onClick={() => toggleRow(item.id)}
                    />
                  </Table.Td>
                  {columns.map((column, i: number) => {
                    return (
                      <Table.Td
                        data-test-id={getObjValue(column.key, item)}
                        key={i}
                        align={column.align}
                        className="text-gray-600"
                        onClick={
                          !column.Element
                            ? () => onRowClick && onRowClick(item as any)
                            : undefined
                        }
                      >
                        {column.Element ? (
                          <column.Element
                            {...{
                              selected: selection.includes(item.id),
                              row: item,
                              rows: data,
                              value: getObjValue(column.key, item)!,
                              refresh,
                            }}
                          />
                        ) : (
                          String(getObjValue(column.key, item))
                        )}
                      </Table.Td>
                    );
                  })}
                </Table.Tr>
              );
            })
        : []
      : sortedData.map((item: any, item_index: number) => {
          return (
            <Table.Tr
              role="data-rows"
              key={item_index}
              className={cn("", onRowClick && "cursor-pointer")}
            >
              <Table.Td>
                <Checkbox
                  checked={selection.includes(item.id)}
                  onClick={() => toggleRow(item.id)}
                />
              </Table.Td>
              {columns.map((column, i: number) => {
                return (
                  <Table.Td
                    data-test-id={getObjValue(column.key, item)!}
                    key={i}
                    align={column.align}
                    onClick={
                      !column.Element
                        ? () => onRowClick && onRowClick(item as any)
                        : undefined 
                    }
                  >
                    {column.Element ? (
                      <column.Element
                        {...{
                          selected: selection.includes(item.id),
                          row: item,
                          rows: data,
                          value: getObjValue(column.key, item)!,
                        }}
                      />
                    ) : (
                      String(getObjValue(column.key, item)!)
                    )}
                  </Table.Td>
                );
              })}
            </Table.Tr>
          );
        });

  return (
    <div className="overflow-x-auto mt-4 rounded-t-md">
      <Table miw={800} verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr className="bg-white text-[1rem] text-gray-700 border-y ">
            <Table.Th style={{ width: rem(40) }}>
              {/* <Checkbox
                onClick={toggleAll}
                checked={
                  selection.length > 0 && selection.length !== data.length
                    ? "indeterminate"
                    : selection.length === data.length
                }
              /> */}
            </Table.Th>
            {columns.map((column, i: number) => {
              return (
                <SortableTH
                  className="whitespace-nowrap font-normal"
                  key={i}
                  {...(column.sortable && {
                    onSort: onSort.bind(null, column.key),
                    sorted: sortBy === column.key,
                    reversed: reverseSortDirection,
                  })}
                >
                  {column.title}
                </SortableTH>
              );
            })}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.length ? (
            rows
          ) : !loading ? (
            <Table.Tr>
              <Table.Td colSpan={columns.length + 1}>
                {/* <div className="text-center text-gray-400">
                           {errorFetching ? 'Error Fetching Data' : 'No Data To Show'}
                        </div> */}
                <EmptyView
                  {...emptyViewProps}
                  message={
                    errorFetching
                      ? "Error Fetching Data"
                      : emptyViewProps?.message || "No Data To Show"
                  }
                />
              </Table.Td>
            </Table.Tr>
          ) : null}
        </Table.Tbody>
      </Table>

      <Pagination
        total={
          paginated
            ? pagination!.totalPages
            : Math.ceil(sortedData.length / pageSize)
        }
        value={paginated ? paginationOptions : page}
        onChange={setPage}
        color="black"
      />
    </div>
  );
}
