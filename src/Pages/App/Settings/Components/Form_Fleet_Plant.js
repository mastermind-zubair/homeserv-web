import { useEffect, useContext } from "react";
import { FormButtons } from "Components/Common/FormButtons";
import { VehiclePhoto } from "Components/Common/Images";
import SvApiUploader from "Components/Common/SvApiUploader";
import UploaderService from "Services/API/UploaderService";
import environment from "Environment";
import { InboxOutlined } from "@ant-design/icons";
import SvApiUploaderMultiple from "Components/Common/SvApiUploaderMultiple";
import Context from "Store/Context";
import { useTranslation } from "react-i18next";

const { Modal, Form, Input, Radio, DatePicker, Row, Col, Upload } = require("antd");
const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_Fleet_Plant = ({ form, showForm, recordToEdit, handleCancel, onFinish, onFinishFailed, ENTITY, dateFormat }) => {
  const { t } = useTranslation();
  const { curOrg: organisation } = useContext(Context);

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(recordToEdit);
  }, [form, recordToEdit]);

  const normFile = (e) => {
    console.log("Upload event:", e);

    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };

  return (
    <Modal
      title={t("general_add_edit_pla_new")}
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
        <Form.Item name="is_plant" initialValue={true} hidden />

        <Form.Item style={{ marginBottom: 0 }}>
          <Form.Item
            name="vehicle_type"
            label={t("general_plant_type")}
            className="two-row-item"
            rules={[{ required: true, message: "Plant type is required" }]}
          >
            <Input placeholder={t("general_plant_type")} />
          </Form.Item>
          <Form.Item
            name="insurance_company"
            label={t("general_insurance_company")}
            className="two-row-item"
            rules={[{ required: true, message: "Insurance company is required" }]}
          >
            <Input placeholder={t("general_insurance_company")} />
          </Form.Item>
        </Form.Item>

        <Form.Item label="" style={{ marginBottom: 0 }}>
          <Form.Item
            name="registration_number"
            label={t("general_registration_#")}
            rules={[{ required: true, message: "Registration number is required" }]}
            className="two-row-item"
          >
            <Input placeholder={t("general_registration_#")} />
          </Form.Item>
          <Form.Item
            name="registration_expiry"
            label={t("general_registration_expiry")}
            rules={[{ required: true, message: "Registration expiry date is required" }]}
            className="two-row-item"
          >
            <DatePicker placeholder={t("general_expirty_date")} format={dateFormat.toUpperCase()} />
          </Form.Item>
        </Form.Item>

        <Form.Item label="" style={{ marginBottom: 0 }}>
          <Form.Item
            name="policy_number"
            label={t("general_policy_#")}
            rules={[{ required: true, message: "policy number is required" }]}
            className="two-row-item"
          >
            <Input placeholder="policy number" />
          </Form.Item>
          <Form.Item
            name="policy_expiry"
            label={t("general_policy_expiry")}
            rules={[{ required: true, message: "Policy expiry date is required" }]}
            className="two-row-item"
          >
            <DatePicker placeholder={t("general_expirty_date")} format={dateFormat.toUpperCase()} />
          </Form.Item>
        </Form.Item>

        <Form.Item label="" style={{ marginBottom: 0 }}>
          <Form.Item
            name="plant_number"
            label={t("general_plan_#")}
            rules={[{ required: true, message: "Plant number is required" }]}
            className="two-row-item"
          >
            <Input placeholder={t("general_plan_#")} />
          </Form.Item>
          <Form.Item
            name="next_vehicle_service"
            label={t("general_next_plant_service_date")}
            rules={[{ required: true, message: "Next plant service date is required" }]}
            className="two-row-item"
          >
            <DatePicker placeholder={t("general_next_plant_service_date")} format={dateFormat.toUpperCase()} />
          </Form.Item>
        </Form.Item>

        <Form.Item label={t("general_plan_photo")} name="vehicle_image">
          <div className="flex">
            <div className="mr-auto">
              {t("quick_setup_office_users_form_existing_photo")} <br />
              <VehiclePhoto filename={recordToEdit && recordToEdit["vehicle_image"]} width={120} />
            </div>
            <div className="mr-auto">
              {t("quick_setup_office_users_form_new_photo")} <br />
              <SvApiUploader
                endpoint={`${environment.API.BASE_URL}${environment.API.VERSION}${environment.ENDPOINTS.UPLOAD_VEHICLE_PIC}`}
                fileType="picture"
                multiple={false}
                maxCount={1}
                sizeLimit={20}
                onFileUploaded={({ name, path }) => {
                  form.setFieldsValue({ ["vehicle_image"]: path });
                }}
              />
            </div>
          </div>
        </Form.Item>

        <div className="bg-blue box-pad" style={{ width: "100%" }}>
          <h3>{t("general_service_docs")}</h3>

          <Form.Item name="service_docs" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
            <Upload.Dragger
              name="service_docs"
              multiple={true}
              maxCount={5}
              action={`${environment.API.BASE_URL}${environment.API.VERSION}${environment.ENDPOINTS.UPLOAD_VEHICLE_SERVICE_DOC}`}
              //method="post"
              //headers={[{ "content-type": "multipart/form-data", Authorization: AuthService.getAuthToken() }]}
              customRequest={(options) =>
                UploaderService.UploadFile(options, ({ name, path, size, mimetype }) => {
                  const fields = form.getFieldsValue();
                  let docs = fields["service_docs"];
                  let uploadedDocs = docs.map((d) => {
                    let doc = { ...d };
                    doc["file_path"] = path;
                    doc["file"] = name;
                    doc["file_size"] = size;
                    doc["mime_type"] = mimetype;
                    return doc;
                  });

                  fields["service_docs"] = uploadedDocs;
                  form.setFieldsValue(fields);
                })
              }
              onChange={({ file, fileList, event }) => {
                console.log("onChange", file, fileList, event);
              }}
              onRemove={(file) => {
                const fields = form.getFieldsValue();
                let docs = fields["service_docs"];

                docs = docs.filter((v) => v.file !== file.file || v.name !== file.file);
                fields["service_docs"] = docs;
                form.setFieldsValue(fields);
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag documents to this area to upload</p>
              <p className="ant-upload-hint">Works for single or bulk upload.</p>
            </Upload.Dragger>
          </Form.Item>
        </div>

        <div className="bg-blue box-pad" style={{ width: "100%" }}>
          <h3>{t("general_policy_docs")}</h3>

          <Form.Item name="policy_docs" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
            <Upload.Dragger
              name="policy_docs"
              multiple={true}
              maxCount={5}
              action={`${environment.API.BASE_URL}${environment.API.VERSION}${environment.ENDPOINTS.UPLOAD_VEHICLE_SERVICE_DOC}`}
              //method="post"
              //headers={[{ "content-type": "multipart/form-data", Authorization: AuthService.getAuthToken() }]}
              customRequest={(options) =>
                UploaderService.UploadFile(options, ({ name, path, size, mimetype }) => {
                  const fields = form.getFieldsValue();
                  let docs = fields["policy_docs"];
                  let uploadedDocs = docs.map((d) => {
                    let doc = { ...d };
                    doc["file_path"] = path;
                    doc["file"] = name;
                    doc["file_size"] = size;
                    doc["mime_type"] = mimetype;
                    return doc;
                  });

                  fields["policy_docs"] = uploadedDocs;
                  form.setFieldsValue(fields);
                })
              }
              onChange={({ file, fileList, event }) => {
                console.log("onChange", file, fileList, event);
                fileList = fileList.map((f) => {
                  let newF = { ...f };
                  newF.name = f.file;
                  return newF;
                });
              }}
              onRemove={(file) => {
                const fields = form.getFieldsValue();
                let docs = fields["policy_docs"];

                docs = docs.filter((v) => v.file !== file.file || v.name !== file.file);
                fields["policy_docs"] = docs;
                form.setFieldsValue(fields);
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag documents to this area to upload</p>
              <p className="ant-upload-hint">Works for single or bulk upload.</p>
            </Upload.Dragger>
          </Form.Item>
        </div>
        {/* 
        <div className="bg-blue box-pad" style={{ width: "100%" }}>
          <h3>Policy Docs</h3>
          <Document_List
            form={form}
            listFieldName="policy_docs"
            initialValue={recordToEdit !== null ? form.getFieldValue("policy_docs") : null}
            docUploadEndpiont={`${environment.API.BASE_URL}${environment.API.VERSION}${environment.ENDPOINTS.UPLOAD_VEHICLE_POLICY_DOC}`}
          />
        </div> */}

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

export default Form_Fleet_Plant;

function Document_List({ form, listFieldName, initialValue, docUploadEndpiont }) {
  //initialValue = [];

  return (
    <Form.List name={listFieldName} initialValue={initialValue}>
      {(fields, { add, remove }) => {
        return (
          <div>
            <Row align="top" justify="start" gutter={4}>
              {/* <Col xl={2} xs={4}>
                    {fields.length > 0 ? (
                      <Form.Item style={{ display: "inline-block", marginTop: "26px" }}>
                        <Popconfirm title="Remove this Document?" onConfirm={() => remove(field.name)}>
                          <Button type="danger" className="dynamic-delete-button">
                            <DeleteFilled />
                          </Button>
                        </Popconfirm>
                      </Form.Item>
                    ) : null}
                  </Col> */}
              <Col xl={24} xs={24}>
                {" "}
                <Form.Item name={listFieldName} label="Upload Documents">
                  <SvApiUploaderMultiple
                    files={initialValue}
                    endpoint={docUploadEndpiont}
                    fileType="any"
                    multiple={true}
                    maxCount={5}
                    sizeLimit={20}
                    onFileUploaded={({ name, path, size, mimetype }) => {
                      const fields = form.getFieldsValue();
                      const docs = fields[listFieldName];
                      let doc = {};
                      doc["file_path"] = path;
                      doc["file"] = name;
                      doc["file_size"] = size;
                      doc["mime_type"] = mimetype;
                      docs.push(doc);
                      fields[listFieldName] = docs;
                      form.setFieldsValue(fields);
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        );
      }}
    </Form.List>
  );
}
