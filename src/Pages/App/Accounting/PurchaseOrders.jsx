import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, Row, Col, Form } from "antd";
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
import Form_PurchaseOrders from "./Components/Form_PurchaseOrders";
import DefaultService from "Services/API/DefaultService";
import { trackPromise } from "react-promise-tracker";
import Context from "Store/Context";
import { notify } from "Services/ToastService";
import CustomDataGrid from "Components/DevEx/CustomDataGrid";
import { useTranslation } from "react-i18next";

const PurchaseOrders = (props) => {
  const DG = "dgPurchaseOrders";
  const ENTITY_API_KEY = "Accounting_PurchaseOrder";
  const ENTITY = "Purchase Order";
  const ENTITY_PLURAL = "Purchase Orders";

  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);

  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();

  const { curOrg: organisation } = useContext(Context);

  useEffect(async () => {
    if (organisation) {
      await handleSearch();
    }
  }, [organisation]);

  const handleEdit = async (item) => {
    //console.log("Edit Handler", item);

    let record = {};
    if (item.id) {
      record = { ...item };
    } else {
      record.organisation_id = organisation.id;
    }
    setRecordToEdit(record);

    setShowEditForm(true);
  };

  const handleSearch = useCallback(async () => {
    if (organisation === null) return;
    let { data, status, message } = await trackPromise(
      DefaultService.Entity_List(ENTITY_API_KEY, { organisation_id: organisation.id })
    );
    notify(message, status);
    setData(data);
  }, [organisation]);

  const onExporting = (e) => { };
  const handleCancel = () => {
    setShowEditForm(false);
  };

  const onFinish = async (values) => {
    //console.log(files);

    /* IF FILES NEED TO BE UPLOADED VIA FORM
    const formData = new FormData();
     files.forEach((file) => {
       formData.append("files[]", file);
     });
    */
    let record = values;
    console.log("Form values", values);

    //SET SOME DEFAULT VALUES HERE

    console.log("Record to save", record);

    const { status, message } = record.id
      ? await trackPromise(DefaultService.Entity_Update(ENTITY_API_KEY, record))
      : await trackPromise(DefaultService.Entity_Add(ENTITY_API_KEY, record));

    notify(message, status);
    if (status) {
      //setLogoImage(null);
      setRecordToEdit({});
      setShowEditForm(false);
      handleSearch();
    }
  };

  const onStatusChanged = async (values, po_status) => {
    //console.log(files);

    /* IF FILES NEED TO BE UPLOADED VIA FORM
    const formData = new FormData();
     files.forEach((file) => {
       formData.append("files[]", file);
     });
    */
    let record = values;
    console.log("Form values", values);

    //SET SOME DEFAULT VALUES HERE

    console.log("Record to save", record);

    const { status, message } =
      po_status === "accept"
        ? await trackPromise(DefaultService.PUT(`/purchase_order/accept/${record.id}`, record))
        : await trackPromise(DefaultService.PUT(`/purchase_order/reject/${record.id}`, record));

    notify(message, status);
    if (status) {
      //setLogoImage(null);
      setRecordToEdit({});
      setShowEditForm(false);
      handleSearch();
    }
  };
  const onFinishFailed = async () => {
    notify("Please provide all the required input fields", false);
  };
  const style = { boxShadow: "0 0 11px rgba(33,33,33,.2)" };

  const exportToAccountingSoftware = async () => {
    notify("not implemented yet");
  };
  const { t } = useTranslation();
  return (
    <>
      <div className="flex mb-2">
        <PageTitle />
        <h3 className="push-right text-right"></h3>
      </div>
      <Row gutter={16}>
        <Col className="gutter-row" span={24}>
          <CustomDataGrid
            data={data}
            columns={[
              { dataField: "job_id", align: "left", dataType: "string", caption: t("general_job_id") },
              { dataField: "id", align: "left", dataType: "string", caption: t("general_po_number") },
              { dataField: "supplier.name", align: "left", dataType: "string", caption: t("general_supplier") },
              { dataField: "field_technician.display_name", align: "left", dataType: "string", caption: t("general_technician") },
              {
                dataField: "status_name",
                align: "left",
                dataType: "string",
                caption: t("label_status"),
                cellRender: (item) => {
                  let status = item.data.status_name.toLowerCase();
                  let className = "text-info";

                  if (status === "accepted") className = "text-success";
                  if (status === "rejected") className = "text-danger";

                  return <span className={className}>{item.data.status_name}</span>;
                },
              },
              // {
              //   caption: "View",
              //   cellRender: (item) => {
              //     return (
              //       <Button
              //         onClick={() => {
              //           //console.log(item.data);
              //           handleEdit(item.data);
              //         }}
              //       >
              //         View PO
              //       </Button>
              //     );
              //   },
              // },
            ]}
            ENTITY={"PO Item"}
            ENTITY_PLURAL={"PO Items"}
            canDelete={false}
            canEdit={true}
            canView={true}
            editHandler={handleEdit}
          />
        </Col>
      </Row>

      {showEditForm && recordToEdit && (
        <Form_PurchaseOrders
          form={form}
          showForm={showEditForm}
          recordToEdit={recordToEdit}
          handleCancel={handleCancel}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onStatusChanged={onStatusChanged}
          exportToAccountingSoftware={exportToAccountingSoftware}
          ENTITY={ENTITY}
          data={{
            organisation,
          }}
        />
      )}
    </>
  );
};

export default PurchaseOrders;
