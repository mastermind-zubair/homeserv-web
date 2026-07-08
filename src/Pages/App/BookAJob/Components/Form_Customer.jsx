import { Col, Collapse, Form, Input, Modal, Row, Select, Checkbox } from "antd";
import { FormButtons } from "Components/Common/FormButtons";
import { LoadingPanelForPopup } from "Layout/LoadingPanels";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Address from "./Address";

function FormCustomer({
  form,
  showForm,
  recordToEdit,
  handleCancel,
  onFinish,
  onFinishFailed,
  ENTITY,
  data,
  organisation,
  mode = "create",
}) {
  const isCreateMode = mode === "create";
  const [SameAsContact, setSameAsContact] = useState(true);
  const requiredLabel = (text, required = false) => (
    <span>
      {text}
      {required ? <span className="text-danger"> *</span> : null}
    </span>
  );

  const handleFirstNameChange = e => {
    form.setFieldsValue({
      "contact_address.first_name": e.target.value,
      "billing_address.first_name": e.target.value,
    })
  }

  const handleLastNameChange = e => {
    form.setFieldsValue({
      "contact_address.last_name": e.target.value,
      "billing_address.last_name": e.target.value,
    })
  }

  const handleUseAsBilling = e => {
    setSameAsContact(e.target.checked);
  }
  useEffect(() => {
    if (recordToEdit && recordToEdit.id) {
      setSameAsContact(recordToEdit.use_contact_as_billing !== false);
    } else {
      setSameAsContact(true);
    }
  }, [recordToEdit]);
  const { t } = useTranslation()
  return (
    <>
      <Modal
        title={t("general_add_edit_customers")}
        visible={showForm}
        onCancel={handleCancel}
        footer={[<FormButtons {...{ form, handleCancel, ENTITY }} />]}
      >
        <LoadingPanelForPopup />{" "}
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
            name="customer_type_id"
            label={requiredLabel(t("quick_setup_customer_type_grid_heading_customer_type"), isCreateMode)}
            rules={isCreateMode ? [{ required: true, message: "Please select a customer type" }] : []}
          >
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder={t("quick_setup_customer_type_grid_heading_customer_type")}
              optionFilterProp="children"
              options={data.CustomerTypes}
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            ></Select>
          </Form.Item>
          <Form.Item
            name="email"
            label={requiredLabel(t("quick_setup_office_users_form_email"), isCreateMode)}
            rules={isCreateMode ? [{ required: true, message: `Please input your email!` }] : []}
            hasFeedback
          >
            <Input placeholder={t("quick_setup_office_users_form_email")} />
          </Form.Item>
          <Form.Item
            name="first_name"
            label={requiredLabel(t("quick_setup_office_users_form_first_name"), isCreateMode)}
            rules={isCreateMode ? [{ required: true, message: `Please input your first name!` }] : []}
            hasFeedback
          >
            <Input placeholder={t("quick_setup_office_users_form_first_name")} onChange={handleFirstNameChange} />
          </Form.Item>
          <Form.Item
            name="last_name"
            label={requiredLabel(t("quick_setup_office_users_form_last_name"), isCreateMode)}
            rules={isCreateMode ? [{ required: true, message: `Please input your last name!` }] : []}
            hasFeedback
          >
            <Input placeholder={t("quick_setup_office_users_form_last_name")} onChange={handleLastNameChange} />
          </Form.Item>
          <Collapse>
            <Collapse.Panel header="Contact Address" key={1}>
              <Address name="contact_address" form={form} mode={mode} />
              <Row>
                <Col span={24}>
                  <Form.Item name="use_contact_as_billing" valuePropName="checked">
                    <Checkbox checked={SameAsContact} onChange={handleUseAsBilling}>{t("general_use_same_as_billing")}</Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            </Collapse.Panel>
            {!SameAsContact && (
              <Collapse.Panel header="Billing Address" key={2}>
                <Address name="billing_address" form={form} mode={mode} />
              </Collapse.Panel>
            )}
          </Collapse>
          <Form.Item
            name="is_active"
            valuePropName="checked"
            label={requiredLabel(t("label_active"), isCreateMode)}
            rules={isCreateMode ? [{ required: true, message: `Please choose active status` }] : []}
          >
            <Checkbox>{t("label_active")} </Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default FormCustomer;
