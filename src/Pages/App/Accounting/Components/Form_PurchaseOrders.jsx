import { useEffect, useContext, useState } from "react";
import { FormButtons } from "Components/Common/FormButtons";
import Context from "Store/Context";
import pic from "assets/images/landing/po-details.png";
import CustomDataGrid from "Components/DevEx/CustomDataGrid";
import { format } from "date-fns";
import { MoneyFormat } from "Lib/DevExConstants";
import { trackPromise } from "react-promise-tracker";
import DefaultService from "Services/API/DefaultService";
import { notify } from "Services/ToastService";
import { useTranslation } from "react-i18next";

const { Modal, Form, Input, Select, Radio, Button, Row, Col } = require("antd");

const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_PurchaseOrders = ({
  form,
  showForm,
  recordToEdit,
  handleCancel,
  onFinish,
  onFinishFailed,
  onStatusChanged,
  exportToAccountingSoftware,
  ENTITY,
  data,
}) => {
  const { curOrg: organisation } = useContext(Context);

  const [record, setRecord] = useState({});

  useEffect(() => {
    if (recordToEdit && recordToEdit !== null) {
      setRecord(recordToEdit);
    }
  }, [recordToEdit]);

  const deleteItem = async (item) => {
    //console.log("Delete Handler", item);

    let prods = recordToEdit.products.filter((p) => p.id !== item.id);
    recordToEdit.products = prods;
    let { status, message } = await trackPromise(
      DefaultService.Entity_Update("Accounting_PurchaseOrder", recordToEdit)
    );

    notify(message, status);

    let { data } = await trackPromise(DefaultService.Entity_Get("Accounting_PurchaseOrder", recordToEdit.id));
    data.products = !data.products ? [] : data.products;
    setRecord(data);
  };

  const printPO = async (item) => {
    notify("not implemented yet");
  };
  const { t } = useTranslation();
  return (
    record && (
      <Modal
        title={t("general_add_edit_purchase_order")}
        visible={showForm}
        width={768}
        onOk={handleCancel}
        onCancel={handleCancel}
        footer={
          <div className="flex">
            <Button onClick={() => onStatusChanged(record, "accept")} className="bg-success">
              {t("general_approve")}
            </Button>
            <Button
              danger
              type="default"
              onClick={() => onStatusChanged(record, "reject")}
              className="mr-auto bg-danger"
            >
              {t("general_reject")}
            </Button>
            <Button type="default" onClick={() => printPO(record)} className="ml-auto bg-info">
              {t("general_print")}
            </Button>
            <Button
              danger
              type="default"
              onClick={() => exportToAccountingSoftware(record)}
              className="ml-auto bg-warning"
            >
              {t("general-Send_to_accounting_software")}
            </Button>
            <Button danger type="dashed" onClick={handleCancel} className="ml-auto">
              {t("quick_setup_organizations_modal_button_cancel")}
            </Button>
          </div>
        }
      >
        <div className="flex">
          <CustomDataGrid
            data={record && record.products}
            columns={[
              { caption: t("general_item_name"), dataField: "product_name", align: "left" },
              { caption: t("quick_setup_industries_modal_form_description"), dataField: "description", align: "left" },
              { caption: t("general_price"), dataField: "price", align: "center", format: MoneyFormat },
              { caption: t("dashboard_job_search_quantity"), dataField: "quantity", align: "left" },
            ]}
            ENTITY={"PO Item"}
            ENTITY_PLURAL={"PO Items"}
            deleteHandler={deleteItem}
            canDelete={true}
            canEdit={false}
            height={350}
          />
        </div>
        <br />
        <Row>
          <Col>
            <b className="text-primary">{t("general_special_instructions_by_technician:")}</b>
            <div className="flext box box-pad box grey">{record.instructions}</div>
          </Col>
        </Row>
      </Modal>
    )
  );
};

export default Form_PurchaseOrders;
