import { useEffect, useContext, useState, useRef, useCallback } from "react";
import Context from "Store/Context";
import { trackPromise } from "react-promise-tracker";
import DefaultService from "Services/API/DefaultService";
import UploaderService from "Services/API/UploaderService";
import { notify } from "Services/ToastService";
import { Button, Modal, Popover, Space, Table } from "antd";
import Column from "antd/lib/table/Column";
import moment from "moment";
import ReactToPdf from "react-to-pdf";
import { t } from "i18next";
import environment from "Environment";

const Form_AccountsReceivable = ({
  form,
  showForm,
  recordToEdit,
  handleCancel,
  onFinish,
  onFinishFailed,
  onStatusChanged,
  exportToAccountingSoftware,
  displayCreditForm,
  dateFormat,
  ENTITY,
  data,
}) => {
  const { curOrg: organisation } = useContext(Context);
  const [record, setRecord] = useState({});
  const [invoicePDF, setInvoicePDF] = useState(false);
  const printRef = useRef();

  useEffect(() => {
    if (recordToEdit && recordToEdit !== null) {
      setRecord(recordToEdit);
      generatePDF(recordToEdit)
    }
  }, [recordToEdit]);


  const generatePDF = async (dtInvoice) => {
    const invoiceData = {
      invoice_id: dtInvoice.id
    }
    await trackPromise(
      DefaultService.POST(`/upload_pdf/invoice_pdf`, invoiceData).then(async ({ data }) => {
        console.log('data', data);
        setInvoicePDF(true);
      })
    );
  }

  const viewPDF = async (dtInvoice) => {
    window.open(`${environment.PATH_INVOICE_PDF}/${dtInvoice.id}.pdf`, '_blank');
  }
  return (
    record && (
      <Modal
        title={t("general_view_invoice")}
        visible={showForm}
        width={768}
        onOk={handleCancel}
        onCancel={handleCancel}
        footer={
          <div className="flex">
            {/* <Button onClick={() => onStatusChanged(record, "accept")} className="bg-success">
              Approve
            </Button>
            <Button
              danger
              type="default"
              onClick={() => onStatusChanged(record, "reject")}
              className="mr-auto bg-danger"
            >
              Reject
            </Button> */}
            {/* <ReactToPdf targetRef={printRef} filename={`Invoice - ${ recordToEdit.id }.pdf`} className="mr-auto bg-info">
              {({ toPdf }) => (
                <Button type="default" onClick={toPdf}>
                  {t("general_view_pdf")}
                </Button>
              )}
            </ReactToPdf> */}
            {invoicePDF ? <Button type="default" onClick={() => viewPDF(recordToEdit)}>
              View PDF
            </Button> : ""}
            {recordToEdit.third_party_integrations[0] ? <Button
              disabled
              type="dashed"
              className="mr-auto bg-info"
            >
              Sent to {recordToEdit.third_party_integrations[0].software}
            </Button> : <Button
              danger
              type="default"
                onClick={() => { exportToAccountingSoftware(record); handleCancel() }}
              className="mr-auto bg-warning"
            >
              {t("general_send_to_accounting_software")}
            </Button>}

            <Button
              danger
              type="default"
              onClick={() => displayCreditForm()}
              className="mr-auto bg-success"
            >
              Charge
            </Button>
            <Button danger type="dashed" onClick={handleCancel} className="ml-auto">
              {t("quick_setup_organizations_modal_button_cancel")}
            </Button>

          </div>
        }
      >
        {recordToEdit && (
          <div className="mb-5" ref={printRef}>
            <Table
              width="100%"
              size="small"
              pagination={false}
              dataSource={recordToEdit.items}
              columns={[
                {
                  title: t("general_code"),
                  key: "id",
                  dataIndex: "id",
                  width: "150",
                },
                {
                  title: t("general_title"),
                  key: "item",
                  dataIndex: "item",
                  width: "150",
                },
                {
                  title: t("quick_setup_job_tags_grid_description"),
                  key: "description",
                  dataIndex: "description",
                },
                {
                  title: t("dashboard_job_search_quantity"),
                  key: "quantity",
                  dataIndex: "quantity",
                  width: 100,
                  align: "right",
                },
                {
                  title: t("general_price"),
                  key: "amount",
                  dataIndex: "amount",
                  width: 100,
                  align: "right",
                  render: (val) => {
                    return "$" + val;
                  },
                },
                // {
                //   title: "total",
                //   key: "sub_total",
                //   dataIndex: "sub_total",
                //   width: 100,
                //   align: "right",
                //   render: (val) => {
                //     return "$" + val;
                //   },
                // },
              ]}
            />
            <Table
              size="small"
              showHeader={false}
              pagination={false}
              dataSource={[
                {
                  label: t("general_subtotal"),
                  price: recordToEdit.sub_total,
                },
                {
                  label: t("general_discount"),
                  price: recordToEdit.discount || 0,
                },
                {
                  label: t("general_gst"),
                  price: recordToEdit.tax,
                },
                {
                  label: t("dashboard_job_search_total"),
                  price: recordToEdit.total,
                },
              ]}
            >
              <Column colSpan={3}></Column>
              <Column
                title={t("general_label")}
                key="label"
                dataIndex="label"
                width={100}
                align="right"
                render={(val) => {
                  return <b>{val}</b>;
                }}
              />
              <Column
                title={t("general_price")}
                key="price"
                dataIndex="price"
                width={100}
                align="right"
                render={(val) => {
                  return <b>{"$" + val}</b>;
                }}
              />
            </Table>
            <br />
            <Table
              width="100%"
              size="small"
              pagination={false}
              dataSource={[
                {
                  invoice_date: moment(recordToEdit.invoice_date).format(dateFormat.toUpperCase()),
                  terminal_id: recordToEdit.terminal_id,
                  type: recordToEdit.payment_method,
                  payment: recordToEdit.total,
                },
                {
                  type: recordToEdit.status,
                  payment: recordToEdit.total,
                },
              ]}
            >
              <Column title={t("general_receipt")} width={150}></Column>
              <Column title={t("general_date")} key="invoice_date" dataIndex="invoice_date" width={150}></Column>
              <Column title={t("general_terminal_id")} key="terminal_id" dataIndex="terminal_id"></Column>
              <Column title={t("general_type")} key="type" dataIndex="type" width={100}></Column>
              <Column
                title={t("general_payment")}
                key="payment"
                dataIndex="payment"
                align="right"
                width={100}
                render={(val) => {
                  return <b>{"$" + val}</b>;
                }}
              ></Column>
            </Table>
          </div>
        )}
      </Modal>
    )
  );
};


export default Form_AccountsReceivable;
