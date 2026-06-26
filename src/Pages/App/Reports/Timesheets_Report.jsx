import React, { useState } from "react";
import "devextreme/dist/css/dx.light.css";
import { Button, Select, Input, DatePicker, Space, Form, Modal } from "antd";
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

const Timesheets_Report = (props) => {
  const DG = "dgTimesheets_Report";

  const data = [
    {
      date: "30-09-2021",
      employee_name: "Rahul",
      total_working_hours: "5",
      sort_by: "Mark",
      status: "Active",
    },
    { date: "30-09-2021", employee_name: "Raj", total_working_hours: "7", sort_by: "Ben Recz", status: "Active" },
    { date: "30-09-2021", employee_name: "Prem", total_working_hours: "16", sort_by: "Carmen", status: "Active" },
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

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  function onChange(checkedValues) {
    console.log("checked = ", checkedValues);
  }
  const areas = [
    { label: "DGB-88U", value: "DGB-88U" },
    { label: "DGB-88U", value: "DGB-88U" },
    { label: "2010", value: "2021" },
    { label: "ServiceVault", value: "2021" },
  ];

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
        ,
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
          <Column fixed={true} dataField="date" alignment="left" dataType="string" caption="Date" />
          <Column dataField="employee_name" alignment="left" dataType="string" caption="Employee Name" />
          <Column dataField="total_working_hours" alignment="left" dataType="string" caption="Total Working Hours" />
          <Column dataField="sort_by" alignment="left" dataType="string" caption="Sort By" />
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

      <Modal
        title="Add A New  Product"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="submit" type="primary" onClick={handleOk}>
            Save
          </Button>,
        ]}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Form.Item label="Technician">
            <Input placeholder="enter technician name" />{" "}
          </Form.Item>
          <Form.Item label="Registration">
            <Input placeholder="enter vehicle registration" />{" "}
          </Form.Item>
          <Form.Item label="Inventory Template">
            <Input placeholder="Select template" />{" "}
          </Form.Item>
          <Form.Item label="Industry">
            {" "}
            <Select options={areas} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Timesheets_Report;
