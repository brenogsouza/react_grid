import {
  CustomPaging,
  PagingState,
  SortingState
} from "@devexpress/dx-react-grid";
import {
  Grid,
  PagingPanel,
  Table,
  TableHeaderRow
} from "@devexpress/dx-react-grid-material-ui";
import { Paper } from "@material-ui/core";
import React, { useEffect, useState } from "react";
// import { CurrencyTypeProvider } from "../../../theme-sources/material-ui/components/currency-type-provider";
// import { Loading } from "../../../theme-sources/material-ui/components/loading";

const URL =
  "https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/orders?requireTotalCount=true";

const MyTable = () => {
  const [columns] = useState([
    { name: "OrderNumber", title: "Order #" },
    { name: "OrderDate", title: "Order Date" },
    { name: "StoreCity", title: "Store City" },
    { name: "Employee", title: "Employee" },
    { name: "SaleAmount", title: "Sale Amount" }
  ]);
  const [rows, setRows] = useState([]);
  const [currencyColumns] = useState(["SaleAmount"]);
  const [tableColumnExtensions] = useState([
    { columnName: "OrderNumber", align: "right" },
    { columnName: "SaleAmount", align: "right" }
  ]);
  const [sorting, setSorting] = useState([
    { columnName: "StoreCity", direction: "asc" }
  ]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageSizes] = useState([5, 10, 15]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState();

  const changePageSize = value => {
    const totalPages = Math.ceil(totalCount / value);
    const updatedCurrentPage = Math.min(currentPage, totalPages - 1);

    setPageSize(value);
    setCurrentPage(updatedCurrentPage);
  };

  const getQueryString = () => {
    let queryString = `${URL}&take=${pageSize}&skip=${pageSize * currentPage}`;

    if (sorting.length) {
      const sortingConfig = sorting.map(({ columnName, direction }) => ({
        selector: columnName,
        desc: direction === "desc"
      }));
      const sortingStr = JSON.stringify(sortingConfig);
      queryString = `${queryString}&sort=${escape(`${sortingStr}`)}`;
    }

    return queryString;
  };

  const loadData = () => {
    const queryString = getQueryString();
    if (queryString !== lastQuery && !loading) {
      setLoading(true);
      fetch(queryString)
        .then(response => response.json())
        .then(({ data, totalCount: newTotalCount }) => {
          setRows(data);
          setTotalCount(newTotalCount);
          setLoading(false);
        })
        .catch(() => setLoading(false));
      setLastQuery(queryString);
    }
  };

  useEffect(() => loadData());

  return (
    <Paper style={{ position: "relative" }}>
      <Grid rows={rows} columns={columns}>
        {/* <CurrencyTypeProvider for={currencyColumns} /> */}
        <SortingState sorting={sorting} onSortingChange={setSorting} />
        <PagingState
          currentPage={currentPage}
          onCurrentPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={changePageSize}
        />
        <CustomPaging totalCount={totalCount} />
        <Table columnExtensions={tableColumnExtensions} />
        <TableHeaderRow showSortingControls />
        <PagingPanel pageSizes={pageSizes} />
      </Grid>
      {/* {loading && <Loading />} */}
    </Paper>
  );
};
export default MyTable;
