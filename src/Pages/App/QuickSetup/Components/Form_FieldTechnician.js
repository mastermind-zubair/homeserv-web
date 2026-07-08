import { useState, useEffect, useContext } from "react";
import { FormButtons } from "Components/Common/FormButtons";
import { ProfilePhoto } from "Components/Common/Images";
import SvApiUploader from "Components/Common/SvApiUploader";
import { trackPromise } from "react-promise-tracker";
import environment from "Environment";
import { DeleteFilled, PlusOutlined } from "@ant-design/icons";
import { getRank } from "Lib/JsHelper";
import Context from "Store/Context";
import LookupService from "Services/API/LookupService";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

const {
  Modal,
  Form,
  Input,
  Select,
  Radio,
  Button,
  Switch,
  DatePicker,
  Divider,
  Row,
  Col,
  Popconfirm,
} = require("antd");
const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_FieldTechnician = ({
  form,
  showForm,
  recordToEdit,
  handleCancel,
  onFinish,
  onFinishFailed,
  ENTITY,
  data,
  mode = "create",
}) => {
  const isCreateMode = mode === "create";
  //const [roles, setRoles] = useState();
  const [passwordSettings, setPasswordSettings] = useState(isCreateMode);
  const { curOrg: organisation } = useContext(Context);
  const [dateFormat, setDateFormat] = useState("MM-dd-YYYY");
  const [technicianRoles, setTechnicianRoles] = useState();
  const [serviceTypes, setServiceTypes] = useState();
  const requiredLabel = (text, required = false) => (
    <span>
      {text}
      {required ? <span className="text-danger"> *</span> : null}
    </span>
  );
  useEffect(async () => {
    if (recordToEdit && recordToEdit.industry_id) {
      await onIndustryChanged(recordToEdit.industry_id);
    }
    if (recordToEdit && !recordToEdit.id) {
      recordToEdit.licenses = [];
    }
    form.setFieldsValue(recordToEdit);
    setPasswordSettings(isCreateMode);
  }, [form, recordToEdit, isCreateMode]);

  const onIndustryChanged = async (i) => {
    let tRoles = await trackPromise(LookupService.TechnicianRoles({ industry_id: i, is_active: true }));
    setTechnicianRoles(tRoles);
    let foundTr = tRoles.find((r) => r.value === recordToEdit.technician_role_id);

    let iServiceTypes = await trackPromise(LookupService.ServiceTypes({ industry_id: i, is_active: true }));
    setServiceTypes(iServiceTypes);
    let foundSt = iServiceTypes.find((st) => st.value === recordToEdit.service_type_id);

    form.setFieldsValue({
      industry_id: i,
      technician_role_id: foundTr && foundTr.value,
      service_type_id: foundSt && foundSt.value,
    });
  };
  const { t } = useTranslation();

  return (
    <Modal
      title={t("general_add_edi_field_tech")}
      visible={showForm}
      width={768}
      // onOk={handleSave}
      onCancel={handleCancel}
      footer={[<FormButtons {...{ form, handleCancel, ENTITY }} />]}
    >
      <LoadingPanelForPopup />
      <div className="mb-5 text-right">
        <b>{t("side_menu_dropdown_organization_title")} </b>
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
        {/*<Form.Item style={{ marginBottom: 0 }}>
         <Form.Item
            name="company_name"
            label="Company"
            className="two-row-item"
            rules={[{ required: true, message: "Cmopany name is required" }]}
          >
            <Input placeholder="Company name Name" />
          </Form.Item>
         <Form.Item
            name="username"
            label="Email"
            className="two-row-item"
            rules={[{ required: true, message: "Email is required" }]}
          >
            <Input placeholder="Email here" readOnly={true} />
          </Form.Item>
        </Form.Item> */}

        <Form.Item label={requiredLabel(t("general_name"), isCreateMode)} style={{ marginBottom: 0 }}>
          <Form.Item
            name="first_name"
            rules={isCreateMode ? [{ required: true, message: "First name is required" }] : []}
            className="two-row-item"
          >
            <Input placeholder={t("quick_setup_office_users_form_first_name")} />
          </Form.Item>
          <Form.Item
            name="last_name"
            rules={isCreateMode ? [{ required: true, message: "Last name is required" }] : []}
            className="two-row-item"
          >
            <Input placeholder={t("quick_setup_office_users_form_last_name")} />
          </Form.Item>
        </Form.Item>

        <Form.Item
          label={requiredLabel(t("quick_setup_office_users_form_profile_photo"), isCreateMode)}
          name="profile_pic"
          rules={isCreateMode ? [{ required: true, message: "Profile photo is required" }] : []}
        >
          <div className="flex">
            <div className="mr-auto">
              {t("quick_setup_office_users_form_existing_photo")} <br />
              <ProfilePhoto filename={recordToEdit && recordToEdit["profile_pic"]} width={120} />
            </div>
            <div className="mr-auto">
              {t("quick_setup_office_users_form_new_photo")} <br />
              <SvApiUploader
                endpoint={`${environment.API.BASE_URL}${environment.API.VERSION}${environment.ENDPOINTS.UPLOAD_PROFILE_PIC}`}
                fileType="picture"
                multiple={false}
                maxCount={1}
                sizeLimit={20}
                onFileUploaded={({ name, path }) => {
                  form.setFieldsValue({ ["profile_pic"]: path });
                }}
              />
            </div>
          </div>
        </Form.Item>
        <Form.Item label={t("quick_setup_office_users_form_login_information")}>
          <Form.Item
            name="username"
            label={requiredLabel(t("quick_setup_office_users_form_username_email"), isCreateMode)}
            rules={isCreateMode ? [
              { required: true, message: "Please input your email!" },
              { type: "email", message: "This is not a correct email address" },
            ] : []}
            className="three-row-item"
          >
            <Input placeholder={t("quick_setup_office_users_form_email")} />
          </Form.Item>
          <Form.Item
            name="industry_id"
            label={requiredLabel(t("general_industry"), isCreateMode)}
            rules={isCreateMode ? [{ required: true, message: "Industry is required" }] : []}
            className="three-row-item"
          >
            <Select options={data.industries} onSelect={(i) => onIndustryChanged(i)} />
          </Form.Item>
          <Form.Item name="company_name" label={t("general_company")} className="three-row-item">
            <Input placeholder={t("quick_setup_sub_contractors_grid_company_name")} />
          </Form.Item>
        </Form.Item>

        <Form.Item label={t("quick_setup_office_users_form_login_credentials")}>
          <div className="box-primary bg-grey p-3">
          {recordToEdit && recordToEdit.id > 0 && (
              <Switch
                checked={passwordSettings}
                checkedChildren={<span>Don't change password</span>}
                unCheckedChildren={<span>Change Password</span>}
                onChange={() => setPasswordSettings(!passwordSettings)}
                style={{ display: "block" }}
                className="mb-2 mt-2"
              />
            )}
            {passwordSettings && (
              <>
                <Form.Item
                  label={requiredLabel(t("login_label_password"), isCreateMode || passwordSettings)}
                  name="password"
                  rules={(isCreateMode || passwordSettings) ? [{ required: true, message: "Please input your password!" }] : []}
                  className="two-row-item"
                  hasFeedback
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  label={t("quick_setup_office_users_form_confirm_password")}
                  name="confirmed_password"
                  dependencies={["password"]}
                  className="two-row-item"
                  hasFeedback
                  rules={[
                    ...(isCreateMode || passwordSettings ? [{ required: true, message: "Please confirm your password!" }] : []),
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("The confirmed password should match your password!"));
                      },
                    }),
                  ]}
                  hasFeedback
                >
                  <Input.Password />
                </Form.Item>
              </>
            )}
          </div>
        </Form.Item>

        <Form.Item label={t("quick_setup_office_users_form_contact_number")}>
          <Form.Item
            name="mobile_number"
            label={requiredLabel(t("quick_setup_sub_contractors_form_mobile_number"), isCreateMode)}
            rules={isCreateMode ? [{ required: true, message: "Mobile number is required" }] : []}
            className="two-row-item"
          >
            <Input placeholder={t("quick_setup_sub_contractors_form_mobile_number")} />
          </Form.Item>
          <Form.Item name="phone_number" label={t("general_phone")} className="two-row-item">
            <Input placeholder={t("quick_setup_sub_contractors_form_phone_number")} />
          </Form.Item>
        </Form.Item>

        <Form.Item
          name="address"
          label={requiredLabel(t("quick_setup_office_users_form_address"), isCreateMode)}
          rules={isCreateMode ? [{ required: true, message: "Address is required" }] : []}
        >
          <Input.TextArea placeholder={t("quick_setup_office_users_form_address")} />
        </Form.Item>

        <Form.Item>
          <Form.Item name="working_areas" label={t("quick_setup_sub_contractors_form_preferred_working_areas")} className="two-row-item">
            <Select mode="tags" multiple={true} options={data.workingAreas} />
          </Form.Item>
          {/* <Form.Item name="skills" label="Skills Matrix" className="two-row-item">
            <Select mode="tags" multiple={true} options={data.skills} />
          </Form.Item> */}
        </Form.Item>

        <Form.Item>
          <Form.Item
            name="technician_role_id"
            label={requiredLabel(t("quick_setup_technician_role_grid_technician_role"), isCreateMode)}
            className="three-row-item"
            rules={isCreateMode ? [{ required: true, message: "Please select a technician role" }] : []}
          >
            <Select multiple={false} options={technicianRoles} />
          </Form.Item>

          <Form.Item
            name="service_type_id"
            label={requiredLabel(t("quick_setup_service_types_form_service_type"), isCreateMode)}
            className="three-row-item"
            rules={isCreateMode ? [{ required: true, message: "Please select a service type" }] : []}
          >
            <Select multiple={false} options={serviceTypes} />
          </Form.Item>

          <Form.Item className="three-row-item" name="job_tags" label="Job tags">
            <Select mode="tags" multiple={true} options={data.jobTags} />
          </Form.Item>
          {/* <Form.Item
            name="sub_contractor_id"
            label="Sub Contractor"
            className="two-row-item"
            rules={[{ required: true, message: "Please select a sub contractor" }]}
          >
            <Select multiple={false} options={data.subContractors} />
          </Form.Item> */}
        </Form.Item>
        {/* <div className="box-primary bg-orange box-pad mb-3">
          <Form.Item label="Vehicle Info">
            <Form.Item
              name="allocated_vehicle"
              label="Allocated vehicle"
              className="three-row-item"
              rules={[{ required: true, message: "Please enter vehicle" }]}
            >
              <Input placeholder="Allocated vehicle" />
            </Form.Item>
            <Form.Item
              name="vehicle_type"
              label="Vehicle Type"
              className="three-row-item"
              rules={[{ required: true, message: "Please enter vehicle type" }]}
            >
              <Input placeholder="Vehicle type" />
            </Form.Item>
            <Form.Item
              name="vehicle_registration"
              label="Vehicle Registration"
              className="three-row-item"
              rules={[{ required: true, message: "Please enter vehicle registration" }]}
            >
              <Input placeholder="Vehicle registration info" />
            </Form.Item>
          </Form.Item>
        </div> */}

        <div className="box-primary bg-blue box-pad mb-3" style={{ width: "100%" }}>
          <Licenses form={form} initialValue={recordToEdit !== null ? form.getFieldValue("licenses") : null} dateFormat={dateFormat} />
        </div>

        <Form.Item
          name="is_show_figures"
          label={t("general_can_see_financial_details?")}
          initialValue={false}
          className="two-row-item"
        >
          <Radio.Group
            options={[
              { label: t("general_yes"), value: true },
              { label: t("general_no"), value: false },
            ]}
          />
        </Form.Item>

        <Form.Item>
          <Form.Item
            className="three-row-item"
            name="is_sub_contractor"
            label={t("general_is_this_user_a_sub_contractor?")}
            initialValue={true}
          >
            <Radio.Group
              options={[
                { label: t("general_yes"), value: true },
                { label: t("general_no"), value: false },
              ]}
            />
          </Form.Item>
          <Form.Item name="is_active" label={t("label_status")} initialValue={true} className="three-row-item">
            <Radio.Group
              options={[
                { label: t("label_active"), value: true },
                { label: t("label_inactive"), value: false },
              ]}
            />
          </Form.Item>
          <Form.Item
            className="three-row-item"
            name="is_apprentice"
            label={t("quick_setup_field_technicians_form_is_this_user")}
            initialValue={true}
          >
            <Radio.Group
              options={[
                { label: t("general_yes"), value: true },
                { label: t("general_no"), value: false },
              ]}
            />
          </Form.Item>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form_FieldTechnician;

