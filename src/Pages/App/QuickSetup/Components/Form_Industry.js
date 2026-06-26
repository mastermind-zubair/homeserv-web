import { FormButtons } from "Components/Common/FormButtons";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import Context from "Store/Context";

const { Modal, Form, Input, Checkbox, Radio } = require("antd");
const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_Industry = ({ form, showForm, recordToEdit, handleCancel, onFinish, onFinishFailed, ENTITY }) => {
  const { t } = useTranslation();
  const { curOrg: organisation } = useContext(Context);
  return (
    <Modal
      title={t("general_add_edit_industry")}
      visible={showForm}
      // onOk={handleSave}
      onCancel={handleCancel}
      footer={[<FormButtons {...{ form, handleCancel, ENTITY }} />]}
    >
      <LoadingPanelForPopup />
      <div className="mb-5 text-right">
        <b>{t("side_menu_dropdown_organization_title")} </b>
        <b className="text-danger">{organisation && organisation.name}</b>
      </div>
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

        <Form.Item name="is_active" label={t("label_status")} initialValue={true} className="one-row-item">
          <Radio.Group
            options={[
              { label: t("label_active"), value: true },
              { label: t("label_inactive"), value: false },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form_Industry;
