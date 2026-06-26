import { FormButtons } from "Components/Common/FormButtons";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import Context from "Store/Context";

const { Modal, Form, Input, Checkbox, Radio } = require("antd");
const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_JobPriority = ({ form, showForm, recordToEdit, handleCancel, onFinish, onFinishFailed, ENTITY }) => {
  const { t } = useTranslation();
  const { curOrg: organisation } = useContext(Context);
  return (
    <Modal
      title={t("general_add_job_pri")}
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
          name="name"
          label={t("quick_setup_job_priorities_title_job_priority")}
          rules={[{ required: true, message: "Please input your job priority!" }]}
          hasFeedback
        >
          <Input placeholder={t("quick_setup_job_priorities_title_job_priority")} />
        </Form.Item>
        <Form.Item name="fee" label={t("quick_setup_job_priorities_grid_fee")}>
          <Input placeholder={t("quick_setup_job_priorities_grid_fee")} />
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

export default Form_JobPriority;
