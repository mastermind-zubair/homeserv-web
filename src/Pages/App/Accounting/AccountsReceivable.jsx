import React, {
  useState,
  useContext,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import {
  Row,
  Col,
  Form,
  Button,
  InputNumber,
  Typography,
  Card,
  Modal,
} from "antd";
import PageTitle from "../_Common/PageTitle";
import Form_AccountsReceivable from "./Components/Form_AccountsReceivable";
import Form_CreditCardPayment from "./Components/Form_CreditCardPayment";
import DefaultService from "Services/API/DefaultService";
import { trackPromise } from "react-promise-tracker";
import Context from "Store/Context";
import { notify } from "Services/ToastService";
import CustomDataGrid from "Components/DevEx/CustomDataGrid";
import { useTranslation } from "react-i18next";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { t } from "i18next";

const AccountsReceivable = (props) => {
  const DG = "dgAccountsReceivable";
  const ENTITY_API_KEY = "Accounting_Invoice";
  const ENTITY = "Invoice";
  const ENTITY_PLURAL = "Invoices";

  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);
  const [showCreditForm, setShowCreditForm] = useState(false);
  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();

  const { curOrg: organisation } = useContext(Context);
  const [dateFormat, setDateFormat] = useState("MM-dd-yyyy");
  const [stripePromise, setStripePromise] = useState();

  useEffect(async () => {
    if (organisation) {
      await handleSearch();
      setDateFormat(organisation.date_format);

      const { data: apiKeys } = await trackPromise(
        DefaultService.GET(`/payment_gateway/f_t/stripe/${organisation.id}`)
      );
      console.log("apiKeys", apiKeys);
      setStripePromise(loadStripe(apiKeys));
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
      DefaultService.Entity_List(ENTITY_API_KEY, {
        organisation_id: organisation.id,
      })
    );
    notify(message, status);
    setData(data);
  }, [organisation]);

  const onExporting = (e) => {};

  const handleCancel = () => {
    setShowEditForm(false);
  };

  const displayCreditForm = () => {
    setShowCreditForm(true);
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
        ? await trackPromise(
            DefaultService.PUT(`/purchase_order/accept/${record.id}`, record)
          )
        : await trackPromise(
            DefaultService.PUT(`/purchase_order/reject/${record.id}`, record)
          );

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

  const exportToAccountingSoftware = async (record) => {
    //notify("not implemented yet");
    const { status, message } = await trackPromise(
      DefaultService.POST("/third_party/publish_invoice", {
        invoice_data: record
      })
    );
    if (status) {
      await handleSearch();
      notify(
        "Invoice successfully exported to third party accounting software",
        status
      );
    } else {
      notify(
        "Failed to export invoice to third party accounting software",
        status
      );
    }
  };

  const handleCancelCreditForm = () => {
    setShowCreditForm(false);
    setShowEditForm(true);
  };

  const style = { boxShadow: "0 0 11px rgba(33,33,33,.2)" };
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
              {
                dataField: "id",
                align: "left",
                dataType: "string",
                caption: t("general_invoice#"),
              },
              {
                dataField: "job.customer.full_name",
                align: "left",
                dataType: "string",
                caption: t("general_client_name"),
              },
              {
                dataField: "job_id",
                align: "left",
                dataType: "string",
                caption: t("general_job_id"),
              },
              {
                dataField: "invoice_date",
                align: "left",
                dataType: "date",
                caption: t("general_invoice_date"),
                format: dateFormat,
              },
              {
                dataField: "status",
                align: "left",
                dataType: "string",
                caption: t("label_status"),
                cellRender: (item) => {
                  let status = item.data.status.toLowerCase();
                  let className = "text-info";

                  if (status === "paid") className = "text-success";
                  if (status === "pending") className = "text-danger";

                  return <span className={className}>{item.data.status}</span>;
                },
              },
              {
                dataField: "third_party_integrations",
                align: "left",
                dataType: "string",
                caption: "Accounting",
                cellRender: (item) => {
                  let status = item.data.third_party_integrations[0] ? "Pushed to " + item.data.third_party_integrations[0].software[0].toUpperCase() + item.data.third_party_integrations[0].software.slice(1).toLowerCase() : "";
                  let className = "text-success";
                  return <strong className={className}>{status}</strong>;
                },
              },
            ]}
            ENTITY={"Account Receivable"}
            ENTITY_PLURAL={"Account Receivables"}
            canDelete={false}
            canEdit={true}
            canView={true}
            editHandler={handleEdit}
          />
        </Col>
      </Row>

      {showEditForm && recordToEdit && (
        <Form_AccountsReceivable
          form={form}
          showForm={showEditForm}
          recordToEdit={recordToEdit}
          handleCancel={handleCancel}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onStatusChanged={onStatusChanged}
          exportToAccountingSoftware={exportToAccountingSoftware}
          displayCreditForm={displayCreditForm}
          ENTITY={ENTITY}
          dateFormat={dateFormat}
          data={{
            organisation,
          }}
        />
      )}
      {stripePromise && (
        <Elements stripe={stripePromise}>
          {showCreditForm && (
            <>
              <Form_CreditCardPayment
                form={form}
                showForm={showCreditForm}
                recordToEdit={recordToEdit}
                handleCancel={handleCancelCreditForm}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                displayCreditForm={displayCreditForm}
              />
            </>
          )}{" "}
        </Elements>
      )}
    </>
  );
};

export default AccountsReceivable;
