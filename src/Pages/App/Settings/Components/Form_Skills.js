import { FormButtons } from "Components/Common/FormButtons";
import { useTranslation } from "react-i18next";

const { Modal, Form, Input, Checkbox } = require("antd");
const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_Industry = ({ form, showForm, recordToEdit, handleCancel, onFinish, onFinishFailed, ENTITY }) => {
  const { t } = useTranslation();
  return (
    <Modal
      title={t("quick_setup_industries_modal_add_edit_industry", { ENTITY })}
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
        <Form.Item
          name={t("quick_setup_industries_modal_form_name")}
          label={t("quick_setup_industries_modal_form_industry_name")}
          rules={[{ required: true, message: "Please input your industry name!" }]}
          hasFeedback
        >
          <Input placeholder={t("quick_setup_industries_modal_form_industry_name")} />
        </Form.Item>
        <Form.Item name="description" label={t("quick_setup_industries_modal_form_description")}>
          <Input.TextArea placeholder={t("quick_setup_industries_modal_form_description_here")} />
        </Form.Item>

        <Form.Item name="is_active" valuePropName="checked">
          <Checkbox>{t("quick_setup_industries_modal_form_active?")}</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form_Industry;
