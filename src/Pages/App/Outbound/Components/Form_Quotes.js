import {
  useEffect,
  useContext,
  useState,
  createRef,
  useTransition,
} from "react";
import { FormButtons } from "Components/Common/FormButtons";
import TextArea from "antd/lib/input/TextArea";
import { TaskPhoto } from "Components/Common/Images";
import SvApiUploader from "Components/Common/SvApiUploader";
import environment from "Environment";
import Context from "Store/Context";
import CustomDataGrid from "Components/DevEx/CustomDataGrid";
import Column from "antd/lib/table/Column";
import { Link } from "react-router-dom";
import { FundViewOutlined, SettingOutlined } from "@ant-design/icons";
//import ReactToPrint from "react-to-print";
import { useRef } from "react";
import React from "react";
import ReactToPdf from "react-to-pdf";
import { useTranslation } from "react-i18next";
import { trackPromise } from "react-promise-tracker";
import DefaultService from "Services/API/DefaultService";
import { alertify, notify } from "Services/ToastService";

const {
  Modal,
  Form,
  Input,
  Radio,
  InputNumber,
  Table,
  Button,
  Space,
  Popover,
  Row,
  Col,
} = require("antd");

const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_Quotes = ({
  form,
  showForm,
  recordToEdit,
  handleCancel,
  onFinish,
  onFinishFailed,
  ENTITY,
  data,
}) => {
  const { curOrg: organisation } = useContext(Context);
  const { t } = useTranslation();
  const [elRefs, setElRefs] = useState([]);
  const [quotePDF, setQuotePDF] = useState(false);
  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(recordToEdit);

    recordToEdit?.options?.forEach((opt) => {
      generatePDF(opt.id);
    });
    setElRefs((elRefs) =>
      Array(recordToEdit.options.length)
        .fill()
        ?.map((_, i) => elRefs[i] || createRef())
    );
  }, [form, recordToEdit]);

  const generatePDF = async (quoteID) => {
    const quoteData = {
      quote_option_id: quoteID,
    };
    setQuotePDF(true);
    await trackPromise(
      DefaultService.POST(`/upload_pdf/quote_pdf`, quoteData).then(
        async ({ data }) => {
          console.log("data", data);
          setQuotePDF(true);
        }
      )
    );
  };

  const viewPDF = async (optionID) => {
    console.log("optionName", optionID);
    window.open(`${environment.PATH_QUOTE_PDF}/${optionID}.pdf`, "_blank");
  };

  // const confirmJob = async (optionId) => {
  //   //console.log(recordToEdit.job_id, optionId);
  //   const { data, status, message } = await trackPromise(
  //     DefaultService.PUT(`/job/confirmed/${recordToEdit.job_id}`, {
  //       quote_option_id: optionId,
  //     })
  //   );

  const approveEstimate = async (optionId) => {
    //console.log(recordToEdit.job_id, optionId);
    const { data, status, message } = await trackPromise(
      DefaultService.POST(`/job/approved_estimate/${recordToEdit.job_id}`, {
        quote_option_id: optionId,
        customer_sign: "none",
      })
    );

    notify(message, status);
    if (status)
      alertify(
        "Job approved successfully with selected quote option. Please check it in discpatcher",
        true
      );
    else {
      alertify("Job was not marked approved with selected quote option", false);
    }
  };

  function getOptionsMenu(i, optionID) {
    return (
      <Space direction="vertical">
        {/* <Button
          visible={false}
          type="link"
          onClick={() => {
            confirmJob(optionID);
          }}
        >
          {t("general_confirm_job")}
        </Button> */}
        <Button
          type="link"
          onClick={() => {
            approveEstimate(optionID);
          }}
        >
          {t("general_approve_estimate")}
        </Button>
        {/* <ReactToPdf targetRef={elRefs[i]} filename={`${optionName} - quote.pdf`}>
          {({ toPdf }) => (
            <Button type="link" onClick={toPdf}>
              View PDF
            </Button>
          )}
        </ReactToPdf> */}
        {quotePDF ? (
          <Button type="link" onClick={() => viewPDF(optionID)}>
            View PDF
          </Button>
        ) : (
          ""
        )}
      </Space>
    );
  }

  return (
    <Modal
      title={`Edit ${ENTITY}`}
      visible={showForm}
      width={768}
      // onOk={handleSave}
      onCancel={handleCancel}
      footer={[<FormButtons {...{ form, handleCancel, ENTITY }} />]}
    >
      <LoadingPanelForPopup />
      <div className="mb-5 text-right">
        <b>Organisation: </b>
        <b className="text-danger">{organisation?.name}</b>
      </div>
      {recordToEdit &&
        recordToEdit?.options?.map((opt, i) => {
          return (
            <div className="mb-5" key={`quotes-${i}`}>
              <div className="flex">
                <div style={{ width: "200px" }}>
                  <h3>{opt.title}</h3>
                </div>
                <div className="ml-auto">
                  <Space direction="horizontal">
                    <Popover
                      placement="bottomRight"
                      title="Quote Options"
                      content={getOptionsMenu(i, opt.id)}
                      trigger="hover"
                    >
                      <Button>
                        <i className="fas fa-bars mr-2"></i> {""} Options
                      </Button>
                    </Popover>
                  </Space>
                </div>
              </div>
              <p ref={elRefs[i]}>
                <QuoteOption {...{ opt }} />
              </p>
            </div>
          );
        })}
    </Modal>
  );
};

export default Form_Quotes;

export const QuoteOption = (props) => {
  const opt = props.opt;
  return (
    <div>
      <Table
        size="small"
        pagination={false}
        dataSource={opt.items}
        columns={[
          {
            title: "Code",
            key: "item_code",
            dataIndex: "org_part_number",
          },
          {
            title: "Title",
            key: "title",
            dataIndex: "title",
          },
          {
            title: "Description",
            key: "description",
            dataIndex: "description",
          },
          {
            title: "Quantity",
            key: "quantity",
            dataIndex: "quantity",
            width: 100,
            align: "right",
          },
          {
            title: "Price",
            key: "price",
            dataIndex: "price",
            width: 100,
            align: "right",
            render: (val) => {
              return "$" + val;
            },
          },
          {
            title: "total",
            key: "sub_total",
            dataIndex: "sub_total",
            width: 100,
            align: "right",
            render: (val) => {
              return "$" + val;
            },
          },
        ]}
      />
      <Table
        size="small"
        showHeader={false}
        pagination={false}
        dataSource={[
          {
            label: "Subtotal",
            price: opt.sub_total,
          },
          {
            label: "Discount",
            price: opt.discount || 0,
          },
          {
            label: "GST",
            price: opt.tax,
          },
          {
            label: "Total",
            price: opt.amount,
          },
        ]}
      >
        <Column colSpan={3}></Column>
        <Column
          title="label"
          key="label"
          dataIndex="label"
          width={100}
          align="right"
          render={(val) => {
            return <b>{val}</b>;
          }}
        />
        <Column
          title="Price"
          key="price"
          dataIndex="price"
          width={100}
          align="right"
          render={(val) => {
            return <b>{"$" + val}</b>;
          }}
        />
      </Table>
    </div>
  );
};
