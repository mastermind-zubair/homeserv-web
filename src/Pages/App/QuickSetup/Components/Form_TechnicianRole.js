import { FormButtons } from "Components/Common/FormButtons";
import { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import Context from "Store/Context";
const { Modal, Form, Input, Select, Checkbox, Radio } = require("antd");
const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_TechnicianRole = ({
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
  const { curOrg: organisation } = useContext(Context);
  const [industries, setIndustries] = useState();
  useEffect(() => {
    if (data && data.industries) setIndustries(data.industries);
  }, [data]);
  return (
    <Modal
      title={t("general_add_edi_tec_rol")}
      visible={showForm}
      // onOk={handleSave}
      onCancel={handleCancel}
      footer={[<FormButtons {...{ form, handleCancel, ENTITY }} />]}
    >
      <LoadingPanelForPopup />{" "}
      <div className="mb-5 text-right">
        <b>{t("side_menu_dropdown_organization_title")}</b>
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
        <Form.Item hidden name="file_size" />
        <Form.Item hidden name="mime_type" />
        <Form.Item
          name="name"
          label={t("quick_setup_technician_role_grid_technician_role")}
          rules={[{ required: true, message: `Please input your ${ENTITY} name!` }]}
          hasFeedback
        >
          <Input placeholder={t("quick_setup_technician_role_grid_technician_role")} />
        </Form.Item>
        <Form.Item
          name="industry_id"
          label={t("quick_setup_service_types_grid_industry")}
          rules={[{ required: true, message: "Please select an industry" }]}
        >
          <Select
            showSearch
            style={{ width: 200 }}
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

export default Form_TechnicianRole;
