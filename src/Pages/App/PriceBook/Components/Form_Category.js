import { useState, useEffect, useContext } from "react";
import { FormButtons } from "Components/Common/FormButtons";
import TextArea from "antd/lib/input/TextArea";
import Context from "Store/Context";
import DefaultService from "Services/API/DefaultService";
import { trackPromise } from "react-promise-tracker";
import { notify } from "Services/ToastService";
import { getChildNode } from "Lib/ReactHelper";
import { getLookupTree } from "Lib/ReactHelper";
import { useTranslation } from "react-i18next";

const { Modal, Form, Input, Select, Radio, InputNumber, TreeSelect } = require("antd");

const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_Category = ({ form, showForm, recordToEdit, handleCancel, onFinish, onFinishFailed, ENTITY, data }) => {
  const { t } = useTranslation();
  const { curOrg: organisation } = useContext(Context);

  const [categoryTree, setCategoryTree] = useState();
  const [selectedIndustryId, setSelectedIndustryId] = useState();
  useEffect(async () => {
    if (recordToEdit) {
      if (recordToEdit.industry_id || data.selectedIndustryId) {
        await onIndustryChanged(recordToEdit.industry_id || data.selectedIndustryId);
        recordToEdit.industry_id = recordToEdit.industry_id || data.selectedIndustryId;
      }
    }
    form.setFieldsValue(recordToEdit);
    console.log("form", form.getFieldsValue());
    console.log("parent_category", form.getFieldsValue(["parent_category_id"]));
  }, [recordToEdit]);

  const onIndustryChanged = async (i) => {
    let { data: cTree } = await trackPromise(
      DefaultService.Entity_List("PriceBook_ServiceCategory", { organisation_id: organisation.id, industry_id: i })
    );

    cTree = getLookupTree(cTree, "id", "title", "children");

    setCategoryTree(cTree);
    console.log(cTree);
    setSelectedIndustryId(i);
  };

  return (
    <Modal
      title={t("general_add_edit_Service_category")}
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
            name="title"
            label={t("general_category_title")}
            className="one-row-item"
            rules={[{ required: true, message: "Please provide a title" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="industry_id"
            label={t("quick_setup_service_types_grid_industry")}
            className="one-row-item"
            rules={[{ required: true, message: "Please select an industry" }]}
          >
            <Select multiple={false} options={data.industries} onChange={(i) => onIndustryChanged(i)} />
          </Form.Item>

          <Form.Item
            name="parent_category_id"
            label={t("general_parent_category_(leave_blank_for_root_level_category)")}
            className="one-row-item"
          >
            <TreeSelect
              style={{ width: "100%" }}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              placeholder="Please select"
              treeDefaultExpandAll
              treeData={categoryTree}
              // fieldNames={{ label: "title", value: "id", children: "children" }}
              value={form.getFieldsValue("parent_category_id")}
              onTreeLoad={() => {
                console.log("cat tree", categoryTree);
              }}
              onChange={(v) => {
                //console.log(v);
                //console.log("tree data", categoryTree);
                console.log("selected parent category", v);
                form.setFieldsValue({ parent_category_id: v });
              }}
            ></TreeSelect>
          </Form.Item>

          <Form.Item
            name="description"
            label={t("general_description")}
            className="one-row-item"
            rules={[{ required: true, message: "Please enter some description" }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="sort_order"
            label={t("general_sort_order")}
            className="one-row-item"
            rules={[{ required: true, message: "Please enter a sort order" }]}
          >
            <InputNumber defaultValue={0} />
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

export default Form_Category;
