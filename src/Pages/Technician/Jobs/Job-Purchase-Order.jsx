import React, { useState, useCallback, useEffect } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import {
  Row, Col, Typography, Card, Button, Table, Space, Popconfirm, Form, Input,
  InputNumber, Select
} from "antd";
import _ from "lodash";
import { notify } from "Services/ToastService";
import TechJobService from "Services/API/Technician/TechJobService";
import TechJobPurchaseOrder from "Services/API/Technician/TechJobPurchaseOrder";
import { DeleteFilled } from "@ant-design/icons";
import AuthService from "Services/AuthService";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

const Job_Purchase_Order = (props) => {

  const user = AuthService.getCurrentTechnician();
  const ORGANISATION_ID = user ? user.organisation_id : 0;
  const USER_ID = user ? user.id : 0;

  let history = useHistory();
  let { jid, page } = useParams();
  const { dtJob } = props.location
  const [job, setJob] = useState(dtJob);
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [dtPurchaseOrder, setPurchaseOrder] = useState(null);
  const [dtSupplier, setSuppliers] = useState(null);
  const [dtReeceBranches, setReeceBranches] = useState(null);
  const [SupplierID, setSupplierID] = useState();
  const [dtProducts, setProducts] = useState(null);
  const [showReeceBranches, setShowReeceBranches] = useState(false);
  const [CurProductPrice, setCurProductPrice] = useState(0);
  const [record, setRecord] = useState([]);
  const [techInstruction, settechInstruction] = useState("");
  const [reeceBranchId, setReeceBranchId] = useState(0);

  const selectProductOption = [];
  const selectSupplierOption = [];
  const selectReeceBranchesOption = [];

  const columns = [
    {
      title: "Product",
      dataIndex: "product_name",
      key: "product_name",
      className: "ant-table-cell",
      align: "left",
      render: (value, record) => {
        return (
          <>
            <b className="text-success">{record.product_name}</b>
            <br />
            {record.description}
          </>
        );
      },
    },
    {
      title: "Qty",
      dataIndex: "qunatity",
      key: "quantity",
      className: "ant-table-cell",
      align: "center",
      render: (value, record) => {
        return <>{record.quantity}</>;
      },
    },
    {
      title: "Total",
      dataIndex: "price",
      key: "price",
      className: "ant-table-cell",
      align: "center",
      render: (value, record) => {
        return <>${record.price}</>;
      },
    },
    {
      title: "",
      dataIndex: "id",
      key: "operation",
      align: "center",
      render: (value, data) => (
        <Space size={20} align="center">
          <Popconfirm
            title={`Are you sure to remove this product`}
            onConfirm={(event) => {
              event.stopPropagation();
              const _record = record.filter((i) => i.title !== record.title);
              console.log(_record);
              setRecord(_record);
              setPurchaseOrder(_record);
            }}
          >
            <DeleteFilled className="text-danger text-large" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    console.log("ORGANISATION_ID", ORGANISATION_ID);
    async function fetchData() {
      if (!job) {
        if (!jid) {
          return history.push("/technician/jobs/");
        }
        const { data } = await TechJobService.GetTechJob(jid);
        setJob(data);
      }
    }
    fetchData();
    loadSupplier();
    loadProduct();
    loadReeceBranches();
  }, [ORGANISATION_ID]);

  const loadSupplier = useCallback(async () => {
    let param = {
      "condition": { "organisation_id": ORGANISATION_ID }
    }

    const { data } = await TechJobPurchaseOrder.GetSuppliers(param);
    await _.forEach(data, function (value) {
      selectSupplierOption.push({ label: value.name, value: value.id });
    });
    setSuppliers(selectSupplierOption);
  }, []);

  const loadProduct = useCallback(async () => {
    let param = {
      "condition": { "organisation_id": ORGANISATION_ID }
    }
    const { data } = await TechJobPurchaseOrder.GetProducts(param);

    await _.forEach(data, function (value) {
      selectProductOption.push({ label: value.product_name, value: value.id + "|" + value.cost });
    });
    setProducts(selectProductOption);

    console.log('selectProductOption', selectProductOption)

  }, []);

  const loadReeceBranches = useCallback(async () => {
    let param = {
      job_id: jid
    };
    const { data } = await TechJobPurchaseOrder.GetReeceBranches(param);
    await _.forEach(data, function (value) {
      selectReeceBranchesOption.push({ label: `[${value.branch_number}] ${value.name} - ${value.address}`, value: value.id });
    });
    setReeceBranches(selectReeceBranchesOption);
  }, []);

  const onProductChange = (value, label) => {
    console.log('label', label)
    setCurProductPrice(value.split('|')[1]);
    form.setFieldsValue({
      product_id: value.split('|')[0],
      unit_price: value.split('|')[1],
      product_name: label.label
    });

    calculateProductPrice();
  };

  const onSupplierChange = (value) => {
    setSupplierID(value);

    var supplier = dtSupplier.find((item) => item.value === value);
 
    setShowReeceBranches(supplier.label.toLowerCase() === "reece" ? true : false);
  };

  const onReeceBranchChange = async (value) => {
    setReeceBranchId(value);
  };
  const calculateProductPrice = () => {
    let qty = form.getFieldValue("quantity") || 1;
    let unit_price = form.getFieldValue("unit_price") || 0;
    let total_price = parseInt(qty) * parseFloat(unit_price);
    form.setFieldsValue({ price: total_price });

  };
  const handleCancel = () => {
    form.resetFields();
  };
  const handleSave = async () => {
    if (techInstruction === '') {
      return notify("Instruction is required.", false)
    }
    let param_order = {
      "organisation_id": ORGANISATION_ID,
      "job_id": jid,
      "field_technician_id": USER_ID,
      "supplier_id": SupplierID,
      "status_id": 1,
      "instructions": techInstruction,
      "products": dtPurchaseOrder,
      "additional_information": JSON.stringify({ "reece_branch_number": reeceBranchId }),
      "is_active": true
    }
    const { data } = await TechJobPurchaseOrder.CreatePurchaseOrder(param_order);
    setPurchaseOrder(null);
    notify("Purchase order added successfully!", true);
  };
  const addProduct = async () => {
    let product = form.getFieldsValue();
    let arrProducts = [...record];
    arrProducts.push(product);
    await setRecord(arrProducts);
    await setPurchaseOrder(arrProducts);
    form.resetFields();
    console.table(dtPurchaseOrder);
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <Title level={4}> {t("general_add_purchase_order")} </Title>
        </Col>
      </Row>
      {dtSupplier !== null && dtProducts !== null ? (
        <Row>
          <Col span={24}>
            <Card title={<Title level={5}> {t("general_add_product")} </Title>}>
              <Space span={24} direction="vertical" size="small" style={{ display: 'flex' }}>
                <Row>
                  <Col span={24}>
                    <div role="cell" class="ant-col ant-form-item-label"><label for="form-rename-option_supplier_id" class="ant-form-item-required" title="Supplier Name">Supplier Name</label></div>
                    <Select options={dtSupplier} allowClear onChange={onSupplierChange} style={{ width: "99%" }}>
                    </Select>
                  </Col>
                </Row>
                {showReeceBranches && (
                <Row>
                  <Col span={24}>
                    <div role="cell" class="ant-col ant-form-item-label">
                      <label for="form-rename-option_supplier_id" class="ant-form-item-required" title="Reece Branches">Reece Branches</label>
                    </div>
                    <Select options={dtReeceBranches} allowClear onChange={onReeceBranchChange} style={{ width: "99%" }} />
                  </Col>
                </Row>
                )}
                <Row>
                  <Col span={24}>
                    <Form
                      form={form}
                      name={`form-rename-option`}
                      layout="vertical"
                      initialValues={{}}
                      labelCol={{}}
                      wrapperCol={{}}
                      autoComplete="off"
                      size="middle"
                      onFinish={addProduct}
                    >
                      <div className="">
                        <Form.Item hidden={true} name="product_id" />
                        {/* <Form.Item
                          name="supplier_id"
                          label="Supplier Name"
                          rules={[{ required: true, message: "Please Select Supplier" }]}
                          hasFeedback
                          className="one-row-item"
                        >
                          <Select options={dtSupplier} allowClear onChange={onSupplierChange}>
                          </Select>
                        </Form.Item> */}
                        <Form.Item
                          name="product_name"
                          label="Product Name"
                          rules={[{ required: true, message: "Please Select Product" }]}
                          hasFeedback
                          className="one-row-item"
                        >
                          <Select options={dtProducts} allowClear onChange={onProductChange}>
                          </Select>
                        </Form.Item>

                        <Row>
                          <Col span={8}>
                            <Form.Item
                              name="unit_price"
                              label="Unit Price($)"
                              initialValue={0}
                            >
                              <InputNumber
                                disabled
                                addonBefore="$"
                                value={CurProductPrice}
                                style={{ width: "99%" }}
                                min={0}
                                max={99999}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              name="quantity"
                              label="Quantity"
                              rules={[{ required: true, message: "Quantity is required" }]}
                              hasFeedback
                              initialValue={1}
                            >
                              <InputNumber onChange={calculateProductPrice} style={{ width: "99%" }} min={1} max={9999} />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              name="price"
                              label="Grand Total($)"
                              initialValue={0}
                            >
                              <InputNumber
                                disabled
                                addonBefore="$"
                                value={CurProductPrice}
                                style={{ width: "99%" }}
                                min={0}
                                max={99999}
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Form.Item>
                          <Row className="mt-5" gutter={2}>
                            <Col span={12} >
                              <Button htmlType="submit" className="btn btn-" size="large" style={{ width: "100%" }} >
                                {t("general_add_product")}
                              </Button>
                            </Col>
                            <Col span={12} className="text-left">
                              <Button size="large" danger type="dashed" onClick={handleCancel} style={{ width: "100%" }}>
                                {t("quick_setup_organizations_modal_button_cancel")}
                              </Button>
                            </Col>
                          </Row>

                        </Form.Item>
                      </div>
                    </Form>
                  </Col></Row>
                <Row>
                  <Col span={24}>
                    {dtPurchaseOrder === null ? "" : <Table
                      className="ant-table-custom"
                      style={{ width: "100%" }}
                      cellClassName="ant-table-cell"
                      rowClassName="dx-row dx-data-row dx-row-lines dx-column-lines dx-row-alt"
                      columns={columns}
                      expandable={false}
                      dataSource={dtPurchaseOrder}
                      rowkey={(record) => record.product_id}
                      pagination={false}
                    />}
                  </Col>
                </Row>
                <Row>
                  <Col span={24} className="text-left">
                    <Title level={5}>{t("general_special_instruction_by_techhician")}</Title>
                  </Col>
                </Row>
                <Row>
                  <Col span={24} className="text-center">
                    <textarea required onChange={e => settechInstruction(e.target.value)} style={{ height: "200px", width: "98%" }}>{techInstruction}</textarea>
                  </Col>
                </Row>
                <Row className="mt-5" gutter={2}>
                  <Col span={12} >
                    <Link
                      style={{ width: "100%" }}
                      className="ant-btn ant-btn-danger btn-large"
                      to={{
                        pathname: `/technician/jobs/job-purchase-order-list/${jid}/${page}`,
                        dtJob: job // your data array of objects
                      }}
                    >Close</Link>
                  </Col>
                  <Col span={12} className="text-left">
                    {dtPurchaseOrder && dtPurchaseOrder.length > 0 ? <Button type="primary" onClick={handleSave} style={{ width: "100%" }}>
                      {t("general_save_send")}
                    </Button> : ""}

                  </Col>
                </Row>
              </Space>
            </Card>
          </Col>

        </Row>

      ) : (
        <Row>
          <Col>
            <Typography>{t("general_wait_for_loading_job_purchase_order_data")}</Typography>
          </Col>
        </Row>
      )}
    </>
  );
};

export default Job_Purchase_Order;
