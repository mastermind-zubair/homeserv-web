import { useEffect } from "react";
import { FormButtons } from "Components/Common/FormButtons";
import { useTranslation } from "react-i18next";

const { Modal, Form, Input, Radio } = require("antd");

const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_Supplier = ({ form, showForm, recordToEdit, handleCancel, onFinish, onFinishFailed, ENTITY, data }) => {
  const { t } = useTranslation();
  useEffect(() => {
    //recordToEdit.expiry_date = moment(recordToEdit.expiry_date).format("YYYY-MM-DD");
    form.setFieldsValue(recordToEdit);
  }, [form, recordToEdit]);

  return (
    <Modal
      title={t("general_add_edit_supplier")}
      visible={showForm}
      width={480}
      // onOk={handleSave}
      onCancel={handleCancel}
      footer={[<FormButtons {...{ form, handleCancel, ENTITY }} />]}
    >
      <LoadingPanelForPopup />
      <div className="mb-5 text-right">
        <b> {t("side_menu_dropdown_organization_title")} </b>
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
          size="middle"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item name="id" hidden />
          <Form.Item name="organisation_id" hidden />
          <Form.Item
            name="name"
            label={t("general_name")}
            className="two-row-item"
            rules={[{ required: true, message: "Please provide a name" }]}
          >
            <Input placeholder="Enter a name" />
          </Form.Item>
          <Form.Item
            name="account_number"
            label={t("general_account_number")}
            className="two-row-item"
            rules={[{ required: true, message: "Please enter an account number here" }]}
          >
            <Input placeholder="Enter an account number" />
          </Form.Item>

          <Form.Item
            name="address"
            label={t("quick_setup_office_users_form_address")}
            className="one-row-item"
            rules={[{ required: true, message: "Please enter address" }]}
          >
            <Input.TextArea placeholder="Enter address" />
            {/* <InputNumber   addonBefore="$"  defaultValue={0.0} /> */}
          </Form.Item>

          <Form.Item
            name="first_name"
            label={t("quick_setup_office_users_form_first_name")}
            className="two-row-item"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input placeholder="Enter first name" />
          </Form.Item>
          <Form.Item
            name="last_name"
            label={t("quick_setup_office_users_form_last_name")}
            className="two-row-item"
            rules={[{ required: true, message: "Please enter last name" }]}
          >
            <Input placeholder="Enter last name" />
          </Form.Item>

          <Form.Item
            name="email"
            label={t("quick_setup_office_users_form_email")}
            className="one-row-item"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            name="mobile"
            label={t("quick_setup_sub_contractors_form_mobile_number")}
            className="two-row-item"
            rules={[{ required: true, message: "Please enter mobile number" }]}
          >
            <Input placeholder="Enter mobile number" />
          </Form.Item>
          <Form.Item name="phone" label={t("quick_setup_sub_contractors_form_phone_number")} className="two-row-item">
            <Input placeholder="Enter phone" />
          </Form.Item>

          <Form.Item name="fax" label={t("general_fax")} className="two-row-item">
            <Input placeholder="Enter fax number" />
          </Form.Item>
          <Form.Item
            name="website"
            label={t("general_website")}
            className="two-row-item"
            rules={[{ required: true, message: "Please enter website Url" }]}
          >
            <Input placeholder="Enter website Url" />
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

export default Form_Supplier;
