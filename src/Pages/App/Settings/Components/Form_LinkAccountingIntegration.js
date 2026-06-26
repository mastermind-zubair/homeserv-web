import { useEffect, useContext, useState } from "react";
import { FormButtons } from "Components/Common/FormButtons";
import Context from "Store/Context";
import { useTranslation } from "react-i18next";
import LookupService from "Services/API/LookupService";
import { trackPromise } from "react-promise-tracker";
import environment from "Environment";

const { Modal, Form, Input, Radio, Select } = require("antd");

const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_LinkAccountingIntegration = ({
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
    if (recordToEdit) {
      // let link = "";
      // switch (row.software.toLowerCase()) {
      //   case "xero": {
      //     link = `https://login.xero.com/identity/connect/authorize?response_type=code&client_id=${recordToEdit.client_id}&redirect_uri=${environment.XERO_CALLBACK_URL}&scope=openid profile email accounting.contacts accounting.transactions&state=123`;
      //     break;
      //   }
      //   case "myob": {
      //     break;
      //   }
      // }
    }
  });
  useEffect(() => {
    //recordToEdit.expiry_date = moment(recordToEdit.expiry_date).format("YYYY-MM-DD");
    form.setFieldsValue(recordToEdit);
  }, [form, recordToEdit]);

  return (
    <Modal
      title={`Add/Edit ${ENTITY}`}
      visible={showForm}
      width={768}
      // onOk={handleSave}
      onCancel={handleCancel}
      footer={[<FormButtons {...{ form, handleCancel, ENTITY }} />]}
    >
      <LoadingPanelForPopup />
      <div className="mb-5 text-right">
        <b>{t("side_menu_dropdown_organization_title")}</b>
        <b className="text-danger">{organisation && organisation.name}</b>
      </div>
      {recordToEdit && (
        <>
          <iframe style={{ width: "100%", border: "solid 1px gray" }} />
        </>
      )}
    </Modal>
  );
};

export default Form_LinkAccountingIntegration;
