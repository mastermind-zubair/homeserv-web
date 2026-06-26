import React, { useState } from "react";
//import "devextreme/dist/css/dx.light.css";
import { Button, Row, Col, Select, Input, Checkbox, Form, Modal, Upload, Radio } from "antd";
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
  Button as GridButton,
} from "devextreme-react/data-grid";
import { LoadPanel } from "devextreme-react";
import { UploadOutlined } from "@ant-design/icons";

const plainOptions = ["Active", "Non Active"];
const ManageUsers_Office = (props) => {
  const DG = "dgManageUsers_Office";

  const data = [
    { display_name: "Michael", user_name: "michael_123", email: "michael@123.com", role: "plumber", status: "active" },
    { display_name: "Ben Rec", user_name: "recz@313", email: "recz@2334.com", role: "electrician", status: "active" },
    { display_name: "Clifford", user_name: "clif@ya", email: "clif@gmail.com", role: "carpanter", status: "active" },
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

  const showModal = () => {
    setIsModalVisible(true);
  };

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
    { label: "Operator 1", value: "Operator 1" },
    { label: "Operator 2", value: "Operator 2" },
  ];

  const [value, setValue] = React.useState(1);

  const onChange1 = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  return (
    <>
      <h4 style={{ marginBottom: "20px" }}>{/* Manage Office User */}</h4>
      <div>
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
          <Column fixed={true} dataField="display_name" alignment="left" dataType="string" caption="Display Name" />
          <Column dataField="user_name" alignment="left" dataType="string" caption="User Name" />
          <Column dataField="email" alignment="left" dataType="string" caption="Email" />
          <Column dataField="role" alignment="left" dataType="string" caption="Role" />
          <Column dataField="status" alignment="left" dataType="number" caption="Status" />
          <Column type="buttons" width={110}>
            <GridButton name="edit" />
            <GridButton name="delete" />
          </Column>

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

      <Row style={{ marginTop: "15px" }}>
        <Col>
          <Button style={{ height: "100%" }} onClick={showModal}>
            <h2 style={{ marginTop: "5px" }}> Add A New Office User +</h2>
            <p style={{ marginTop: "-10px" }}> Do you have more than one user? </p>
          </Button>
        </Col>
      </Row>

      <Modal
        title="Add A New Office User"
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
          <Form.Item label="Display Name">
            {" "}
            <Input placeholder="enter name" />{" "}
          </Form.Item>
          <Form.Item label="Email">
            {" "}
            <Input placeholder="enter email" />{" "}
          </Form.Item>
          <Form.Item label="Phone Number">
            {" "}
            <Input placeholder="enter phone number" />{" "}
          </Form.Item>
          <Form.Item label="Address">
            {" "}
            <Input placeholder="enter address" />{" "}
          </Form.Item>
          <Form.Item label="Mobile Number">
            {" "}
            <Input placeholder="enter mobile number" />{" "}
          </Form.Item>
          <Form.Item label="User Role">
            {" "}
            <Select options={areas} />{" "}
          </Form.Item>
          <Form.Item label="User Name">
            {" "}
            <Input placeholder="enter user name" />{" "}
          </Form.Item>
          <Form.Item label="Password">
            {" "}
            <Input placeholder="******" />{" "}
          </Form.Item>
          <Form.Item label="Confirm Password">
            {" "}
            <Input placeholder="******" />{" "}
          </Form.Item>

          <Form.Item label="Profile Image"></Form.Item>
          <Form.Item wrapperCol={{ offset: 8 }} style={{ marginTop: "-40px" }}>
            <Upload>
              <Button icon={<UploadOutlined />}>Choose Profile Image</Button>
            </Upload>
          </Form.Item>

          <p> Prevent Access to Service Vault from outsdie the Office </p>
          <Radio.Group onChange={onChange1} value={value}>
            <Radio value={1}>Local User</Radio>
            <Radio value={2}>Remote</Radio>
          </Radio.Group>

          <p style={{ marginTop: "10px" }}> User Status Active or not Active </p>
          <Checkbox.Group options={plainOptions} defaultValue={["Active"]} onChange={onChange} />
        </Form>
      </Modal>
    </>
  );
};

export default ManageUsers_Office;
