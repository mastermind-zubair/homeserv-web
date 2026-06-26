import React, { useState } from "react";
import "devextreme/dist/css/dx.light.css";
import { Button, Form, Modal } from "antd";
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
import { useTranslation } from "react-i18next";


const OptionTemplates = (props) => {

  const DG = "dgOptionTemplates";


  const data = [
    { template_name: "ValorSoft", industry: "mechanic", view_option_template: "click to view", status: "active", },

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


  const style = { boxShadow: "0 0 11px rgba(33,33,33,.2)" };

  return (
    <>
      <div style={{ marginBottom: "20px" }}><Button onClick={showModal} > {t("price_book_option_template_button_add_an_option_templates")} </Button></div>

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
          <Column dataField="template_name" alignment="left" dataType="string" caption={t("price_book_option_template_grid_template_name")} />
          <Column dataField="industry" alignment="left" dataType="string" caption={t("general_industry")} />
          <Column dataField="view_option_template" alignment="left" dataType="string" caption={t("price_book_option_template_grid_view_option_template")} />
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

      <Modal title={t("price_book_option_template_button_add_an_option_templates")} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}
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

          Here some data will be added..



        </Form>

      </Modal>
    </>

  );
};

export default OptionTemplates;
