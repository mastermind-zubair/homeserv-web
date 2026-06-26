import { useState, useEffect, useContext } from "react";
import { FormButtons } from "Components/Common/FormButtons";
import { DeleteFilled, InboxOutlined, PlusOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { getRank } from "Lib/JsHelper";
import moment from "moment";
import Context from "Store/Context";
import { trackPromise } from "react-promise-tracker";
import DefaultService from "Services/API/DefaultService";
import { getLookupTree } from "Lib/ReactHelper";
import LookupService from "Services/API/LookupService";
import { filterByMultipleIds } from "Lib/ReactHelper";
import CustomDataGrid from "Components/DevEx/CustomDataGrid";
import _, { map } from "lodash";
import { notify } from "Services/ToastService";
import environment from "Environment";
import UploaderService from "Services/API/UploaderService";
import { useTranslation } from "react-i18next";

const {
  Modal,
  Form,
  Input,
  Select,
  Checkbox,
  Radio,
  Button,
  Image,
  Switch,
  Tabs,
  DatePicker,
  Divider,
  Row,
  Col,
  Tooltip,
  Popconfirm,
  InputNumber,
  TreeSelect,
  Upload,
} = require("antd");


const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_Service = ({ form, showForm, recordToEdit, handleCancel, onFinish, onFinishFailed, ENTITY, data }) => {
  const { t } = useTranslation();
  const { curOrg: organisation } = useContext(Context);

  const [selectedIndustryId, setSelectedIndustryId] = useState();
  const [selectedBillableHourlyRate, setSelectedBillableHourlyRate] = useState(0);
  const [categoryTree, setCategoryTree] = useState();
  const [serviceTypes, setServiceTypes] = useState();
  //const [tasks, setTasks] = useState();
  //const [utilities, setUtilities] = useState();
  //const [products, setProducts] = useState();

  const [selectedProducts, setSelectedProducts] = useState();
  const [selectedTasks, setSelectedTasks] = useState();
  const [selectedUtilities, setSelectedUtilities] = useState();

  const normFile = (e) => {
    console.log("Upload event:", e);

    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };

  useEffect(async () => {
    if (recordToEdit) {
      onTaskChanged(recordToEdit.tasks);
      onUtilityChanged(recordToEdit.utilities);
      //onProductChanged(recordToEdit.products);

      setSelectedProducts(recordToEdit.products);

      if (recordToEdit.industry_id || data.selectedIndustryId) {
        await onIndustryChanged(recordToEdit.industry_id || data.selectedIndustryId);
        recordToEdit.industry_id = recordToEdit.industry_id || data.selectedIndustryId;
      }
    }

    form.setFieldsValue(recordToEdit);
    console.log("form", form.getFieldsValue());
  }, [recordToEdit]);

  useEffect(() => {
    const tax_rate = organisation.tax_rate;

    let selBHR = 0;
    let bhRate = _.find(data.billableHourlyRates, { industry_id: selectedIndustryId });
    if (!bhRate) {
      //notify("No billable hourly rate found for his industry.", false);
      console.log("No billable hourly rate found for his industry.");
      return;
    } else {
      selBHR = bhRate.rate || 0;
    }

    let billable_hours = _.sumBy(selectedTasks, function (t) {
      return t.duration;
    });

    let labor_cost = billable_hours * selBHR;

    let product_cost = _.sumBy(selectedProducts, function (p) {
      return p.rrp * p.quantity;
    });

    let utility_cost = _.sumBy(selectedUtilities, function (u) {
      return u.cost;
    });

    recordToEdit.tax_rate = _.round(tax_rate, 2);
    recordToEdit.billable_hours = _.round(billable_hours || 0, 2);
    recordToEdit.billable_hourly_rate = _.round(selBHR, 2);
    recordToEdit.labor_cost = _.round(labor_cost, 2);
    recordToEdit.product_cost = _.round(product_cost, 2);
    recordToEdit.utility_cost = _.round(utility_cost, 2);
    recordToEdit.price = _.round(labor_cost + product_cost + utility_cost || 0, 2);
    recordToEdit.tax = _.round(recordToEdit.price * (tax_rate / 100) || 0, 2);
    recordToEdit.total_price = _.round(recordToEdit.price + recordToEdit.tax || 0, 2);

    recordToEdit.tasks =
      selectedTasks &&
      selectedTasks.map((t) => {
        return t.id;
      });
    recordToEdit.utilities =
      selectedUtilities &&
      selectedUtilities.map((u) => {
        return u.id;
      });
    recordToEdit.products =
      selectedProducts &&
      selectedProducts.map((p) => {
        return { product_id: p.id, quantity: p.quantity };
      });

    form.setFieldsValue(recordToEdit);
  }, [selectedIndustryId, selectedProducts, selectedTasks, selectedUtilities]);

  const onIndustryChanged = async (i) => {
    let cTree = data.categories.filter((c) => c.industry_id === i);

    form.setFieldsValue(recordToEdit);

    cTree = getLookupTree(cTree, "id", "title", "children");

    setCategoryTree(cTree);
    setServiceTypes(data.serviceTypes.filter((st) => st.industry_id === i));

    setSelectedIndustryId(i);
  };

  const onServiceTypeChanged = (st) => {
    console.log("selected serviceTypes", st);
  };
  const onTaskChanged = (t) => {
    console.log("selected tasks", t);
    if (!data.tasks || !t) return;

    let selTasks = filterByMultipleIds(data.tasks, "id", t);
    setSelectedTasks(selTasks);
  };

  const onUtilityChanged = (u) => {
    console.log("selected utilities", u);
    if (!data.utilities || !u) return;

    let selUtilities = filterByMultipleIds(data.utilities, "id", u);
    setSelectedUtilities(selUtilities);
  };

  const onProductChanged = (selProdIds) => {
    console.log("sel prod ids", selProdIds);
    if (!data.products || !selProdIds) return;

    let selProds = filterByMultipleIds(data.products, "id", selProdIds);

    let sp = map(selProds, (p) => {
      let existingProd = _.find(selectedProducts, { id: p.id });

      return existingProd || { ...p, quantity: 0 };
    });

    setSelectedProducts(sp);
    form.setFieldsValue(recordToEdit);
  };

  const onProductQtyUpdated = (rows) => {
    console.log(rows);
    if (rows && rows.length > 0) {
      const updatedProd = rows[0].data;

      let selProds = selectedProducts.map((p) => {
        let prod = { ...p };
        if (p.id === updatedProd.id) {
          prod.quantity = updatedProd.quantity || 0;
        }
        return p;
      });

      setSelectedProducts(selProds);
    }
  };

  return (
    recordToEdit && (
      <Modal
        title={t("general_add_edit_service")}
        visible={showForm}
        width={768}
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
            size="large"
            onFinish={(f) => {
              //f.products = selectedProducts;
              let isValidQty = true;
              f.products.forEach((p) => {
                if (!p.quantity || p.quantity === 0) {
                  isValidQty = false;
                  return;
                }
              });
              if (!isValidQty) {
                notify("Some products do not have valid quantity", false);
              } else {
                onFinish(f);
              }
            }}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item name="id" hidden />
            <Form.Item name="organisation_id" hidden />
            <Form.Item name="products" hidden />

            <div className="box box-pad bg-orange">
              <Form.Item
                name="billable_hours"
                label={t("general_bllable_hours")}
                className="three-row-item"
                rules={[{ required: true, message: "Please enter billable hours" }]}
              >
                <InputNumber className="label-heading" readOnly={true} />
              </Form.Item>

              <Form.Item
                name="billable_hourly_rate"
                label={t("general_billable_hourly_rate_$")}
                className="three-row-item"
                rules={[{ required: true, message: "Please enter billable hourly rate" }]}
              >
                <InputNumber className="label-heading" readOnly={true} />
              </Form.Item>
              <Form.Item
                name="tax_rate"
                label={t("general_org_tax_rate_(%)")}
                className="three-row-item"
                rules={[{ required: true, message: "Please enter billable hourly rate" }]}
              >
                <InputNumber className="label-heading" readOnly={true} />
              </Form.Item>

              <Form.Item
                name="labor_cost"
                label={t("general_labor_cost ($)")}
                className="three-row-item"
                rules={[{ required: true, message: "Please enter labour cost" }]}
              >
                <InputNumber className="label-heading" readOnly={true} />
              </Form.Item>
              <Form.Item
                name="product_cost"
                label={t("general_product_cost_($)")}
                className="three-row-item"
                rules={[{ required: true, message: "Please enter product cost" }]}
              >
                <InputNumber className="label-heading" readOnly={true} />
              </Form.Item>
              <Form.Item
                name="utility_cost"
                label={t("general_utility_cost_($)")}
                className="three-row-item"
                rules={[{ required: true, message: "Please enter utility cost" }]}
              >
                <InputNumber className="label-heading" readOnly={true} />
              </Form.Item>

              <Form.Item
                name="price"
                label={t("general_price_($)")}
                className="three-row-item"
                rules={[{ required: true, message: "Please enter price" }]}
              >
                <InputNumber className="label-heading" readOnly={true} />
              </Form.Item>
              <Form.Item
                name="tax"
                label={t("general_tax_($)")}
                className="three-row-item"
                rules={[{ required: true, message: "Please enter tax amount" }]}
              >
                <InputNumber className="label-heading" readOnly={true} />
              </Form.Item>

              <Form.Item
                name="total_price"
                label={t("general_total_Price_($)")}
                className="three-row-item"
                rules={[{ required: true, message: "Please enter total price" }]}
              >
                <InputNumber className="label-heading" readOnly={true} />
              </Form.Item>
            </div>
            <Form.Item
              name="industry_id"
              label={t("general_industry")}
              className="one-row-item"
              rules={[{ required: true, message: "Please select an industry" }]}
            >
              <Select multiple={false} options={data.industries} onChange={(i) => onIndustryChanged(i)} />
            </Form.Item>

            <Form.Item
              name="category_id"
              label={t("general_service_category")}
              className="two-row-item"
              rules={[{ required: true, message: "Please select a service category" }]}
            >
              <TreeSelect
                style={{ width: "100%" }}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                placeholder="Please select a category"
                treeDefaultExpandAll
                treeData={categoryTree}
                //  fieldNames={{ label: "title", value: "id", children: "children" }}
                value={form.getFieldsValue("category_id")}
                onChange={(v) => {
                  form.setFieldsValue({ category_id: v });
                }}
              ></TreeSelect>
            </Form.Item>

            <Form.Item
              name="service_types"
              label={t("side_menu_navigation_reports_sub_service_types")}
              className="two-row-item"
              rules={[{ required: true, message: "Please select service type(s)" }]}
            >
              <Select
                mode="tags"
                options={map(serviceTypes, (st) => {
                  return { label: st.name, value: st.id };
                })}
                onChange={(st) => onServiceTypeChanged(st)}
              />
            </Form.Item>

            <Form.Item
              name="title"
              label={t("general_title")}
              className="one-row-item"
              rules={[{ required: true, message: "Please enter service title" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="description"
              label={t("quick_setup_job_tags_grid_description")}
              className="one-row-item"
              rules={[{ required: true, message: "Please enter service description" }]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              name="tasks"
              label={t("general_tasks")}
              className="three-row-item"
              rules={[{ required: true, message: "Please select task(s)" }]}
            >
              <Select
                mode="multiple"
                options={map(data.tasks, (t) => {
                  return { label: t.title, value: t.id };
                })}
                onChange={(t) => onTaskChanged(t)}
              />
            </Form.Item>

            <Form.Item
              name="utilities"
              label={t("general_utilities")}
              className="three-row-item"
            // rules={[{ required: true, message: "Please select utilities(s)" }]}
            >
              <Select
                mode="multiple"
                options={map(data.utilities, (u) => {
                  return { label: u.code, value: u.id };
                })}
                onChange={(u) => onUtilityChanged(u)}
              />
            </Form.Item>

            <Form.Item
              label={t("side_menu_navigation_inventory_sub_products")}
              className="three-row-item"
              rules={[{ required: true, message: "Please select product(s)" }]}
            >
              <Select
                mode="multiple"
                options={map(data.products, (p) => {
                  return { label: p.product_name, value: p.id };
                })}
                onChange={(p) => onProductChanged(p)}
                value={
                  (selectedProducts &&
                    map(selectedProducts, (p) => {
                      if (p) {
                        return p.id;
                      }
                    })) ||
                  []
                }
              />
            </Form.Item>

            <div className="flex">
              {selectedProducts && (
                <CustomDataGrid
                  data={selectedProducts}
                  columns={[
                    {
                      dataField: "product_name",
                      caption: t("general_product_name"),
                    },
                    {
                      dataField: "org_part_number",
                      caption: t("general_org_part_#"),
                    },
                    {
                      dataField: "supplier_part_number",
                      caption: t("general_supplier_part_#"),
                    },

                    {
                      dataField: "rrp",
                      caption: t("general_rrp"),
                    },
                    {
                      caption: t("dashboard_job_search_quantity"),
                      dataField: "quantity",
                      dataType: "number",
                      alignment: "center",
                      allowEditing: true,
                      value: 0,
                    },
                  ]}
                  ENTITY={"Product"}
                  ENTITY_PLURAL={"Products"}
                  height="250px"
                  canDelete={false}
                  canEdit={false}
                  inlineEditing={true}
                  onSaved={(e) => onProductQtyUpdated(e.changes)}
                />
              )}
            </div>
            <div className="bg-blue box-pad" style={{ width: "100%" }}>
              <h3>{t("general_media_files")} </h3>

              <Form.Item name="media" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                <Upload.Dragger
                  name="media"
                  multiple={true}
                  maxCount={5}
                  listType="picture-card"
                  action={`${environment.API.BASE_URL}${environment.API.VERSION}${environment.ENDPOINTS.UPLOAD_SERVICE_MEDIA}`}
                  //method="post"
                  //headers={[{ "content-type": "multipart/form-data", Authorization: AuthService.getAuthToken() }]}
                  customRequest={(options) =>
                    UploaderService.UploadFile(options, ({ name, path, size, mimetype }) => {
                      const fields = form.getFieldsValue();
                      let docs = fields["media"];
                      let uploadedDocs = docs.map((d) => {
                        let doc = { ...d };
                        doc["file_path"] = path;
                        doc["file"] = name;
                        doc["file_size"] = size;
                        doc["mime_type"] = mimetype;
                        return doc;
                      });

                      fields["media"] = uploadedDocs;
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
                    let docs = fields["media"];

                    docs = docs.filter((v) => v.file !== file.file || v.name !== file.file);
                    fields["media"] = docs;
                    form.setFieldsValue(fields);
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag media files to this area to upload</p>
                  <p className="ant-upload-hint">
                    Works for single or bulk upload. Only JPEG, PNG and BMP images allowed
                  </p>
                </Upload.Dragger>
              </Form.Item>
            </div>
            <br />

            <br />
            <br />

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
    )
  );
};

export default Form_Service;
