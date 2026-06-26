import { Button } from "antd";
import { useTranslation } from "react-i18next";

export const FormButtons = ({ form, handleCancel, ENTITY }) => {
  const { t } = useTranslation();

  return (
    <div className="flex">
      <Button type="primary" size="large" htmlType="submit" onClick={() => form.submit()}>
        {t("quick_setup_organizations_modal_button_save", { ENTITY })}
      </Button>
      <Button className="ml-auto" size="large" onClick={handleCancel}>
        {t("quick_setup_organizations_modal_button_cancel")}
      </Button>
    </div>
  );
};

export const CloseButton = ({ handleCancel }) => {
  return (
    <div className="flex">
      <Button className="ml-auto" size="large" onClick={handleCancel}>
        Close
      </Button>
    </div>
  );
};
export const SaveButton = ({ handleSave }) => {
  return (
    <div className="flex">
      <Button type="primary" size="large" htmlType="submit" className="mr-auto" onClick={handleSave}>
        Save
      </Button>
    </div>
  );
};

export const UpdateButton = ({ handleUpdate }) => {
  return (
    <div className="flex">
      <Button type="primary" size="large" htmlType="submit" className="mr-auto" onClick={handleUpdate}>
        Update
      </Button>
    </div>
  );
};
