import { useEffect, useContext } from "react";
import { FormButtons } from "Components/Common/FormButtons";
import TextArea from "antd/lib/input/TextArea";
import { TaskPhoto } from "Components/Common/Images";
import SvApiUploader from "Components/Common/SvApiUploader";
import environment from "Environment";
import Context from "Store/Context";
import { useTranslation } from "react-i18next";

const { Modal, Form, Input, Radio, InputNumber } = require("antd");

const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_AllTask = ({ form, showForm, recordToEdit, handleCancel, onFinish, onFinishFailed, ENTITY, data }) => {
  const { t } = useTranslation();
  const { curOrg: organisation } = useContext(Context);
  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(recordToEdit);
  }, [form, recordToEdit]);

  return (
    <Modal
      title={t("general_add_edit_task")}
      visible={showForm}
      width={480}
      // onOk={handleSave}
      onCancel={handleCancel}
      footer={[<FormButtons {...{ form, handleCancel, ENTITY }} />]}
    >
      <LoadingPanelForPopup />
      <div className="mb-5 text-right">
        <b>{t("side_menu_dropdown_organization_title")}: </b>
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
            name="title"
            label={t("general_title")}
            className="one-row-item"
            rules={[{ required: true, message: "Please provide a title" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label={t("quick_setup_job_tags_grid_description")}
            className="one-row-item"
            rules={[{ required: true, message: "Please enter some description" }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="duration"
            label={t("general_duration_(hours)")}
            className="one-row-item"
            rules={[{ required: true, message: "Please enter duration" }]}
          >
            <InputNumber defaultValue={0.0} />
          </Form.Item>

          <Form.Item label={t("general_task_photo")} name="image">
            <div className="flex">
              <div className="mr-auto">
                {t("quick_setup_office_users_form_existing_photo")} <br />
                <TaskPhoto filename={recordToEdit && recordToEdit["image"]} width={120} />
              </div>
              <div className="mr-auto">
                {t("quick_setup_office_users_form_new_photo")} <br />
                <SvApiUploader
                  endpoint={`${environment.API.BASE_URL}${environment.API.VERSION}${environment.ENDPOINTS.UPLOAD_TASK_PIC}`}
                  fileType="picture"
                  multiple={false}
                  maxCount={1}
                  sizeLimit={20}
                  onFileUploaded={({ name, path }) => {
                    form.setFieldsValue({ ["image"]: path });
                  }}
                />
              </div>
            </div>
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

export default Form_AllTask;
