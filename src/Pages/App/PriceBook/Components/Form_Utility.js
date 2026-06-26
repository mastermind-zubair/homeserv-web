import { useEffect, useContext } from "react";
import { FormButtons } from "Components/Common/FormButtons";
import TextArea from "antd/lib/input/TextArea";
import Context from "Store/Context";
import { useTranslation } from "react-i18next";

const { Modal, Form, Input, Radio, InputNumber } = require("antd");

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
    form.resetFields();
    form.setFieldsValue(recordToEdit);
  }, [form, recordToEdit]);

  return (
    <Modal
      title={t("general_add_edit_all_utilities")}
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
            name="code"
            label={t("general_utility_code")}
            className="one-row-item"
            rules={[{ required: true, message: "Please enter a code" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label={t("quick_setup_job_tags_grid_description")}
            className="one-row-item"
            rules={[{ required: true, message: "Please enter some description" }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="cost"
            label={t("price_book_all_utilities_form_utility_cost")}
            className="one-row-item"
            rules={[{ required: true, message: "Please enter utility cost" }]}
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
