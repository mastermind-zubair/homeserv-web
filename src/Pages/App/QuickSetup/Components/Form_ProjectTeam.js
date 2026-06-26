import { useState, useEffect, useContext } from "react";
import { FormButtons } from "Components/Common/FormButtons";
import { trackPromise } from "react-promise-tracker";
import LookupService from "Services/API/LookupService";
import Context from "Store/Context";
import { useTranslation } from "react-i18next";

const { Modal, Form, Input, Select, Radio } = require("antd");

const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_ProjectTeam = ({ form, showForm, recordToEdit, handleCancel, onFinish, onFinishFailed, ENTITY, data }) => {
  const { t } = useTranslation();
  const [fieldTechnicians, setFieldTechnicians] = useState();

  const [mgrList, setMgrList] = useState();
  const { curOrg: organisation } = useContext(Context);


  useEffect(async () => {
    if (recordToEdit) {
      let technicians = [];
      if (recordToEdit.industry_id) {
        technicians = await onIndustryChanged(recordToEdit.industry_id);
      }

      if (recordToEdit.members) {
        onTeamMemberChanged(recordToEdit.members, technicians);
      }
    }
    form.setFieldsValue(recordToEdit);
  }, [recordToEdit]);

  const onIndustryChanged = async (i) => {
    let iTechs = await trackPromise(LookupService.FieldTechnicians({ industry_id: i }));
    setFieldTechnicians(iTechs);
    setMgrList([]);
    form.setFieldsValue({ members: [], manager_id: null });
    return iTechs;
  };

  const onTeamMemberChanged = (m, t) => {
    //setSelectedMembers(m);
    const myArray = t || fieldTechnicians;
    const myFilter = m;

    const ml = myArray.filter((array) => myFilter.some((filter) => filter === array.value));
    setMgrList(ml);
    let selMgrId = form.getFieldValue("manager_id");
    if (!ml.find((m) => m.value === selMgrId)) {
      form.setFieldsValue({ manager_id: null });
    }
  };

  return (
    <Modal
      title={t("general_add_edi_pro_team")}
      visible={showForm}
      width={768}
      // onOk={handleSave}
      onCancel={handleCancel}
      footer={[<FormButtons {...{ form, handleCancel, ENTITY }} />]}
    >
      <LoadingPanelForPopup />{" "}
      <div className="mb-5 text-right">
        <b> {t("side_menu_dropdown_organization_title")} </b>
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
        <Form.Item
          name="name"
          label={t("general_team_name")}
          rules={[{ required: true, message: "Team name is required" }]}
          className="one-row-item"
        >
          <Input placeholder={t("general_team_name")} />
        </Form.Item>

        {/* <Form.Item
          name="organisation_id"
          label="Organisation"
          className="two-row-item"
          rules={[{ required: true, message: "Please select an organisation" }]}
        >
          <Select
            multiple={false}
            options={data.organisations}
            onChange={(id) => {
              console.log(id);
              setOrganisationId(id);
            }}
          />
        </Form.Item> */}
        <Form.Item
          name="industry_id"
          label={t("general_industry")}
          className="two-row-item"
          rules={[{ required: true, message: "Please select an industry" }]}
        >
          <Select multiple={false} options={data.industries} onChange={(i) => onIndustryChanged(i)} />
        </Form.Item>

        <Form.Item
          name="members"
          label={t("side_menu_navigation_quick_setup_sub_field_technicians")}
          className="one-row-item"
          rules={[{ required: true, message: "Please select some field technicians" }]}
        >
          <Select
            showSearch
            mode="multiple"
            //style={{ width: "100%" }}
            //placeholder="Select Principals where this contact is Account Executive"
            optionFilterProp="children"
            filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            options={fieldTechnicians}
            onChange={(i) => {
              onTeamMemberChanged(i);
            }}
          />
        </Form.Item>

        <Form.Item
          name="manager_id"
          label={t("general_manager")}
          className="one-row-item"
        //rules={[{ required: true, message: "Please select a team manager" }]}
        >
          <Select
            showSearch
            multiple={false}
            //style={{ width: "100%" }}
            //placeholder="Select Principals where this contact is Account Executive"
            optionFilterProp="children"
            filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            options={mgrList}
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
    </Modal>
  );
};

export default Form_ProjectTeam;
