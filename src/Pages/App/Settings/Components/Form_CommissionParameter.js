import { useState, useEffect, useContext } from "react";
import { FormButtons } from "Components/Common/FormButtons";
import { DeleteFilled, PlusSquareOutlined } from "@ant-design/icons";
import { getRank } from "Lib/JsHelper";
import Context from "Store/Context";
import LookupService from "Services/API/LookupService";
import { trackPromise } from "react-promise-tracker";
import { useTranslation } from "react-i18next";

const { Modal, Form, Select, Radio, Button, Divider, Row, Col, Popconfirm, InputNumber } = require("antd");

const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_CommissionParameter = ({
  form,
  showForm,
  recordToEdit,
  handleCancel,
  onFinish,
  onFinishFailed,
  ENTITY,
  data,
}) => {
  const { t } = useTranslation();
  const { curOrg: organisation } = useContext(Context);
  const [technicianRoles, setTechnicianRoles] = useState();
  useEffect(async () => {
    if (recordToEdit && recordToEdit.industry_id) {
      await onIndustryChanged(recordToEdit.industry_id);
    }
    form.setFieldsValue(recordToEdit);
  }, [form, recordToEdit]);

  const onIndustryChanged = async (i) => {
    let tRoles = await trackPromise(LookupService.TechnicianRoles({ industry_id: i }));
    setTechnicianRoles(tRoles);
    let foundTr = tRoles.find((r) => r.id === recordToEdit.technician_role_id);

    form.setFieldsValue({ industry_id: i, technician_role_id: foundTr && foundTr.value });
  };

  return (
    <Modal
      title={t("general_add_edit_com_para")}
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
          name="industry_id"
          label={t("quick_setup_service_types_grid_industry")}
          className="two-row-item"
          rules={[{ required: true, message: "Please select an industry" }]}
        >
          <Select multiple={false} options={data.industries} onSelect={async (i) => onIndustryChanged(i)} />
        </Form.Item>
        <Form.Item
          name="technician_role_id"
          label={t("general_technician")}
          className="two-row-item"
          rules={[{ required: true, message: "Please select a technician role" }]}
        >
          <Select multiple={false} options={technicianRoles} />
        </Form.Item>

        <div className="box-primary bg-blue box-pad mb-3" style={{ width: "100%" }}>
          <Ranges form={form} initialValue={recordToEdit !== null ? form.getFieldValue("ranges") : null} />
        </div>
        {/* <Form.Item
          name="ranges"
          label="Field Technicians"
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
          />
        </Form.Item> */}
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

export default Form_CommissionParameter;

function Ranges({ form, initialValue }) {
  //initialValue = [];
  const { t } = useTranslation();
  return (
    <Form.List name="ranges" initialValue={initialValue}>
      {(fields, { add, remove }) => {
        return (
          <div>
            {fields.map((field, index) => (
              <div key={field.key}>
                <Form.Item hidden name="id" />
                <Form.Item hidden name="organisation_id" />
                <Divider>{getRank(index + 1)} Range</Divider>
                <Row align="top" justify="start" gutter={4}>
                  <Col span={3}>
                    {fields.length > 0 ? (
                      <Form.Item style={{ display: "inline-block", marginTop: "26px" }}>
                        <Popconfirm title="Remove this range?" onConfirm={() => remove(field.name)}>
                          <Button type="danger" className="dynamic-delete-button">
                            <DeleteFilled />
                          </Button>
                        </Popconfirm>
                      </Form.Item>
                    ) : null}
                  </Col>
                  <Col span={7}>
                    <Form.Item
                      label="Min"
                      name={[index, "low_range"]}
                      valuePropName="value"
                      rules={[{ required: true, message: "Min range value is required" }]}
                    >
                      <InputNumber addonBefore="$" defaultValue={0.0} />
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item
                      label="Max"
                      name={[index, "high_range"]}
                      rules={[{ required: true, message: "Max range value is required" }]}
                    >
                      <InputNumber addonBefore="$" defaultValue={0.0} />
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item
                      label={t("general_percentage(%)")}
                      name={[index, "percentage"]}
                      rules={[{ required: true, message: "percentage is required" }]}
                    >
                      <InputNumber addonAfter="%" defaultValue={0.0} />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            ))}
            <Form.Item style={{ width: "110px" }} className="mr-auto mt-5">
              <Button type="dashed" onClick={() => add()}>
                <PlusSquareOutlined /> Add {`${fields.length > 0 ? " another " : " a "}`} range
              </Button>
            </Form.Item>
          </div>
        );
      }}
    </Form.List>
  );
}
