/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Button, Pagination, Popover } from '@mantine/core';
import { DatePicker } from "@mantine/dates";
import { paginationOptionsState } from "@/atoms";
import { getObjValue } from "@/lib/utils";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { IoIosRefresh } from "react-icons/io";
import { IoCalendarOutline, IoSearchOutline } from "react-icons/io5";
import { useRecoilState } from "recoil";
import EmptyView from "./EmptyView";
import LoadingView from "./LoadingView";
import { Column, CustomTable } from "./Table";
import { Popover } from "@mantine/core";
import { Button } from "../base/button";

function sortData(
  data: any[],
  payload: {
    sortBy: string | null;
    reversed: boolean;
    search?: string;
    dateRange?: [Date | null, Date | null];
    dateKey?: string;
  }
) {
  const {
    sortBy,
    reversed,
    search,
    dateRange,
    dateKey = "createdAt",
  } = payload;

  if (search) {
    data = data.filter((item) => {
      const values = Object.values(item);
      return values.some((value) => {
        return JSON.stringify(value)
          .toLowerCase()
          .includes(search.toLowerCase());
      });
    });
  }

  if (dateRange) {
    const [from, to] = dateRange;
    if (from) {
      data = data.filter((item) => {
        const date = new Date(item[dateKey]);
        return date >= from;
      });
    }
    if (to) {
      data = data.filter((item) => {
        const date = new Date(item[dateKey]);
        return date <= to;
      });
    }
  }

  if (!sortBy) {
    return data;
  }

  return [...data].sort((a, b) => {
    return reversed
      ? String(JSON.stringify(getObjValue(sortBy, b))).localeCompare(
          String(JSON.stringify(getObjValue(sortBy, a)))
        )
      : String(JSON.stringify(getObjValue(sortBy, a))).localeCompare(
          String(JSON.stringify(getObjValue(sortBy, b)))
        );
  });
}

export interface RowContext<T = any> {
  /**
   * Whether the row is selected or not
   */
  selected: boolean;
  /**
   * String value of the cell
   */
  value: string;
  /**
   * Full row data
   */
  row: T;
  /**
   * All the rows in the table
   */
  rows: T[];
}
export interface PaginationOptions {
  totalPages: number;
  totalElements: number;
}

interface TableWrapperProps<T = any> {
  /**
   * Custom class name for the table wrapper
   */
  className?: string;
  /**
   * Table columns
   */
  columns: Column<T>[];
  /**
   * Array of data to be displayed in the table
   */
  data: T[];
  /**
   * Title of the Wrapper
   */
  title?: string;
  /**
   * boolean to check if the api is paginated
   */
  paginated?: boolean;
  /**
   * an object to check  for the pagination options
   */
  pagination?: PaginationOptions;
  /**
   * Function that resets the table data to its original state before filtering and sorting and searching ...
   */
  reset?: () => void;
  /**
   * Function to set the data of the table
   */
  setData?: React.Dispatch<React.SetStateAction<T[]>>;
  /**
   * A function that returns filters to be displayed on the right side of the search bar
   * @param data Original table data
   * @param sortedData Filtered and sorted data that is being currently displayed in the table
   * @param setData Function to set the data of the table
   * @param reset Function to reset the table to its original state
   * @returns
   */
  filters?: (
    data: any[],
    sortedData: any[],
    setData?: React.Dispatch<React.SetStateAction<any[]>>,
    reset?: () => void
  ) => React.ReactNode[] | React.ReactNode;
  /**
   * Whether the table is filterable by date or not
   * @default false
   */
  filterableByDate?: boolean;
  actions?: React.ReactNode[];
  error?: boolean;
  loading?: boolean;
  errorFetching?: boolean;
  refresh?: () => void;
  dateKey?: string;
  onRowClick?: (row: T) => void;
  emptyViewProps?: {
    message: string;
    description?: string;
    icon?: React.ReactNode;
    buttonLabel?: string;
    buttonAction?: () => void;
  };
}

