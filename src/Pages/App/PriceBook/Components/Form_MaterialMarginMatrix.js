import { useState, useEffect, useContext } from "react";
import { FormButtons } from "Components/Common/FormButtons";
import { DeleteFilled, PlusOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { getRank } from "Lib/JsHelper";
import moment from "moment";
import Context from "Store/Context";
import { useTranslation } from "react-i18next";

const {
  Modal,
  Form,
  Input,
  Select,
  Checkbox,
  Radio,
  Button,
  Image,
  Switch,
  Tabs,
  DatePicker,
  Divider,
  Row,
  Col,
  Tooltip,
  Popconfirm,
  InputNumber,
} = require("antd");

const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_BillableHourlyRate = ({
  form,
  showForm,
  recordToEdit,
  handleCancel,
  onFinish,
  onFinishFailed,
  ENTITY,
  data,
}) => {
  const { t } = useTranslation();
  const { curOrg: organisation } = useContext(Context);

  useEffect(() => {
    form.setFieldsValue(recordToEdit);
  }, [form, recordToEdit]);

  return (
    <Modal
      title={`Add/Edit ${ENTITY}`}
      visible={showForm}
      width={480}
      // onOk={handleSave}
      onCancel={handleCancel}
      footer={[<FormButtons {...{ form, handleCancel, ENTITY }} />]}
    >
      <LoadingPanelForPopup />
      <div className="mb-5 text-right">
        <b>{t("side_menu_dropdown_organization_title")}: </b>
        <b className="text-danger">{organisation && organisation.name}</b>
      </div>
      {recordToEdit && (
        <Form
          form={form}
          name={t("general_add_edit_mater")}
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
          <Form.Item name="organisation_id" hidden />
          <Form.Item
            name="industry_id"
            label={t("quick_setup_service_types_grid_industry")}
            className="two-row-item"
            rules={[{ required: true, message: "Please select an industry" }]}
          >
            <Select multiple={false} options={data.industries} />
          </Form.Item>

          <Form.Item
            name="type"
            label={t("general_margin_matrix_type")}
            className="two-row-item"
            rules={[{ required: true, message: "Please select a type" }]}
          >
            <Select multiple={false} options={data.matrixTypes} />
          </Form.Item>

          <Form.Item
            name="percentage"
            label={t("general_percentage")}
            className="two-row-item"
            rules={[{ required: true, message: "Please enter percentage" }]}
          >
            <InputNumber addonAfter="%" defaultValue={0.0} />
          </Form.Item>

          <Form.Item name="is_active" label={t("label_status")} initialValue={true} className="one-row-item">
            <Radio.Group
              options={[
                { label: t("label_active"), value: true },
                { label: t("label_inactive"), value: false },
              ]}
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default Form_BillableHourlyRate;
