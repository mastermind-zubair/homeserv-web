import { useState, useEffect, useContext } from "react";
import { FormButtons } from "Components/Common/FormButtons";
import { ProfilePhoto } from "Components/Common/Images";
import SvApiUploader from "Components/Common/SvApiUploader";
import environment from "Environment";
import { useTranslation } from "react-i18next";
import Context from "Store/Context";

const { Modal, Form, Input, Select, Radio, Switch } = require("antd");
const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_OfficeUser = ({
  form,
  showForm,
  recordToEdit,
  handleCancel,
  onFinish,
  onFinishFailed,
  ENTITY,
  data,
}) => {
  //const [roles, setRoles] = useState();
  const [passwordSettings, setPasswordSettings] = useState(
    recordToEdit && recordToEdit.id > 0 ? false : true
  );
  const { t } = useTranslation();
  const { curOrg: organisation } = useContext(Context);

  useEffect(() => {
    // console.log(data.roles);
    // if (data && data.roles) setRoles(data.roles);
  }, [data]);

  return (
    <Modal
      title={t("general_add_edi_off_user")}
      visible={showForm}
      // onOk={handleSave}
      onCancel={handleCancel}
      footer={[<FormButtons {...{ form, handleCancel, ENTITY }} />]}
    >
      <LoadingPanelForPopup />
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
          label={t("quick_setup_office_users_form_name")}
          style={{ marginBottom: 0 }}
        >
          <Form.Item
            name="first_name"
            rules={[{ required: true, message: "First name is required" }]}
            style={{ display: "inline-block", width: "calc(50% - 1px)" }}
          >
            <Input
              placeholder={t("quick_setup_office_users_form_first_name")}
            />
          </Form.Item>
          <Form.Item
            name="last_name"
            rules={[{ required: true, message: "Last name is required" }]}
            style={{
              display: "inline-block",
              width: "calc(50% - 1px)",
              margin: "0 1px",
            }}
          >
            <Input placeholder={t("quick_setup_office_users_form_last_name")} />
          </Form.Item>
        </Form.Item>
        <Form.Item label={t("quick_setup_office_users_form_login_information")}>
          <Form.Item
            name="username"
            label={t("quick_setup_office_users_form_username_email")}
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "This is not a correct email address" },
            ]}
            style={{
              display: "inline-block",
              width: "calc(50% - 1px)",
              margin: "0 1px",
            }}
          >
            <Input placeholder={t("quick_setup_office_users_form_email")} />
          </Form.Item>
          <Form.Item
            name="role"
            label={t("quick_setup_office_users_form_user_role")}
            rules={[{ required: true, message: "Role is required" }]}
            style={{
              display: "inline-block",
              width: "calc(49% - 1px)",
              margin: "0 1px",
            }}
          >
            <Select options={data.roles} />
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
                  label={t("quick_setup_office_users_form_password")}
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                  style={{ display: "inline-block", width: "calc(50% - 1px)" }}
                  hasFeedback
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  label={t("quick_setup_office_users_form_confirm_password")}
                  name="confirmed_password"
                  dependencies={["password"]}
                  style={{
                    display: "inline-block",
                    width: "calc(50% - 1px)",
                    margin: "0 1px",
                  }}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "The confirmed password should match your password!"
                          )
                        );
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

        <Form.Item
          name="contact_number"
          label={t("quick_setup_office_users_form_contact_number")}
        >
          <Input
            placeholder={t("quick_setup_office_users_form_phone_number_here")}
          />
        </Form.Item>

        <Form.Item
          name="address"
          label={t("quick_setup_office_users_form_address")}
        >
          <Input.TextArea
            placeholder={t("quick_setup_office_users_form_address")}
          />
        </Form.Item>

        <Form.Item
          label={t("quick_setup_office_users_form_profile_photo")}
          name="profile_pic"
        >
          <div className="flex">
            <div>
              {t("quick_setup_office_users_form_existing_photo")}
              <br />
              {/* <Image
                src={`data:image/jpeg;base64,${(recordToEdit && recordToEdit.profile_pic) || defaultUser()}`}
                style={{ width: "120px" }}
              /> */}
              <ProfilePhoto
                filename={recordToEdit && recordToEdit["profile_pic"]}
                width={120}
              />
            </div>
            <div className="mr-auto">
              {t("quick_setup_office_users_form_new_photo")}
              <br />
              {/* <FileUploader
                fileType="picture"
                multiple={false}
                uploadLimit={20}
                onFileSelect={(data) => {
                  form.setFieldsValue({ ["profile_pic"]: fixBase64(data) });
                }}
              /> */}
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
              {/* <FileBase64 multiple={false} onDone={handleUploadChange} /> */}
            </div>
            <div className="ml-auto"></div>
          </div>
        </Form.Item>

        <Form.Item
          name="is_remote"
          label={t("quick_setup_office_users_form_prevent_access")}
          initialValue={true}
        >
          <Radio.Group defaultValue={true}>
            <Radio value={false}>
              {t("quick_setup_office_users_form_local_user")}
            </Radio>
            <Radio value={true}>
              {" "}
              {t("quick_setup_office_users_form_remote")}{" "}
            </Radio>
          </Radio.Group>
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
    </Modal>
  );
};

export default Form_OfficeUser;