function Licenses({ form, initialValue, dateFormat }) {
  //initialValue = [];

  return (
    <Form.List name="licenses" initialValue={initialValue}>
      {(fields, { add, remove }) => {
        return (
          <div>
            {fields.map((field, index) => (
              <div key={field.key}>
                <Form.Item hidden name="id" />
                <Divider>{getRank(index + 1)}  License</Divider>
                <Row align="top" justify="start" gutter={4}>
                  <Col xl={2} xs={4}>
                    {fields.length > 0 ? (
                      <Form.Item style={{ display: "inline-block", marginTop: "26px" }}>
                        <Popconfirm title="Remove this license?" onConfirm={() => remove(field.name)}>
                          <Button type="danger" className="dynamic-delete-button">
                            <DeleteFilled />
                          </Button>
                        </Popconfirm>
                      </Form.Item>
                    ) : null}
                  </Col>
                  <Col xl={5} xs={10}>
                    <Form.Item
                      label={t("general_type")}
                      name={[index, "type"]}
                      valuePropName="value"
                      rules={[{ required: true, message: "License type is required" }]}
                    >
                      <Select>
                        <Select.Option value="driving">Driving</Select.Option>
                        <Select.Option value="technician">Technician</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xl={5} xs={10}>
                    <Form.Item
                      name={[index, "number"]}
                      label={t("general_number")}
                      rules={[{ required: true, message: "License number is required" }]}
                    >
                      <Input placeholder="License Number" />
                    </Form.Item>
                  </Col>
                  <Col xl={5} xs={10}>
                    <Form.Item
                      name={[index, "expiry"]}
                      label={t("quick_setup_sub_contractors_form_license_expiry")}
                      rules={[{ required: true, message: "License expiry date is required" }]}
                    >
                      <DatePicker placeholder={t("general_license_expiry_date")} format={dateFormat.toUpperCase()} />
                    </Form.Item>
                  </Col>
                  <Col xl={5} xs={10}>
                    {" "}
                    <Form.Item
                      {...field}
                      name={[index, "file_path"]}
                      label={t("quick_setup_sub_contractors_form_upload_license")}
                      rules={[{ required: true, message: "License file must be uploaded" }]}
                    >
                      <SvApiUploader
                        endpoint={`${environment.API.BASE_URL}${environment.API.VERSION}${environment.ENDPOINTS.UPLOAD_LICENSE}`}
                        fileType="any"
                        multiple={false}
                        maxCount={1}
                        sizeLimit={20}
                        onFileUploaded={({ name, path, size, mimetype }) => {
                          const fields = form.getFieldsValue();
                          const { licenses } = fields;
                          licenses[index]["file_path"] = path;
                          licenses[index]["file"] = name;
                          licenses[index]["file_size"] = size;
                          licenses[index]["mime_type"] = mimetype;
                          form.setFieldsValue({ licenses });
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            ))}
            <Form.Item style={{ width: "110px" }} className="mr-auto">
              <Button type="dashed" onClick={() => add()}>
                <PlusOutlined /> Add {`${fields.length > 0 ? " another " : " a "}`} license
              </Button>
            </Form.Item>
          </div>
        );
      }}
    </Form.List>
  );
}
