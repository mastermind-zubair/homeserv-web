import { useEffect, useContext, useTransition } from "react";
import { FormButtons } from "Components/Common/FormButtons";
import Context from "Store/Context";
import { useTranslation } from "react-i18next";

const { Modal, Form, Select, Radio, InputNumber } = require("antd");


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
      title={t("general_add/edit")}
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
            label={t("quick_setup_service_types_grid_industry")}
            className="two-row-item"
            rules={[{ required: true, message: "Please select an industry" }]}
          >
            <Select multiple={false} options={data.industries} />
          </Form.Item>

          <Form.Item
            name="rate"
            label={t("side_menu_navigation_price_book_sub_billable_hourly_rate")}
            className="two-row-item"
            rules={[{ required: true, message: "Please enter hourly rate" }]}
          >
            <InputNumber addonBefore="$" defaultValue={0.0} />
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
