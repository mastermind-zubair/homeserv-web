import { useEffect, useState } from "react";
import { FormButtons } from "Components/Common/FormButtons";
import { useTranslation } from "react-i18next";
import environment from "Environment";
import template_01 from "assets/templates_thumbs/Template01.png";
import template_02 from "assets/templates_thumbs/Template02.png";
import template_03 from "assets/templates_thumbs/Template03.png";
import template_04 from "assets/templates_thumbs/Template04.png";
import template_05 from "assets/templates_thumbs/Template05.png";
import template_06 from "assets/templates_thumbs/Template06.png";
import template_07 from "assets/templates_thumbs/Template07.png";
import _ from "lodash";
const { Modal, Form, Input, Radio, Select, Image } = require("antd");

const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_MarketingCampaign = ({
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
  const [currentTemplate, setCurrentTemplate] = useState(
    recordToEdit &&
    recordToEdit.template_id &&
    data.templates &&
    _.find(data.templates, { value: recordToEdit.template_id }).label
  );

  useEffect(() => {
    //recordToEdit.expiry_date = moment(recordToEdit.expiry_date).format("YYYY-MM-DD");
    form.setFieldsValue(recordToEdit);
  }, [form, recordToEdit]);

  const getTemplateImage = () => {
    switch (currentTemplate) {
      case "Template 01": {
        return template_01;
        break;
      }
      case "Template 02": {
        return template_02;
        break;
      }
      case "Template 03": {
        return template_03;
        break;
      }
      case "Template 04": {
        return template_04;
        break;
      }
      case "Template 05": {
        return template_05;
        break;
      }
      case "Template 06": {
        return template_06;
        break;
      }
      case "Template 07": {
        return template_07;
        break;
      }
      default: {
        return template_01;
        break;
      }
    }
  };
  return (
    <Modal
      title={t("general_add_edit_mar_camp")}
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
          <Form.Item
            name="subject"
            label={t("general_subject")}
            className="one-row-item"
            rules={[
              {
                required: true,
                message: "Please provide a title for your email",
              },
            ]}
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
            name="template_id"
            label={t("general_template")}
            className="two-row-item"
            rules={[{ required: true, message: "Template is required" }]}
          //initialValue={form.getFieldValue("template_id")}
          >
            <Select
              options={data.templates}
              onChange={(val, obj) => {
                setCurrentTemplate(obj.label);
              }}
            />
          </Form.Item>
          <Form.Item className="two-row-item">
            <Image
              width={"100%"}
              src={getTemplateImage()}
              className="box box-pad"
              alt="Template preview"
            />
          </Form.Item>
          <Form.Item
            label={t("general_email_body_contents")}
            name="content"
            rules={[
              {
                required: true,
                message: "Please add some email body contents",
              },
            ]}
          >
            <Input.TextArea
              placeholder="Enter your email body here"
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

export default Form_MarketingCampaign;