const TableWrapper = ({
  columns,
  data: originalData,
  className,
  title,
  filters,
  actions,
  // setData,
  reset: dataReset,
  filterableByDate = false,
  loading,
  error,
  refresh,
  errorFetching = false,
  paginated,
  pagination,
  dateKey,
  onRowClick,
  emptyViewProps,
}: TableWrapperProps) => {
  const [paginationOptions, setPaginationOpts] = useRecoilState(
    paginationOptionsState
  );

  const [search, setSearch] = useState<string>("");
  const [selection, setSelection] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [data, setData] = useState<any[]>([]);

  const reset = useCallback(() => {
    setSearch("");
    setSelection([]);
    setSortBy(null);
    setReverseSortDirection(false);
    setPage(1);
    setDateRange([null, null]);
    if (dataReset) {
      dataReset();
      setData(originalData); // Reset data to the original data
    }
  }, [originalData, dataReset]);

  useEffect(() => {
    !!originalData && setData(originalData);
  }, [originalData]);

  useEffect(() => {
    setPage(1);
    setSortBy(null);
    setReverseSortDirection(false);
  }, [search]);

  const sortedData = useMemo<any[]>(() => {
    return sortData(data, {
      sortBy,
      reversed: reverseSortDirection,
      search,
      dateRange,
      dateKey,
    });
  }, [sortBy, reverseSortDirection, data, search, dateRange, dateKey]);

  const onSort = (key: string) => {
    if (sortBy === key && reverseSortDirection) {
      setSortBy(null);
      setReverseSortDirection(false);
      return;
    }
    if (sortBy === key) {
      setReverseSortDirection((current) => !current);
    } else {
      setSortBy(key);
      setReverseSortDirection(false);
    }
  };

  return (
    <div className="flex flex-col gap-0 pt-4 pb-8 px-6 rounded-xl bg-white">
      {/* HEADER */}
      <div className="flex flex-col flex-wrap lg:flex-row sm:justify-between gap-2 lg:items-center">
        <div className="flex flex-row gap-2 items-center">
          <h1 className="font-medium text-2xl text-gray-700">{title}</h1>
          {/* <IoRefreshCircleOutline
                  className={`h-7 w-7 text-gray-600 cursor-pointer ${loading !== undefined && loading ? 'animate-spin' : ''}`}
                  onClick={refresh}
               /> */}
        </div>
        {/* SEARCH + OTHER FILTERS */}
        <div className="flex flex-row flex-wrap items-center gap-2 h-fit">
          {data.length !== 0 && (
            <div className="flex flex-row items-center rounded-md h-full max-h-[40px] bg-gray-100 px-4 lg:py-4 gap-2">
              <IoSearchOutline className="stroke-[#5D6E8B]" />
              <input
                type="text"
                placeholder={"Search here..."}
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                className="grow border-none outline-none bg-transparent h-full shadow-none"
                style={{ boxShadow: "none !important" }}
              />
            </div>
          )}
          <div className="flex flex-col md:flex-row gap-2 md:items-center">
            {!!filters && filters(originalData, sortedData, setData, reset)}
            {filterableByDate && (
              <Popover position="bottom-end" offset={6}>
                <Popover.Target>
                  <Button className="!text-black bg-white hover:bg-gray-200 h-[40px] max-h-[40px]">
                    <IoCalendarOutline className="stroke-black h-4 w-4" />
                    &nbsp;&nbsp;
                    {dateRange[0] && dateRange[1]
                      ? `${dateRange[0].toLocaleDateString()} - ${dateRange[1].toLocaleDateString()}`
                      : "Select Date"}
                  </Button>
                </Popover.Target>
                <Popover.Dropdown>
                  <DatePicker
                    type="range"
                    value={dateRange}
                    onChange={setDateRange}
                  />
                  ;
                </Popover.Dropdown>
              </Popover>
            )}
            {refresh && (
              <IoIosRefresh
                className={`h-6 w-6 text-gray-600 cursor-pointer ${
                  loading !== undefined && loading ? "animate-spin" : ""
                }`}
                onClick={() => refresh()}
              />
            )}
            {actions &&
              actions.map((action, i) => {
                return <Fragment key={i}>{action}</Fragment>;
              })}
          </div>
        </div>
      </div>
      {loading ? (
        <LoadingView message="Loading data ..." />
      ) : error ? (
        <EmptyView
          message={
            "An error occurred while fetching data. Please try again later."
          }
          icon={emptyViewProps?.icon}
        />
      ) : (
        <CustomTable
          errorFetching={errorFetching}
          data={data}
          loading={loading}
          columns={columns}
          className={className}
          selection={selection}
          setSelection={setSelection}
          sortedData={sortedData}
          sortBy={sortBy}
          reverseSortDirection={reverseSortDirection}
          onSort={onSort}
          page={paginated ? paginationOptions! : page}
          setPage={paginated ? setPaginationOpts : setPage}
          paginated={paginated}
          pagination={pagination}
          onRowClick={onRowClick}
          emptyViewProps={emptyViewProps}
          refresh={refresh}
        />
      )}
    </div>
  );
};

export default TableWrapper;
