import { useState, useEffect, useContext } from "react";
import { FormButtons } from "Components/Common/FormButtons";
import Context from "Store/Context";
import { trackPromise } from "react-promise-tracker";
import LookupService from "Services/API/LookupService";
import { useTranslation } from "react-i18next";


const { Modal, Form, Select, Radio } = require("antd");

const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_Truck = ({ form, showForm, recordToEdit, handleCancel, onFinish, onFinishFailed, ENTITY, data }) => {
  const { t } = useTranslation();
  const [selectedIndustryId, setSelectedIndustryId] = useState();
  const [fieldTechnicians, setFieldTechnicians] = useState();
  const [vehicles, setVehicles] = useState();

  const { curOrg: organisation } = useContext(Context);

  useEffect(async () => {
    if (recordToEdit) {
      if (recordToEdit.industry_id) {
        await onIndustryChanged(recordToEdit.industry_id);
      }
    }
    form.setFieldsValue(recordToEdit);
  }, [recordToEdit]);

  const onIndustryChanged = async (industry_id) => {
    //let iTechs = await trackPromise(LookupService.FieldTechnicians({ industry_id: i }));
    if (industry_id > 0) {
      let iTechs = await getFieldTechnicians(organisation.id, industry_id);
      let iVehicles = await getVehicles(organisation.id, industry_id);
      console.log("iTechs: ", iTechs);
      console.log("iVehicles: ", iVehicles);
      setFieldTechnicians(iTechs);
      setVehicles(iVehicles);
      setSelectedIndustryId(industry_id);
    }
  };

  const getFieldTechnicians = async (organisation_id, industry_id) => {
    let techs = await trackPromise(
      LookupService.getLookupByEntity(
        "Unassigned_Technicians",
        { organisation_id: organisation_id, industry_id: industry_id },
        "{display_name} ({username})",
        "id"
      )
    );
    if (recordToEdit.id && recordToEdit.id > 0) {
      let cTech = {
        label: `${recordToEdit.field_technician.display_name} (${recordToEdit.field_technician.username})`,
        value: recordToEdit.field_technician.id,
      };

      if (techs) techs.push(cTech);
      else techs = [cTech];

      //techs = (techs && techs.push(cTech)) || [cTech];
    }
    console.log('techs:', techs);

    return techs;
  };

  const getVehicles = async (organisation_id, industry_id) => {
    let vehicles = await trackPromise(
      LookupService.getLookupByEntity(
        "Unassigned_Vehicles",
        { organisation_id: organisation_id },
        "{registration_number} ({vehicle_type})",
        "id"
      )
    );
    if (recordToEdit.id) {
      let cVehicle = {
        label: `${recordToEdit.vehicle.registration_number} (${recordToEdit.vehicle.vehicle_type})`,
        value: recordToEdit.vehicle.id,
      };

      if (vehicles) vehicles.push(cVehicle);
      else vehicles = [cVehicle];

      //vehicles = (vehicles && vehicles.push(cVehicle)) || [cVehicle];
    }
    return vehicles;
  };

  return (
    <Modal
      title={t("general_add_edit_truck")}
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
          <Form.List name="products">
            {(fields, { add, remove }) => {
              return (
                <>
                  {fields.map((field, index) => (
                    <div key={field.key}>
                      <Form.Item hidden name="product_id" />
                      <Form.Item hidden name="quantity" />
                    </div>
                  ))}
                </>
              );
            }}
          </Form.List>
          <Form.Item
            name="industry_id"
            label={t("general_industry")}
            className="one-row-item"
            rules={[{ required: true, message: "Please select an industry" }]}
          >
            <Select multiple={false} options={data.industries} onChange={(i) => onIndustryChanged(i)} />
          </Form.Item>

          <Form.Item
            name="field_technician_id"
            label={t("general_technician")}
            className="one-row-item"
            rules={[{ required: true, message: "Please select a field technician" }]}
          >
            <Select options={fieldTechnicians} />
          </Form.Item>

          <Form.Item
            name="vehicle_id"
            label={t("general_vehicle")}
            className="one-row-item"
            rules={[{ required: true, message: "Please select a vehicle" }]}
          >
            <Select options={vehicles} />
          </Form.Item>

          {selectedIndustryId && (
            <Form.Item
              name="inventory_template_id"
              label={t("general_template")}
              className="one-row-item"
              rules={[{ required: true, message: "Please select an inventory template" }]}
            >
              <Select options={data.templates.filter((v) => v.industry_id === selectedIndustryId)} />
            </Form.Item>
          )}
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

export default Form_Truck;
