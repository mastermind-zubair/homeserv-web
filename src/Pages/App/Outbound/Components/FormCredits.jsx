import { useEffect } from "react";
import { FormButtons } from "Components/Common/FormButtons";
import { useTranslation } from "react-i18next";

import _ from "lodash";
const { Modal, Form, Input, Radio, Select, DatePicker } = require("antd");

const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const FormCredits = ({
  form,
  showForm,
  recordToEdit,
  handleCancel,
  onFinish,
  onFinishFailed,
  ENTITY,
  currency,
  data,
}) => {
  const { t } = useTranslation();
  const amounts = [10, 20, 50, 100, 200, 500];

  useEffect(() => {
    form.setFieldsValue(recordToEdit);
  }, [form, recordToEdit]);

  return (
    <Modal
      title={t("outbound_credits_add_new_credit")}
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
            name="card_number"
            label={t("general_card_number")}
            className="one-row-item"
            rules={[{ required: true, message: "Please provide card number" }]}
          >
            <Input placeholder="Enter card number" />
          </Form.Item>
          <Form.Item
            name="card_expiration_date"
            label={t("general_card_expiration_date")}
            className="one-row-item"
            rules={[{ required: true, message: "Please provide card expiration date" }]}
          >
            {/* <Input placeholder="Enter card expiration" /> */}
            <DatePicker placeholder="Select card expiration date" picker="month" />
          </Form.Item>
          <Form.Item
            name="card_cvc"
            label={t("general_card_cvc")}
            className="one-row-item"
            rules={[{ required: true, message: "Please provide card cvc" }]}
          >
            <Input placeholder="Enter card cvc" />
          </Form.Item>
          <Form.Item
            name="card_amount"
            label={t("general_credits_amount")}
            initialValue={true}
            className="one-row-item"
          >
            <Radio.Group>
              {amounts.map((amount) => (<Radio.Button value={amount}>{amount + " " + currency}</Radio.Button>))}
            </Radio.Group>
          </Form.Item>
        </Form>   
    </Modal>
  );
};

export default FormCredits;
