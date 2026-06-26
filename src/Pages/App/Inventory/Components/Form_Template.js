import { useEffect, useContext } from "react";
import { FormButtons } from "Components/Common/FormButtons";
import { DeleteFilled, PlusOutlined } from "@ant-design/icons";
import Context from "Store/Context";
import { useTranslation } from "react-i18next";

const { Modal, Form, Input, Select, Radio, Button, Row, Col, Popconfirm, InputNumber } = require("antd");

const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_Template = ({ form, showForm, recordToEdit, handleCancel, onFinish, onFinishFailed, ENTITY, data }) => {
  const { t } = useTranslation();
  const { curOrg: organisation } = useContext(Context);

  useEffect(() => {
    //recordToEdit.expiry_date = moment(recordToEdit.expiry_date).format("YYYY-MM-DD");
    form.setFieldsValue(recordToEdit);
  }, [form, recordToEdit]);

  return (
    <Modal
      title={t("general_add_edit_inv_temp")}
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
            name="industry_id"
            label={t("general_industry")}
            className="two-row-item"
            rules={[{ required: true, message: "Please select an industry" }]}
          >
            <Select options={data.industries} />
          </Form.Item>

          <Form.Item
            name="name"
            label={t("price_book_option_template_grid_template_name")}
            className="two-row-item"
            rules={[{ required: true, message: "Please provide a template name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="is_active" label={t("label_status")} initialValue={true} className="one-row-item">
            <Radio.Group
              options={[
                { label: t("label_active"), value: true },
                { label: t("label_inactive"), value: false },
              ]}
            />
          </Form.Item>

          <div className="box-primary bg-blue box-pad mb-3" style={{ width: "100%" }}>
            <h4>{t("general_products_in_template")}</h4>
            <Products
              form={form}
              initialValue={recordToEdit !== null ? form.getFieldValue("products") : null}
              products={data.products}
            />
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default Form_Template;

function Products({ form, initialValue, products }) {
  const { t } = useTranslation();
  //initialValue = [];

  return (
    <>
      <Row align="top" justify="start" gutter={4}>
        <Col span={1}>#</Col>
        <Col span={2}></Col>
        <Col span={18}> {t("general_product_name")} </Col>
        <Col span={3}> {t("general_capacity")} </Col>
      </Row>
      <Form.List name="products" initialValue={initialValue}>
        {(fields, { add, remove }) => {
          return (
            <div>
              {fields.map((field, index) => (
                <div key={field.key}>
                  <Form.Item hidden name="id" />
                  {/* <Divider>{getRank(index + 1)} Product</Divider> */}
                  <Row align="top" justify="end" gutter={4}>
                    <Col span={1}>
                      {
                        //getRank(index + 1)
                        index + 1
                      }
                    </Col>
                    <Col span={2}>
                      {fields.length > 0 ? (
                        <Form.Item style={{ display: "inline-block" }}>
                          <Popconfirm title="Remove this product?" onConfirm={() => remove(field.name)}>
                            <Button type="danger" className="dynamic-delete-button">
                              <DeleteFilled />
                            </Button>
                          </Popconfirm>
                        </Form.Item>
                      ) : null}
                    </Col>
                    <Col span={18}>
                      <Form.Item
                        name={[index, "id"]}
                        valuePropName="value"
                        rules={[{ required: true, message: "Product is required" }]}
                      >
                        <Select
                          showSearch
                          //mode="multiple"
                          //style={{ width: "100%" }}
                          //placeholder="Select Principals where this contact is Account Executive"
                          optionFilterProp="children"
                          filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          options={products}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        name={[index, "capacity"]}
                        rules={[{ required: true, message: "Capacity number is required" }]}
                      >
                        <InputNumber placeholder="Capacity" style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              ))}

              <Row align="top" justify="end" gutter={4}>
                <Col span={24} className="text-right">
                  <Button type="dashed" onClick={() => add()}>
                    <PlusOutlined /> Add {`${fields.length > 0 ? " another " : " a "}`} product
                  </Button>
                </Col>
              </Row>
            </div>
          );
        }}
      </Form.List>
    </>
  );
}
