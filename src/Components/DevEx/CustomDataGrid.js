import DataGrid, {
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
  Editing,
  LoadPanel,
  Sorting,
  Scrolling,
  Selection,
} from "devextreme-react/data-grid";
// import { LoadPanel } from "devextreme-react";
import { EditFilled, DeleteFilled, ClearOutlined, ReloadOutlined, EyeOutlined, EyeTwoTone } from "@ant-design/icons";
import { Button, Popconfirm, Space } from "antd";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Template } from "devextreme-react";
import { notify } from "Services/ToastService";
import { useHistory, useLocation } from "react-router-dom";

var DG;

const CustomDataGrid = ({
  data,
  columns,
  editHandler,
  deleteHandler,
  bulkDeleteHandler,
  PK_FIELD,
  ENTITY,
  ENTITY_PLURAL,
  canView,
  canEdit,
  canDelete,
  canSelect,
  canBulkDelete,
  onRowPrepared,
  clearFiltersOnSearch,
  height,
  inlineEditing,
  onSaved,
  hideToolbar,
}) => {
  const [records, setRecords] = useState(data);
  const [selectedRows, setSelectedRows] = useState();
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    clearFiltersOnSearch === true && clearSearchFilters();

    // let d =
    //   data &&
    //   data.map((d) => {
    //     return { ...d, active: d.is_active ? "Yes" : "No" };
    //   });
    // setRecords(d);
  }, [data]);

  const toolbarIcon = {
    border: "solid 1px #ccc",
    borderRadius: "4px",
    padding: "7px 8px 8px 9px",
    marginLeft: "8px",
    marginTop: "2px",
    fontSize: "18px",
    cursor: "pointer",
  };

  const toolbarButton = {
    height: "35px",
  };

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
  const onGridInitialized = (e) => {
    DG = e.component;

    //this.calculateStatistics();
  };
  const selectionChanged = (data) => {
    //clear existing search filters.
    setSelectedRows(data.selectedRowKeys);
  };

  const toolbarItemRender = () => {
    return (
      hideToolbar || (
        <div className="flex">
          <div className="mr-auto text-left align-left">
            <span className="text-larger">
              <span className="text-warning text-bold">{(data && data.length) || 0}</span> {ENTITY_PLURAL} found
            </span>
            {<ReloadOutlined className="text-success" style={toolbarIcon} onClick={reloadData} title="Reload data" />}
            {canBulkDelete && (
              <Popconfirm
                title={`Are you sure to delete all the selected ${ENTITY_PLURAL}`}
                onConfirm={() => bulkDeleteHandler(selectedRows)}
              >
                <Button
                  style={toolbarButton}
                  type="primary"
                  danger
                  disabled={!selectedRows || selectedRows.length <= 0}
                >
                  <DeleteFilled />
                  Delete
                  <span className="text-warning">
                    &nbsp;<b>{selectedRows && selectedRows.length > 0 && selectedRows.length}</b>&nbsp;
                  </span>
                  Selected
                </Button>
              </Popconfirm>
            )}
            {
              <ClearOutlined
                className="text-danger"
                style={toolbarIcon}
                onClick={clearSearchFilters}
                title="Clear all search filters"
              />
            }
          </div>
        </div>
      )
    );
  };

  const onToolbarPreparing = (e) => {
    if (hideToolbar) return;
    e.toolbarOptions.items.unshift({
      location: "after",
      template: "deleteButtonTemplate",
    });
  };

  const onContentReady = (e) => {
    // DG.updateDimensions();
  };

  const clearSearchFilters = () => {
    const { clearReportFilters } = require("Lib/StorageHelper");
    clearReportFilters(`DG_${ENTITY_PLURAL}`);

    if (DG) {
      DG.clearFilter();
    }

    notify("Data table search filters cleared");
  };

  const reloadData = () => {
    history.replace(location.pathname);
    notify("Reloading");
  };

  return (
    <div className="app-grid-panel">
    <DataGrid
      visible={true}
      dataSource={data}
      keyExpr={PK_FIELD}
      onContentReady={onContentReady}
      allowColumnReordering={true}
      showBorders={true}
      columnAutoWidth={true}
      rowAlternationEnabled={true}
      showColumnLines={true}
      showRowLines={true}
      width="100%"
      height={height || 650}
      allowColumnResizing={true}
      columnResizingMode="widget"
      columnMinWidth={50}
      noDataText={`No ${ENTITY_PLURAL} Found`}
      onExporting={onExporting}
      onToolbarPreparing={onToolbarPreparing}
      onInitialized={onGridInitialized}
      onSelectionChanged={selectionChanged}
      onRowPrepared={onRowPrepared}
      inlineEditing={inlineEditing || false}
      allowResizing={false}
      onSaved={onSaved}
    >
      {columns &&
        columns.map((col, i) => {
          return (
            <Column
              key={i}
              dataField={col.dataField}
              visible={col.visible}
              caption={col.caption}
              alignment={col.alignment || "left"}
              width={
                ((col.dataType === "boolean" || col.dataField === "is_active" || col.dataField === "active") &&
                  "110px") ||
                col.width
              }
              height={col.height}
              className={`${col.className}`}
              style={col.style}
              dataType={col.dataType}
              valueFormat={col.valueFormat}
              format={col.format}
              //cellRender={col.cellRender}
              headerCellRender={col.headerCellRender}
              fixed={col.fixed}
              fixedPosition={col.fixedPosition}
              allowHeaderFiltering={col.allowHeaderFiltering}
              grouped={col.grouped}
              allowEditing={col.allowEditing || false}
              showAllText={col.showAllText}
              cellRender={
                col.dataField === "is_active" || col.dataField === "active" || col.dataType === "boolean"
                  ? (item) => {
                      let row = item.data;
                      return row.is_active ? <b className="text-success">Yes</b> : <b className="text-danger">No</b>;
                    }
                  : col.cellRender
              }
            >
              {(col.dataType === "boolean" || col.dataField === "is_active" || col.dataField === "active") && (
                <HeaderFilter
                  dataSource={[
                    {
                      text: "Yes",
                      value: [col.dataField, "=", true],
                    },
                    {
                      text: "No",
                      value: [col.dataField, "=", false],
                    },
                  ]}
                />
              )}
              {col.children &&
                col.children.map((cc, i) => {
                  return (
                    <Column
                      dataField={cc.dataField}
                      visible={cc.visible}
                      caption={cc.caption}
                      alignment={cc.alignment || "left"}
                      width={cc.width}
                      className={`${cc.className}`}
                      style={cc.style}
                      dataType={cc.dataType}
                      valueFormat={cc.valueFormat}
                      format={cc.format}
                      cellRender={cc.cellRender}
                      headerCellRender={cc.headerCellRender}
                      fixed={cc.fixed}
                      fixedPosition={cc.fixedPosition}
                      allowHeaderFiltering={cc.allowHeaderFiltering}
                    />
                  );
                })}
            </Column>
          );
        })}
      <Column
        visible={data && data.length > 0 && (canEdit || canDelete)}
        allowResizing={false}
        alignment="center"
        width={(canView || canEdit) && canDelete ? "80px" : "50px"}
        fixed={false}
        fixedPosition="left"
        headerCellRender={() => {
          return <></>;
        }}
        cellRender={(item) => {
          return (
            <>
              <Space size={20} align="center">
                {canView && (
                  <EyeTwoTone
                    title={`id: ${item.data[PK_FIELD || "id"]}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      editHandler(item.data);
                      //setAllowSelect(false);
                    }}
                    className="text-primary text-large"
                  />
                )}
                {canEdit && (
                  <EditFilled
                    title={`id: ${item.data[PK_FIELD || "id"]}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      editHandler(item.data);
                      //setAllowSelect(false);
                    }}
                    className="text-primary text-large"
                  />
                )}
                {canDelete && (
                  <Popconfirm
                    title={`Are you sure to remove this ${ENTITY}`}
                    onConfirm={(e) => {
                      e.stopPropagation();
                      deleteHandler(item.data);
                    }}
                  >
                    <DeleteFilled className="text-danger text-large" />
                  </Popconfirm>
                )}
              </Space>
            </>
          );
        }}
      />
      <Summary recalculateWhileEditing={true}>
        {columns &&
          columns
            .filter((col) => col.showSummary === true)
            .map((col) => {
              return (
                <TotalItem
                  showInColumn={col.dataField}
                  summaryType={col.summaryType}
                  displayFormat={`${col.summaryType === "count" ? `Total ${ENTITY_PLURAL}` : ""} : {0}`}
                  valueFormat={col.valueFormat}
                />
              );
            })}
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

      <Sorting mode="multiple" />
      <Scrolling mode="infinite" />

      <Editing mode="row" useIcons={true} allowUpdating={false} allowDeleting={false} confirmDelete={false} />
      {/* {doPaging && (
        <>
          <Pager allowedPageSizes={[10, 15, 20, 50, 100]} showPageSizeSelector={true} visible={true} />
          <Paging enabled={doPaging} defaultPageSize={100} />
        </>
      )} */}
      {hideToolbar || (
        <Export
          enabled={true}
          // allowExportSelectedData={true}
          horizontalAlignment="right"
          fileName={`${ENTITY_PLURAL} (${format(new Date(), "yyyy-MM-dd")})`}
        />
      )}
      <Grouping contextMenuEnabled={false} />
      <GroupPanel visible={false} allowColumnDragging={false} />
      {hideToolbar || <ColumnChooser enabled={true} mode="select" />}
      <ColumnFixing enabled={true} />
      {/* <Scrolling  mode="virtual" /> */}
      <StateStoring enabled={true} type="localStorage" storageKey={`DG_${ENTITY_PLURAL}`} />
      <HeaderFilter visible={true} allowSearch={true} />
      <LoadPanel enabled={false} text="Loading" showPane={true} />
      {canSelect && (
        <Selection
          mode="multiple"
          selectAllMode={"allPages"}
          showCheckBoxesMode={"onClick"}
          allowSelectAll={true}
          alignment="center"
          textAlign="center"
        />
      )}
      {hideToolbar || <Template name="deleteButtonTemplate" render={toolbarItemRender} />}
      {inlineEditing && <Editing mode="cell" allowUpdating={true} />}
    </DataGrid>
    </div>
  );
};

export default CustomDataGrid;
