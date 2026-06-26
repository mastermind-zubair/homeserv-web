import { useState, useEffect, useContext } from "react";
import { FormButtons } from "Components/Common/FormButtons";
import { ProfilePhoto } from "Components/Common/Images";
import SvApiUploader from "Components/Common/SvApiUploader";
import environment from "Environment";
import { DeleteFilled, PlusOutlined } from "@ant-design/icons";
import { getRank } from "Lib/JsHelper";
import Context from "Store/Context";
import { useTranslation } from "react-i18next";

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

const Form_SubContractor = ({ form, showForm, recordToEdit, handleCancel, onFinish, onFinishFailed, ENTITY, data }) => {
  //const [roles, setRoles] = useState();
  const { t } = useTranslation();
  const [passwordSettings, setPasswordSettings] = useState(recordToEdit && recordToEdit.id > 0 ? false : true);
  const { curOrg: organisation } = useContext(Context);
  useEffect(() => {
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
      <LoadingPanelForPopup />{" "}
      <div className="mb-5 text-right">
        <b>Organisation: </b>
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
        <Form.Item name="id" hidden /> <Form.Item name="organisation_id" hidden />
        <Form.Item style={{ marginBottom: 0 }}>
          <Form.Item
            name="company_name"
            label="Company"
            className="two-row-item"
            rules={[{ required: true, message: "Cmopany name is required" }]}
          >
            <Input placeholder="Company name Name" />
          </Form.Item>
          {/* <Form.Item
            name="username"
            label="Email"
            className="two-row-item"
            rules={[{ required: true, message: "Email is required" }]}
          >
            <Input placeholder="Email here" />
          </Form.Item> */}
        </Form.Item>
        <Form.Item label="Name" style={{ marginBottom: 0 }}>
          <Form.Item
            name="first_name"
            rules={[{ required: true, message: "First name is required" }]}
            className="two-row-item"
          >
            <Input placeholder="First Name" />
          </Form.Item>
          <Form.Item
            name="last_name"
            rules={[{ required: true, message: "Last name is required" }]}
            className="two-row-item"
          >
            <Input placeholder="Last Name" />
          </Form.Item>
        </Form.Item>
        <Form.Item label="Profile Photo" name="profile_pic">
          <div className="flex">
            <div className="mr-auto">
              Existing Photo <br />
              <ProfilePhoto filename={recordToEdit && recordToEdit["profile_pic"]} width={120} />
            </div>
            <div className="mr-auto">
              New Photo <br />
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
        <Form.Item label="Login Information">
          <Form.Item
            name="username"
            label="Username/Email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "This is not a correct email address" },
            ]}
            className="two-row-item"
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="role"
            label="User Role"
            rules={[{ required: true, message: "Role is required" }]}
            className="two-row-item"
          >
            <Select options={data.roles} />
          </Form.Item>
        </Form.Item>
        <Form.Item label="Login Credentials">
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
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: "Please input your password!" }]}
                  className="two-row-item"
                  hasFeedback
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  label="Confirm Password"
                  name="confirmed_password"
                  dependencies={["password"]}
                  className="two-row-item"
                  hasFeedback
                  rules={[
                    { required: true, message: "Please confirm your password!" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("The confirmed password should match your password!"));
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              </>
            )}
          </div>
        </Form.Item>
        <Form.Item label="Contact numbers">
          <Form.Item
            name="mobile_number"
            label="Mobile Phone"
            rules={[{ required: true, message: "Mobile number is required" }]}
            className="two-row-item"
          >
            <Input placeholder="Mobile number" />
          </Form.Item>
          <Form.Item name="phone_number" label="Phone" className="two-row-item">
            <Input placeholder="Phone number" />
          </Form.Item>
        </Form.Item>
        <Form.Item name="address" label="Address">
          <Input.TextArea placeholder="Address" />
        </Form.Item>
        <Form.Item>
          <Form.Item name="working_areas" label="Preferred Working Areas" className="two-row-item">
            <Select mode="tags" multiple={true} options={data.workingAreas} />
          </Form.Item>
          <Form.Item name="skills" label="Skills Matrix" className="two-row-item">
            <Select mode="tags" multiple={true} options={data.skills} />
          </Form.Item>
        </Form.Item>
        <Form.Item>
          <Form.Item
            name="organisation_id"
            label="Organisation"
            className="two-row-item"
            rules={[{ required: true, message: "Please select an organisation" }]}
          >
            <Select multiple={false} options={data.organisations} />
          </Form.Item>
          <Form.Item
            name="technician_role_id"
            label="Technician Role"
            className="two-row-item"
            rules={[{ required: true, message: "Please select a technician role" }]}
          >
            <Select multiple={false} options={data.technicianRoles} />
          </Form.Item>
        </Form.Item>
        <div className="bg-blue box-pad" style={{ width: "100%" }}>
          <Licenses form={form} initialValue={recordToEdit !== null ? form.getFieldValue("licenses") : null} />
        </div>
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

export default Form_SubContractor;

function Licenses({ form, initialValue }) {
  //initialValue = [];

  return (
    <Form.List name="licenses" initialValue={initialValue}>
      {(fields, { add, remove }) => {
        return (
          <div>
            {fields.map((field, index) => (
              <div key={field.key}>
                <Form.Item hidden name="id" />
                <Form.Item hidden name="file_size" />
                <Form.Item hidden name="mime_type" />
                <Divider>{getRank(index + 1)} License</Divider>
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
                      label="Type"
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
                      label="Number"
                      rules={[{ required: true, message: "License number is required" }]}
                    >
                      <Input placeholder="License Number" />
                    </Form.Item>
                  </Col>
                  <Col xl={5} xs={10}>
                    <Form.Item
                      name={[index, "expiry"]}
                      label="License Expiry"
                      rules={[{ required: true, message: "License expiry date is required" }]}
                    >
                      <DatePicker placeholder="License expiry date" format="YYYY-MM-DD" />
                    </Form.Item>
                  </Col>
                  <Col xl={5} xs={10}>
                    {" "}
                    <Form.Item
                      {...field}
                      name={[index, "file_path"]}
                      label="Upload License"
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
