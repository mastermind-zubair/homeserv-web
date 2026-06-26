import React from "react";
import "devextreme/dist/css/dx.light.css";
import DataGrid, {
  Pager,
  Paging,
  Column,
  FilterRow,
  Export,
  ColumnChooser,
  Summary,
  TotalItem,
  Grouping,
  GroupPanel,
  ColumnFixing,
  StateStoring,
  HeaderFilter,
} from "devextreme-react/data-grid";
import { LoadPanel } from "devextreme-react";
import PageTitle from "../_Common/PageTitle";

const Timesheets_ConfirmedPayroll = (props) => {
  const DG = "dgTimesheets_ConfirmedPayroll";

  const data = [
    {
      organization: "Service Vault",
      employee_name: "Rahul",
      payment_date: "03-07-2019",
      total_hours: "36",
      status: "Paid",
    },
    {
      organization: "Valor Soft",
      employee_name: "Raj",
      payment_date: "03-07-2021",
      total_hours: "36",
      status: "Awaited Payment",
    },
    { organization: "Fair5", employee_name: "Prem", payment_date: "01-20-2018", total_hours: "46", status: "Paid" },
  ];

  const onExporting = (e) => {
    // this.loading(true);
    // const { searchForm } = this.state;
    // const uniqueString = randomstring.generate({
    //   length: 6,
    //   charset: "alphabetic",
    // });
    // const workSheetName = !searchForm.includeDate
    //   ? `category_copy_report_${moment().format("YYYY-DD-MMThhmmss")}_${uniqueString}`
    //   : `category_copy_report_${moment(searchForm.fromDate).format("YYYY-DD-MM")}-${moment(searchForm.toDate).format(
    //       "YYYY-DD-MM"
    //     )}_${moment().format("YYYY-DD-MMThhmmss")}_${uniqueString}`;
    // let workBook = new ExcelJS.Workbook();
    // let workSheet = workBook.addWorksheet(workSheetName);
    // workSheet.views = [{ state: "frozen", xSplit: 0, ySplit: 1 }];
    // setExportDataGrid(e, workSheetName, workSheet, workBook, "");
    // e.cancel = true;
    // this.loading(false);
  };

  const style = { boxShadow: "0 0 11px rgba(33,33,33,.2)" };

  return (
    <>
      <div className="flex mb-2">
        <PageTitle />
        <h3 className="push-right text-right"></h3>
      </div>

      <div style={style}>
        <DataGrid
          visible={true}
          dataSource={data}
          allowColumnReordering={true}
          showBorders={true}
          columnAutoWidth={true}
          rowAlternationEnabled={true}
          showColumnLines={true}
          showRowLines={true}
          width="100%"
          allowColumnResizing={true}
          columnResizingMode="widget"
          columnMinWidth={100}
          noDataText="No Records Found"
          onExporting={onExporting}
        >
          <Column fixed={true} dataField="organization" alignment="left" dataType="string" caption="Organization" />
          <Column dataField="employee_name" alignment="left" dataType="string" caption="Employee Name" />
          <Column dataField="payment_date" alignment="left" dataType="string" caption="Payment Date" />
          <Column dataField="total_hours" alignment="left" dataType="string" caption="Total Hours" />
          <Column dataField="status" alignment="left" dataType="string" caption="Status" />

          <Summary recalculateWhileEditing={true}>
            <TotalItem column="price" summaryType="sum" displayFormat={"{0}"} />
          </Summary>

          <FilterRow
            visible={true}
            applyFilter={{
              key: "onClick",
              name: "On Button Click",
            }}
          />
          {/* <SearchPanel
                          visible={false}
                          highlightSearchText={true}
                          horizontalAlignment="left"
                        /> */}
          <Pager allowedPageSizes={[5, 10, 15, 20, 50, 100]} showPageSizeSelector={true} visible={true} />
          <Paging enabled={true} defaultPageSize={10} />
          <Export
            enabled={true}
            // allowExportSelectedData={true}
            horizontalAlignment="right"
            fileName="CategoryCopyReport"
          />
          <Grouping contextMenuEnabled={true} />
          <GroupPanel visible={true} allowColumnDragging={true} />
          <ColumnChooser enabled={true} mode="select" />
          <ColumnFixing enabled={true} />
          {/* <Scrolling  mode="virtual" /> */}
          <StateStoring enabled={true} type="localStorage" storageKey={DG} />
          <HeaderFilter visible={true} allowSearch={true} />
          <LoadPanel enabled={true} />
        </DataGrid>
      </div>
    </>
  );
};

export default Timesheets_ConfirmedPayroll;
