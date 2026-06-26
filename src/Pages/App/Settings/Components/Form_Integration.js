import { useEffect } from "react";
import { FormButtons } from "Components/Common/FormButtons";

const {
  Modal,
  Form,
  Select,
} = require("antd");

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
  useEffect(() => {
    //recordToEdit.expiry_date = moment(recordToEdit.expiry_date).format("YYYY-MM-DD");
    form.setFieldsValue(recordToEdit);
  }, [form, recordToEdit]);

  return (
    <Modal
      title={`Add/Edit ${ENTITY}`}
      visible={showForm}
      width={480}
      // onOk={handleSave}
      onCancel={handleCancel}
      footer={[<FormButtons {...{ form, handleCancel, ENTITY }} />]}
    >
      <LoadingPanelForPopup />
      <div className="mb-5 text-right">
        <b>Organisation: </b>
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
            label="Template File"
            className="one-row-item"
            rules={[{ required: true, message: "Please select an invoice template" }]}
          >
            <Select placeholder="Select a HTML template file" options={data.templates} />
            {/* <Select
              showSearch
              placeholder="Select a HTML template file"
              optionFilterProp="children"
              filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              options={data.templates}
            /> */}
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default Form_InvoiceTemplate;
