import { FormButtons } from "Components/Common/FormButtons";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Context from "Store/Context";

const { Modal, Form, Input, Checkbox, Select, Radio } = require("antd");
const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_JobTags = ({ form, showForm, recordToEdit, handleCancel, onFinish, onFinishFailed, ENTITY, data }) => {
  const { t } = useTranslation();
  const { curOrg: organisation } = useContext(Context);
  const [industries, setIndustries] = useState();

  useEffect(() => {
    if (data && data.industries) {
      setIndustries(data.industries);
    }
  }, [data]);
  return (
    <Modal
      title={t("general_add_edit_job_tag")}
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
          label={t("quick_setup_job_tags_modal_tag_name")}
          rules={[{ required: true, message: "Please input your job tag!" }]}
          hasFeedback
        >
          <Input placeholder={t("quick_setup_job_tags_modal_tag_name")} />
        </Form.Item>
        <Form.Item
          name="industry_id"
          label={t("general_industry")}
          rules={[{ required: true, message: "Please select an industry" }]}
        >
          <Select
            showSearch
            placeholder={t("quick_setup_service_types_form_select_an_industry")}
            optionFilterProp="children"
            options={industries}
            filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          ></Select>
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

export default Form_JobTags;
