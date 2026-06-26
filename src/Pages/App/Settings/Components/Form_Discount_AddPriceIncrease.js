import { useEffect, useContext } from "react";
import { FormButtons } from "Components/Common/FormButtons";
import Context from "Store/Context";
import { useTranslation } from "react-i18next";

const { Modal, Form, Select, Radio, DatePicker, InputNumber } = require("antd");

const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_Discount_AddPriceIncrease = ({
  form,
  showForm,
  recordToEdit,
  handleCancel,
  onFinish,
  onFinishFailed,
  ENTITY,
  data,
  dateFormat
}) => {
  const { t } = useTranslation();
  const { curOrg: organisation } = useContext(Context);
  useEffect(() => {
    //recordToEdit.expiry_date = moment(recordToEdit.expiry_date).format("YYYY-MM-DD");
    form.setFieldsValue(recordToEdit);
  }, [form, recordToEdit]);

  return (
    <Modal
      title={t("general_add_edit_inc_pri")}
      visible={showForm}
      width={480}
      // onOk={handleSave}
      onCancel={handleCancel}
      footer={[<FormButtons {...{ form, handleCancel, ENTITY }} />]}
    >
      <LoadingPanelForPopup />
      <div className="mb-5 text-right">
        <b>{t("side_menu_dropdown_organization_title")} </b>
        <b className="text-danger">{organisation && organisation.name}</b>
      </div>
      {recordToEdit && (
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
          <Form.Item name="organisation_id" hidden />
          <Form.Item
            name="industry_id"
            label={t("general_industry")}
            className="two-row-item"
            rules={[{ required: true, message: "Please select an industry" }]}
          >
            <Select multiple={false} options={data.industries} />
          </Form.Item>

          <Form.Item
            name="rate_increase"
            label={t("general_increased_rate")}
            className="two-row-item"
            rules={[{ required: true, message: "Please enter increased rate" }]}
          >
            <InputNumber addonAfter="%" defaultValue={0.0} />
          </Form.Item>

          <Form.Item
            name="expiry_date"
            label={t("general_expirty_date")}
            className="two-row-item"
            rules={[{ required: true, message: "Please enter an expiry" }]}
          >
            <DatePicker format={dateFormat.toUpperCase()} />
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

export default Form_Discount_AddPriceIncrease;
