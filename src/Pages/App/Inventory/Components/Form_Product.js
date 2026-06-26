import { useEffect, useContext } from "react";
import { FormButtons } from "Components/Common/FormButtons";
import { ProductPhoto } from "Components/Common/Images";
import SvApiUploader from "Components/Common/SvApiUploader";
import environment from "Environment";
import Context from "Store/Context";
import { useTranslation } from "react-i18next";

const { Modal, Form, Input, Select, Radio, InputNumber } = require("antd");

const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_Product = ({ form, showForm, recordToEdit, handleCancel, onFinish, onFinishFailed, ENTITY, data }) => {
  const { t } = useTranslation();
  const { curOrg: organisation } = useContext(Context);
  const REECE = 'REECE';

  useEffect(() => {
    //recordToEdit.expiry_date = moment(recordToEdit.expiry_date).format("YYYY-MM-DD");
    form.setFieldsValue(recordToEdit);
    console.log('product to edit: ', recordToEdit);
  }, [form, recordToEdit]);

  return (
    <Modal
      title={t("general_add_edit_inv_pro")}
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

          <Form.Item
            name="product_name"
            label={t("general_product_name")}
            className="one-row-item"
            rules={[{ required: true, message: "Please provide a product name" }]}
          >
            <Input disabled={recordToEdit.source === REECE} />
          </Form.Item>

          <Form.Item
            name="supplier_part_number"
            label={t("general_supplier_part_#")}
            className="three-row-item"
            rules={[{ required: true, message: "Please provide a supplier part #" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="org_part_number"
            label={t("general_organisation_part_#")}
            className="three-row-item"
            rules={[{ required: true, message: "Please provide an organisation part #" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="manufacturer_part_number"
            label={t("general_manufacturer_part_#")}
            className="three-row-item"
            rules={[{ required: true, message: "Please provide a manufacturer part #" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label={t("general_product_picture")} name="image">
            <div className="flex">
              <div>
                {t("general_existing_picture")}
                <br />
                <ProductPhoto filename={recordToEdit && recordToEdit["image"]} width={120} />
              </div>
              <div className="mr-auto">
                {t("general_new_picture")} <br />
                <SvApiUploader
                  endpoint={`${environment.API.BASE_URL}${environment.API.VERSION}${environment.ENDPOINTS.UPLOAD_PRODUCT_PIC}`}
                  fileType="picture"
                  multiple={false}
                  maxCount={1}
                  sizeLimit={20}
                  onFileUploaded={({ name, path }) => {
                    form.setFieldsValue({ ["image"]: path });
                  }}
                />
                {/* <FileBase64 multiple={false} onDone={handleUploadChange} /> */}
              </div>
              <div className="ml-auto"></div>
            </div>
          </Form.Item>

          <Form.Item
            name="description"
            label={t("quick_setup_job_tags_grid_description")}
            className="one-row-item"
            rules={[{ required: true, message: "Please provide some description" }]}
          >
            <Input.TextArea disabled={recordToEdit.source === REECE}/>
          </Form.Item>

          <Form.Item
            name="inventory_category_id"
            label={t("general_inventory_category")}
            className="two-row-item"
            rules={[{ required: true, message: "Please select an inventory category" }]}
          >
            <Select options={data.categories} disabled={recordToEdit.source === REECE} />
          </Form.Item>

          <Form.Item
            name="default_supplier_id"
            label={t("general_default_supplier")}
            className="two-row-item"
            rules={[{ required: true, message: "Please select a default supplier" }]}
          >
            <Select options={data.suppliers} disabled={recordToEdit.source === REECE} />
          </Form.Item>

          <Form.Item
            name="qty_per_pack"
            label={t("general_quantity_per_pack")}
            className="two-row-item"
            rules={[{ required: true, message: "Please enter Quantity per pack" }]}
          >
            <InputNumber defaultValue={0} />
          </Form.Item>

          <Form.Item
            name="unit"
            label="Measurement Unit"
            className="two-row-item"
            rules={[{ required: true, message: "Please enter measurement unit e.g. KG, Milimeters" }]}
          >
            <Input disabled={recordToEdit.source === REECE} />
          </Form.Item>

          <Form.Item
            name="lead_time"
            label={t("general_lead_time_(hours)")}
            className="two-row-item"
            rules={[{ required: true, message: "Please enter Lead time" }]}
          >
            <InputNumber defaultValue={0} />
          </Form.Item>

          <Form.Item
            name="rrp"
            label={t("general_rrp")}
            className="two-row-item"
            rules={[{ required: true, message: "Please enter RRP value" }]}
          >
            <InputNumber defaultValue={0.0} disabled={recordToEdit.source === REECE} />
          </Form.Item>

          <Form.Item
            name="cost"
            label={t("general_cost")}
            className="two-row-item"
            rules={[{ required: true, message: "Please enter cost" }]}
          >
            <InputNumber addonBefore="$" defaultValue={0.0} disabled={recordToEdit.source === REECE} />
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

export default Form_Product;
