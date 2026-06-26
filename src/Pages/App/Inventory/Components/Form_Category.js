import { useEffect, useContext } from "react";
import { FormButtons } from "Components/Common/FormButtons";
import Context from "Store/Context";
import { useTranslation } from "react-i18next";

const { Modal, Form, Input, Select, Radio } = require("antd");

const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_Category = ({ form, showForm, recordToEdit, handleCancel, onFinish, onFinishFailed, ENTITY, data }) => {
  const { t } = useTranslation();
  const { curOrg: organisation } = useContext(Context);
  useEffect(() => {
    //recordToEdit.expiry_date = moment(recordToEdit.expiry_date).format("YYYY-MM-DD");
    form.setFieldsValue(recordToEdit);
  }, [form, recordToEdit]);

  return (
    <Modal
      title={t("general_add_edit_inventory_category")}
      visible={showForm}
      width={480}
      // onOk={handleSave}
      onCancel={handleCancel}
      footer={[<FormButtons {...{ form, handleCancel, ENTITY }} />]}
    >
      <LoadingPanelForPopup />

      <div className="mb-5 text-right">
        <b> {t("side_menu_dropdown_organization_title")} </b>
        <b className="text-danger">{organisation && organisation.name}</b>
      </div>
      {recordToEdit && (
        <Form
          form={form}
          name={t("general_add_edit_inventory_category")}
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
            name="industry_id"
            label={t("general_industry")}
            className="two-row-item"
            rules={[{ required: true, message: "Please enter industry" }]}
          >
            <Select options={data.industries} />
          </Form.Item>

          <Form.Item className="one-row-item" name="is_truck_inventory" label={t("general_truck_inventory")} initialValue={false}>
            <Radio.Group
              options={[
                { label: t("general_yes"), value: true },
                { label: t("general_no"), value: false },
              ]}
            />
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

export default Form_Category;
