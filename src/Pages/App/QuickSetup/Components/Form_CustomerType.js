import { useState, useEffect, useContext } from "react";
import { FormButtons } from "Components/Common/FormButtons";
import { useTranslation } from "react-i18next";
import Context from "Store/Context";

const { Modal, Form, Input, Select, Checkbox, Radio } = require("antd");
const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_CustomerType = ({ form, showForm, recordToEdit, handleCancel, onFinish, onFinishFailed, ENTITY, data }) => {
  const { t } = useTranslation();
  const { curOrg: organisation } = useContext(Context);
  const [bookingPageSections, setBookingPageSections] = useState();
  useEffect(() => {
    if (data && data.bookingPageSections) setBookingPageSections(data.bookingPageSections);
  }, [data]);
  return (
    <Modal
      title={t("general_add_edi_cust_typ")}
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
          label={t("quick_setup_customer_type_grid_heading_customer_type")}
          rules={[{ required: true, message: "Please input customer type!" }]}
          hasFeedback
        >
          <Input placeholder={t("quick_setup_customer_type_grid_heading_customer_type")} />
        </Form.Item>
        <Form.Item name="description" label={t("quick_setup_job_tags_grid_description")}>
          <Input.TextArea placeholder={t("quick_setup_job_tags_grid_description")} />
        </Form.Item>

        <Form.Item
          name="booking_page_sections"
          label={t("quick_setup_customer_type_grid_heading_booking_page_section")}
          rules={[{ required: true, message: "Please select at least one option" }]}
        >
          <Select
            showSearch
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder={t("quick_setup_customer_type_grid_heading_booking_page_section")}
            optionFilterProp="children"
            options={bookingPageSections}
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

export default Form_CustomerType;
