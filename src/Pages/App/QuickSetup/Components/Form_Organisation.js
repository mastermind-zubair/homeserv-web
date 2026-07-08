import { FormButtons } from "Components/Common/FormButtons";
import { useEffect, useState } from "react";
import FileBase64 from "react-file-base64";
import { useTranslation } from "react-i18next";
import time_zone from "../../../../Data/timezone_only.json";
const {
  Row,
  Col,
  Button,
  Modal,
  Image,
  Form,
  Input,
  Switch,
  InputNumber,
  DatePicker,
  Select,
  Typography,
  Tooltip,
  Descriptions,
} = require("antd");

const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_Organisation = ({
  form,
  showForm,
  recordToEdit,
  handleCancel,
  onFinish,
  onFinishFailed,
  handleUploadChange,
  logoImage,
  mode = "create",
  ENTITY,
}) => {
  const { t } = useTranslation();
  const [showTimeZone, setShowTimeZone] = useState(false);
  const [timeZoneFilter, setTimeZoneFilter] = useState("");
  const isCreateMode = mode === "create";
  const requiredRules = (required, message) =>
    required ? [{ required: true, message }] : [];
  const requiredLabel = (label, required) => (
    <span>
      {required ? <span className="text-danger">* </span> : null}
      {label}
    </span>
  );

  const currencies = [
    { label: "USD", value: 1 },
    { label: "AUD", value: 2 },
    { label: "PKR", value: 3 },
  ];

  const utcOffsetOptions = [];
  for (let i = -24; i <= 24; i++) {
    utcOffsetOptions.push({
      label: `GMT${i >= 0 ? "+" : ""}${i / 2}`,
      value: i * 30,
    });
  }

  useEffect(() => {}, [recordToEdit]);
  const setTimeZone = (value) => {
    form.setFieldsValue({ utc_offset_minutes: value * 60 });
  };
  return (
    <>
      <Modal
        title={t("quick_setup_modal_heading")}
        visible={showForm}
        // onOk={handleSave}
        onCancel={handleCancel}
        footer={[<FormButtons {...{ form, handleCancel, ENTITY }} />]}
      >
        <LoadingPanelForPopup />
        <Form
          form={form}
          name={`form-${ENTITY}`}
          layout="vertical"
          initialValues={recordToEdit}
          labelCol={{}}
          wrapperCol={{}}
          autoComplete="off"
          size="middle"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item name="id" hidden />
          <Form.Item name="credits" hidden />
          <Form.Item
            name="name"
            label={t("quick_setup_organizations_modal_form_business_name")}
            rules={[
              {
                required: true,
                message: t(
                  "quick_setup_organizations_modal_form_message_please_input_your_organisation_name"
                ),
              },
            ]}
            hasFeedback
          >
            <Input
              placeholder={t(
                "quick_setup_organizations_modal_form_business_name"
              )}
              value="TEST"
            />
          </Form.Item>
          <Form.Item
            name="address"
            label={t("quick_setup_organizations_modal_form_business_address")}
            rules={requiredRules(
              isCreateMode,
              "Business address is required"
            )}
          >
            <Input
              placeholder={t(
                "quick_setup_organizations_modal_form_business_address"
              )}
            />
          </Form.Item>
          <Form.Item
            name="acn_abn"
            label={t("quick_setup_organizations_modal_form_business_acn_abn")}
            rules={requiredRules(isCreateMode, "Business ACN/ABN is required")}
          >
            <Input
              placeholder={t(
                "quick_setup_organizations_modal_form_business_acn_abn"
              )}
            />
          </Form.Item>
          <Form.Item
            name="bsb_number"
            label={t("quick_setup_organizations_modal_form_bsb_number")}
            rules={requiredRules(
              isCreateMode,
              t("quick_setup_organizations_modal_form_please_input_your_bsb_no.")
            )}
          >
            <Input
              placeholder={t(
                "quick_setup_organizations_modal_form_please_input_your_bsb_no."
              )}
            />
          </Form.Item>
          <Form.Item
            name="account_number"
            label={t("quick_setup_organizations_modal_form_account_no.")}
            rules={requiredRules(
              isCreateMode,
              t(
                "quick_setup_organizations_modal_form_message_please_input_your_account_no."
              )
            )}
          >
            <Input
              placeholder={t(
                "quick_setup_organizations_modal_form_account_no."
              )}
            />
          </Form.Item>
          <Form.Item
            name="contractor_license_number"
            label={t(
              "quick_setup_organizations_modal_form_contractor_license_no."
            )}
          >
            <Input
              placeholder={t(
                "quick_setup_organizations_modal_form_contractor_license_no."
              )}
            />
          </Form.Item>

          <Form.Item
            name="tax_rate"
            label={t("general_tax_rate")}
            rules={[
              {
                required: true,
                message: "Tax rate is required",
              },
            ]}
          >
            <InputNumber addonAfter="%" defaultValue={0.0} />
          </Form.Item>

          <Form.Item
            name="financial_year_start"
            label={t("general_financial_month_start")}
            rules={[
              {
                required: true,
                message: "Financial year start date is required.",
              },
            ]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            name="date_format"
            label={t("general_date_format")}
            initialValue={"yyyy-MM-dd"}
            rules={[
              {
                required: true,
                message: "Default date format is required.",
              },
            ]}
          >
            {/* <Input placeholder="Date Format" /> */}
            <Select
              options={[
                { label: "YYYY-MM-DD", value: "yyyy-MM-dd" },
                { label: "DD-MM-YYYY", value: "dd-MM-yyyy" },
                { label: "MM-DD-YYYY", value: "MM-dd-yyyy" },
                { label: "YYYY/MM/DD", value: "yyyy/MM/dd" },
                { label: "DD/MM/YYYY", value: "dd/MM/yyyy" },
                { label: "MM/DD/YYYY", value: "MM/dd/yyyy" },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="utc_offset_minutes"
            label={t("general_time_zone")}
            initialValue={0}
            rules={[
              {
                required: true,
                message: "UTC offset is required.",
              },
            ]}
          >
            <Select options={utcOffsetOptions} />
          </Form.Item>
          <Form.Item>
            <Button
              type="link"
              onClick={() => {
                setShowTimeZone(true);
              }}
            >
              Find your Time zone
            </Button>
          </Form.Item>
          <Form.Item
            name="currency_id"
            label={t("general_default_currency")}
            rules={[
              {
                required: true,
                message: "Default currency is required.",
              },
            ]}
          >
            <Select
              options={currencies}
              placeholder="Select a default currency"
            />
          </Form.Item>
          <Form.Item
            valuePropName="checked"
            name="is_default"
            label={t(
              "quick_setup_organizations_modal_form_make_default_organization"
            )}
            rules={requiredRules(isCreateMode, "Default organisation value is required")}
          >
            <Switch
              checkedChildren={
                <span>{t("quick_setup_organizations_modal_form_default")}</span>
              }
            />
          </Form.Item>
          <Form.Item
            name="business_logo"
            label={requiredLabel(t("general_logo_only_jpg_png_bmp"), isCreateMode)}
            wrapperCol={{}}
            rules={[
              {
                validator: () => {
                  if (!isCreateMode || logoImage || recordToEdit?.business_logo) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Logo is required"));
                },
              },
            ]}
          >
            {recordToEdit && recordToEdit["business_logo"] && (
              <Image
                src={`data:image/jpeg;base64,${recordToEdit["business_logo"]}`}
                style={{ width: "100px" }}
              />
            )}
            <FileBase64 multiple={false} onDone={handleUploadChange} />

            {/* IF FILES TO BE UPLOADED WITH FORM INSTEAD OF BASE64
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Select Company Logo</Button>
              </Upload> 
              */}
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        visible={showTimeZone}
        width={1000}
        onCancel={() => {
          setShowTimeZone(false);
        }}
      >
        <Row>
          <Col span={24}>
            <Input
              placeholder="Search"
              onChange={(e) => {
                setTimeZoneFilter(e.target.value);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Descriptions title="Timezone information" bordered>
              {time_zone
                .filter((v) =>
                  v.label.toLowerCase().includes(timeZoneFilter.toLowerCase())
                )
                .map((v) => (
                  <Descriptions.Item label={v.label}>
                    <Button
                      type="link"
                      onClick={() => {
                        setTimeZone(v.value);
                        setShowTimeZone(false);
                      }}
                    >
                      {v.value}
                    </Button>
                  </Descriptions.Item>
                ))}
            </Descriptions>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default Form_Organisation;
