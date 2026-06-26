import React from "react";
import "devextreme/dist/css/dx.light.css";
import { Button, DatePicker, Space } from "antd";
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

const Timesheets_Approved = (props) => {
  const DG = "dgTimesheets_Approved";

  const data = [
    {
      organization: "SV_369t",
      employee_name: "Rahul",
      total_working_hours: "32",
      hours_breakdown: "36",
      edit: "edit",
      status: "Active",
    },
    {
      organization: "VSoft_6987",
      employee_name: "Raj",
      total_working_hours: "42",
      hours_breakdown: "36",
      edit: "edit",
      status: "Pushed to Xero",
    },
    {
      organization: "Fair5_0987",
      employee_name: "Prem",
      total_working_hours: "18",
      hours_breakdown: "46",
      edit: "edit",
      status: "30 Days overdue",
    },
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

  function onChange(checkedValues) {
    console.log("checked = ", checkedValues);
  }

  const style = { boxShadow: "0 0 11px rgba(33,33,33,.2)" };

  const { RangePicker } = DatePicker;

  function onOk(value) {
    console.log("onOk: ", value);
  }

  return (
    <>
      <div className="flex mb-2">
        <PageTitle />
        <h3 className="push-right text-right"></h3>
      </div>
      <div style={{ margin: "20px" }}>
        <Space direction="horizontal" size={12}>
          <RangePicker format="YYYY-MM-DD" onChange={onChange} onOk={onOk} />
          <Button>Search</Button>
        </Space>
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
          <Column dataField="total_working_hours" alignment="left" dataType="string" caption="Total Working Hours" />
          <Column dataField="hours_breakdown" alignment="left" dataType="string" caption="Hours Breakdown" />
          <Column dataField="edit" alignment="left" dataType="string" caption="Edit" />
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

      {/* <div>
        <h2>When we click on edit then schedules calneder will open, and that will be added by Mr. Butt.</h2>
      </div> */}
    </>
  );
};

export default Timesheets_Approved;
