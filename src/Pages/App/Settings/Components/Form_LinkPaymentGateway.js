import { useEffect, useContext, useState } from "react";
import { FormButtons } from "Components/Common/FormButtons";
import Context from "Store/Context";
import { useTranslation } from "react-i18next";
import LookupService from "Services/API/LookupService";
import { trackPromise } from "react-promise-tracker";

const { Modal, Form, Input, Radio, Select } = require("antd");

const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_LinkPaymentGateway = ({
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
  const [paymentGateway, setPaymentGateway] = useState();

  useEffect(async () => {
    //recordToEdit.expiry_date = moment(recordToEdit.expiry_date).format("YYYY-MM-DD");
    form.setFieldsValue(recordToEdit);

    //let sfs = await trackPromise(LookupService.PaymetGateway());
    setPaymentGateway([{value:"STRIPE",label:"STRIPE"}]);
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
        <b>{t("side_menu_dropdown_organization_title")} </b>
        <b className="text-danger">{organisation && organisation.name}</b>
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
            label="Payment Gateway"
            className="one-row-item"
            rules={[{ required: true, message: "Please provide a payment gateway name" }]}
          >
            <Select options={paymentGateway} />
          </Form.Item>
          <Form.Item
            name="published_key"
            label="Published Key"
            className="one-row-item"
            rules={[{ required: true, message: "Please enter a published key" }]}
          >
            <Input placeholder="enter a published key" />
          </Form.Item>
          <Form.Item
            name="secret_key"
            label="Secret Key"
            className="one-row-item"
            rules={[{ required: true, message: "Please enter a secret key" }]}
          >
            <Input  placeholder="enter a secret key" />
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

export default Form_LinkPaymentGateway;
