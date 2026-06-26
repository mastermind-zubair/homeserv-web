import { FormButtons } from "Components/Common/FormButtons";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import Context from "Store/Context";

const { Modal, Form, Input, Checkbox, Radio } = require("antd");
const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_DiscountTag = ({ form, showForm, recordToEdit, handleCancel, onFinish, onFinishFailed, ENTITY }) => {
  const { t } = useTranslation();
  const { curOrg: organisation } = useContext(Context);
  return (
    <Modal
      title={t("general_add_edit_dis_job_tag")}
      visible={showForm}
      // onOk={handleSave}
      onCancel={handleCancel}
      footer={[<FormButtons {...{ form, handleCancel, ENTITY }} />]}
    >
      <LoadingPanelForPopup area="modal" />
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
          name="name"
          label={t("general_add_edit_dis_job_tag")}
          rules={[{ required: true, message: "Please input your discount tag!" }]}
          hasFeedback
        >
          <Input placeholder={t("general_add_edit_dis_job_tag")} />
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

export default Form_DiscountTag;
