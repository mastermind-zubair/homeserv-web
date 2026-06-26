import { useEffect, useContext, useState } from "react";
import { FormButtons } from "Components/Common/FormButtons";
import Context from "Store/Context";
import { useTranslation } from "react-i18next";
import LookupService from "Services/API/LookupService";
import { trackPromise } from "react-promise-tracker";

const { Modal, Form, Input, Radio, Select } = require("antd");

const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_LinkAccountingSoftware = ({
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
  const [accountingSoftware, setAccountingSoftware] = useState();

  useEffect(async () => {
    //recordToEdit.expiry_date = moment(recordToEdit.expiry_date).format("YYYY-MM-DD");
    form.setFieldsValue(recordToEdit);

    let sfs = await trackPromise(LookupService.AccountingSoftware());
    setAccountingSoftware(sfs);
  }, [form, recordToEdit]);

  return (
    <Modal
      title={t("general_add_new_soft_int")}
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
          <Form.Item name="client_id" hidden />
          <Form.Item name="client_secret" hidden />
          <Form.Item
            name="software"
            label={t("general_software")}
            className="one-row-item"
            rules={[
              { required: true, message: "Please provide a software name" },
            ]}
          >
            <Select options={accountingSoftware} />
          </Form.Item>
          <Form.Item
            name="details"
            label={t("dashboard_job_search_details")}
            className="one-row-item"
            rules={[{ required: true, message: "Please enter a title here" }]}
          >
            <Input placeholder={t("general_enter_a_code")} />
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

export default Form_LinkAccountingSoftware;
