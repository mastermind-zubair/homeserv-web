import { useState } from "react";
import { useEffect, useTransition } from "react";
import { FormButtons } from "Components/Common/FormButtons";
import { useTranslation } from "react-i18next";

const { Modal, Form, Select, Button } = require("antd");

const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_InvoiceTemplate = ({
  form,
  showForm,
  recordToEdit,
  handleCancel,
  onFinish,
  onFinishFailed,
  ENTITY,
  data,
}) => {
  const [selectedContent, setSelectedContent] = useState(null);
  useEffect(() => {
    form.setFieldsValue(recordToEdit);

    if (recordToEdit.template_file) {
      var sel_item = data.templates.find(
        (item) => item.value === recordToEdit.template_file
      );
      setSelectedContent(sel_item.fk);
    }
  }, [form, recordToEdit]);
  const { t } = useTranslation();

  const handleChangeTemplate = (e) => {
    var sel_item = data.templates.find((item) => item.value == e);
    setSelectedContent(sel_item.fk);
  };
  const handlePreviewClick = (e) => {
    var newWin = window.open("", "_blank", "fullscreen=yes");
    newWin.document.write(selectedContent);
  };
  return (
    <Modal
      title={t("general_add_edit_serv_inv_temp")}
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
          size="middle"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item name="id" hidden />
          <Form.Item name="organisation_id" hidden />
          <Form.Item
            name="template_file"
            label={t("general_template_file")}
            className="one-row-item"
            rules={[
              { required: true, message: "Please select an invoice template" },
            ]}
          >
            <Select
              placeholder="Select a HTML template file"
              options={data.templates}
              onChange={handleChangeTemplate}
            />
          </Form.Item>
        </Form>
      )}
      <Button onClick={handlePreviewClick}>Preview</Button>
    </Modal>
  );
};

export default Form_InvoiceTemplate;
