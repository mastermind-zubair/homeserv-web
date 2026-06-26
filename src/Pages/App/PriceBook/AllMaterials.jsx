import React, { useState } from "react";
import "devextreme/dist/css/dx.light.css";
import { Button, Select, Input, Checkbox, Form, Modal, Upload, } from "antd";
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
  Button as GridButton
} from "devextreme-react/data-grid";
import { LoadPanel } from "devextreme-react";
import { UploadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";


const plainOptions = ['Active', 'Non Active'];
const AllMaterials = (props) => {

  const DG = "dgAllMaterials";


  const data = [
    { code: "236-S", supplier: "Fair5", title: "Mechanical work", cost: "250$", unit: "3654", image: "mechanic", status: "active", },

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
  const { t } = useTranslation();

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
    console.log('checked = ', checkedValues);

  }
  const areas = [
    { label: 'Selection_Supplier', value: 'Selection_Supplier' },
    { label: 'Selection_Section', value: 'Selection_Section' },

  ];

  const style = { boxShadow: "0 0 11px rgba(33,33,33,.2)" };





  return (
    <>
      <div style={{ marginBottom: "20px" }}><Button onClick={showModal} > {t("price_book_add_a_new_material")} </Button></div>


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
          <Column dataField="code" alignment="left" dataType="string" caption={t("general_code")} />
          <Column dataField="supplier" alignment="left" dataType="string" caption="Supplier" />
          <Column dataField="title" alignment="left" dataType="string" caption={t("general_title")} />
          <Column dataField="cost" alignment="left" dataType="string" caption={t("general_cost")} />
          <Column dataField="unit" alignment="left" dataType="string" caption={t("general_unit")} />
          <Column dataField="image" alignment="left" dataType="string" caption={t("general_image")} />
          <Column dataField="status" alignment="left" dataType="string" caption={t("general_status")} />
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

      <Modal title={t("price_book_add_a_new_material")} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}
        footer={[

          <Button key="submit" type="primary" onClick={handleOk}>
            {t("general_save")}
          </Button>,

        ]}>

        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          autoComplete="off"
        >


          <Form.Item label={t("price_book_all_material_form_select_supplier")}>       {" "}     <Select options={areas} /></Form.Item>
          <Form.Item label={t("price_book_all_material_form_select_section")}>       {" "}     <Select options={areas} /></Form.Item>
          <Form.Item label={t("price_book_all_material_form_select_category")}>       {" "}     <Select options={areas} /></Form.Item>
          <Form.Item label={t("select_code")}><Input placeholder={t("price_book_all_material_form_provide_item_code")} /> </Form.Item>
          <Form.Item label={t("select_title")}   ><Input placeholder={t("price_book_all_material_form_provide_item_title")} /> </Form.Item>
          <Form.Item label={t("general_cost")} ><Input placeholder={t("price_book_all_material_form_provide_item_cost")} /> </Form.Item>
          <Form.Item label={t("general_unit")}><Input placeholder={t("price_book_all_material_form_provide_item_unit")} /> </Form.Item>
          <Form.Item label={t("general_image")}></Form.Item>
          <Form.Item wrapperCol={{ offset: 8 }} style={{ marginTop: "-40px" }}>
            <Upload>
              <Button icon={<UploadOutlined />}> {t("general_choose_file")}</Button>
            </Upload>
          </Form.Item>
          <Checkbox.Group options={plainOptions} defaultValue={['Active']} onChange={onChange} />




        </Form>

      </Modal>
    </>

  );
};

export default AllMaterials;
