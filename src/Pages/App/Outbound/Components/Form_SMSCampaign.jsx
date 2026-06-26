import { useEffect } from "react";
import { FormButtons } from "Components/Common/FormButtons";
import { useTranslation } from "react-i18next";

import _ from "lodash";
const { Modal, Form, Input, Radio, Select } = require("antd");

const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_SMSCampaign = ({
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

  useEffect(() => {
    form.setFieldsValue(recordToEdit);
  }, [form, recordToEdit]);

  return (
    <Modal
      title={t("general_add_edit_sms_camp")}
      visible={showForm}
      width={480}
      // onOk={handleSave}
      onCancel={handleCancel}
      footer={[<FormButtons {...{ form, handleCancel, ENTITY }} />]}
    >
      <LoadingPanelForPopup />
      <div className="mb-5 text-right">
        <b>{t("side_menu_dropdown_organization_title")} </b>
        <b className="text-danger">{data.organisation.name}</b>
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
          size="small"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item name="id" hidden />
          <Form.Item name="organisation_id" hidden />
          <Form.Item
            name="name"
            label={t("general_campaign_name")}
            className="one-row-item"
            rules={[{ required: true, message: "Please provide a name" }]}
          >
            <Input placeholder="Enter a name" />
          </Form.Item>
          <Form.Item>
            <Form.Item
              name="postal_code"
              label={t("general_postal_codes")}
              className="two-row-item"
            >
              <Select mode="tags" />
            </Form.Item>
            <Form.Item
              name="industry"
              label={t("general_industry")}
              className="two-row-item"
            >
              <Select mode="multiple" options={data.industries} />
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <Form.Item
              name="customer_type"
              label={t("quick_setup_customer_type_grid_heading_customer_type")}
              className="two-row-item"
            >
              <Select mode="multiple" options={data.customerTypes} />
            </Form.Item>
            <Form.Item
              name="service_type"
              label={t("general_service_type")}
              className="two-row-item"
            >
              <Select mode="multiple" options={data.serviceTypes} />
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <Form.Item
              name="job_tags"
              label={t("side_menu_navigation_quick_setup_sub_job_tags")}
              className="two-row-item"
            >
              <Select mode="multiple" options={data.jobTags} />
            </Form.Item>
            <Form.Item
              name="discount_tag"
              label={t("quick_setup_discount_tags_modal_discount_tag")}
              className="two-row-item"
            >
              <Select mode="multiple" options={data.discountTags} />
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <Form.Item
              name="job_priority"
              label={t("side_menu_navigation_reports_sub_job_priority")}
              className="two-row-item"
            >
              <Select mode="multiple" options={data.jobPriorities} />
            </Form.Item>
          </Form.Item>
          
          <Form.Item
            label={t("general_sms_body_contents")}
            name="content"
            rules={[
              {
                required: true,
                message: "Please add some sms body contents",
              },
            ]}
          >
            <Input.TextArea
              placeholder="Enter your sms body here"
              style={{ height: "200px" }}
            ></Input.TextArea>
          </Form.Item>
          <Form.Item
            name="is_active"
            label={t("label_status")}
            initialValue={true}
            className="one-row-item"
          >
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

export default Form_SMSCampaign;
