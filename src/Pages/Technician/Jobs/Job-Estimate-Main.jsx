import { Link, useHistory, useParams } from "react-router-dom";
import {
  Row,
  Col,
  Typography,
  Card,
  Button,
  Badge,
  Checkbox,
  Radio,
  Space,
  Table,
  Modal,
  Popconfirm,
  Switch,
  Form,
  Input,
  InputNumber,
  TreeSelect,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import { MoneyFormat } from "Lib/DevExConstants";
import { DeleteFilled, EditOutlined, LeftOutlined } from "@ant-design/icons";
import _ from "lodash";
import { FormButtons } from "Components/Common/FormButtons";
import { notify } from "Services/ToastService";
import AuthService from "Services/AuthService";
import DefaultService from "Services/API/DefaultService";
import { trackPromise } from "react-promise-tracker";
import { getLookupTree } from "Lib/ReactHelper";
import CustomDataGrid from "Components/DevEx/CustomDataGrid";
import environment from "Environment";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

const { Title } = Typography;

const Job_Estimate_Main = (props) => {
  let history = useHistory();
  let { jid, qid } = useParams();

  const { dtJob, dtQuote } = props.location;
  const [job, setJob] = useState(dtJob);
  const [quote, setQuote] = useState(dtQuote);
  const { t } = useTranslation();
  const [organisation, setOrganisation] = useState();
  const [showOptionItems, setShowOptionItems] = useState(false);
  const [showRenameOption, setShowRenameOption] = useState(false);
  const [showAddItemSelection, setShowAddItemSelection] = useState(false);
  const [showAddItemsManual, setShowAddItemsManual] = useState(false);
  const [showAddItemsPB, setShowAddItemsPB] = useState(false);
  const [curJobOption, setCurJobOption] = useState();
  const [specialRateDiscount, setSpecialRateDiscount] = useState(false);

  const [jobOptions, setJobOptions] = useState([]);

  useEffect(async () => {
    let jb;
    let qt;
    let jo = [];

    if (!jid) {
      history.push("/technician/jobs/");
    }
    const { data: j } = await trackPromise(DefaultService.Entity_Get("JOB", jid));
    setJob(j);
    jb = { ...j };

    if (qid) {
      const { data: q } = await trackPromise(DefaultService.Entity_Get("Outbound_Quote", qid));
      setQuote(q);
      qt = { ...q };
      setJobOptions(q.options);
      // addNewOption();
    } else {
      setJobOptions(jo);
      addNewOption();
    }

    const { data: org } = await trackPromise(DefaultService.Entity_Get("QS_Organisation", jb.organisation_id));
    setOrganisation(org);

    //set job status to estimating
    const ftId = AuthService.getCurrentTechnician().id;
    const { status, message } = await trackPromise(
      DefaultService.PUT(`/job/f_t/estimating/${jb.id}`, {
        field_technician_id: ftId,
      })
    );
    notify(message, status);
    //console.log("JOB", jb);
    //console.log("QUOTE", qt);
  }, []);

  const handleRenameOption = (jobOption) => {
    setCurJobOption(jobOption);
    setShowRenameOption(true);
  };
  const handleRemoveOption = (jobOption) => {
    const options = jobOptions.filter((o) => o.title !== jobOption.title);

    setJobOptions(options);
  };
  const makeRecommended = (jobOption) => {
    const options = jobOptions.map((o) => {
      return { ...o, is_recommended: o.title === jobOption.title ? true : false };
    });
    //console.log(options);
    setJobOptions(options);
  };

  const handleAddNewItem = (jobOption) => {
    setCurJobOption(jobOption);
    setShowAddItemSelection(true);
  };

  const handleAddItemSelection = (type) => {
    if (type === "PB") {
      setShowAddItemsPB(true);
    } else {
      setShowAddItemsManual(true);
    }

    setShowAddItemSelection(false);
  };

  const viewItems = (jobOption) => {
    setCurJobOption(jobOption);
    setShowOptionItems(true);
  };

  const handleCancel = () => {
    hideAllPopups();
    setCurJobOption(null);
  };

  const addNewOption = () => {
    let options = [...jobOptions];
    options.push({
      title: "Option " + _.add(options.length, 1),
      items: [],
      is_accepted: false,
      is_recommended: false,
      amount: 0.0,
    });

    setJobOptions(options);
  };
  const updateOptionTitle = (jobOption) => {
    let options = [...jobOptions];
    options = options.map((o) => {
      return o.title === curJobOption.title ? { ...o, title: jobOption.title } : { ...o };
    });
    //console.log(options);
    setJobOptions(options);
    setShowRenameOption(false);
    setShowOptionItems(false);
  };
  const handleUpdateItems = (jobOption) => {
    const options = [...jobOptions];
    let amount = _.sumBy(jobOption.items, function (o) {
      return o.price;
    });

    let opts = options.map((o) => {
      if (o.title === jobOption.title) {
        return { ...jobOption, amount: _.round(amount, 2) };
      }
      return { ...o };
    });

    setJobOptions(opts);
  };

  function hideAllPopups() {
    setShowAddItemSelection(false);
    setShowAddItemsManual(false);
    setShowAddItemsPB(false);
    setShowOptionItems(false);
    setShowRenameOption(false);
  }

  const getOptionTotal = (jobOption) => {
    if (!job || !jobOption) return 0;
    let jobPriorityFee = (job && job.job_priority && job.job_priority.fee) || 0.0;
    let discountTagRate =
      (job &&
        specialRateDiscount &&
        job.discount_tag &&
        job.discount_tag.special_rate_discounts &&
        job.discount_tag.special_rate_discounts.length > 0 &&
        job.discount_tag.special_rate_discounts[0].rate_discount) ||
      0.0;

    console.log('discountTagRate', discountTagRate);

    let basicPrice = _.round(
      _.sumBy(jobOption.items, function (o) {
        return o.price;
      }),
      2
    );
    console.info('basicPrice', basicPrice);
    // let netPrice = basicPrice > 0 ? basicPrice - (basicPrice * discountTagRate) / 100 + jobPriorityFee : 0;
    let netPrice = basicPrice > 0 ? basicPrice + jobPriorityFee : 0;
    //let discountedPrice = netPrice - (netPrice * discountTagRate) / 100;
    let discountedPrice = netPrice - (basicPrice * discountTagRate) / 100;
    //console.log("Option Price", discountedPrice);
    return _.round(discountedPrice, 2);
  };

  const presentEstimates = async () => {
    let quote = {
      organisation_id: job.organisation_id,
      job_id: job.id,
      technician_id: AuthService.getCurrentTechnician().id,
      special_rate_discount: specialRateDiscount || false,
      options: jobOptions,
      is_active: true,
    };

    if (qid) {
      quote.id = qid;
    }

    //console.log("Quote to be saved/updated", quote);

    const { data, status, message } = qid
      ? await trackPromise(DefaultService.Entity_Update("Outbound_Quote", quote))
      : await trackPromise(DefaultService.Entity_Add("Outbound_Quote", quote));
    notify(message, status);
    if (status) {
      quote.id = data.id || quote.id;
      history.push({
        pathname: `/technician/jobs/Job-Estimate-Present/${job.id}/${quote.id}`,
        dtJob: job,
        dtQuote: quote,
      });
    }
  };

  return (
    <>
      <Row>
        <Col span={12}>
          <Title level={4}>{t("general_add_est")}</Title>
        </Col>
        <Col span={12} className="text-right push-right">
          {/* <Link
            className="ant-btn ant-btn-primary"
            to={{
              pathname: `/technician/jobs/job-estimate-start/${jid}`,
              dtJob: job // your data array of objects
            }}
          ><LeftOutlined />&nbsp;&nbsp;Back </Link> */}
        </Col>
      </Row>
      {/* {jobOptions && jobOptions.length > 0 && (
        <Row>
          <Col span={24}>
            <Button size="large" style={{ width: "100%" }} className="mt-3 mb-3" onClick={presentEstimates}>
              Present Estimates
            </Button>
          </Col>
        </Row>
      )} */}
      <Row className="mb-2">
        <Col span={12}>
          <Checkbox
            value={false}
            defaultChecked={quote && quote.special_rate_discount}
            onChange={(cb) => setSpecialRateDiscount(cb.target.checked)}
          >
            {t("general_spl_rate_disc")}
          </Checkbox>
        </Col>
        <Col span={12} className="text-right push-right">
          <Button className="bg-success" onClick={addNewOption}>
            {t("general_add_est")}
          </Button>
        </Col>
      </Row>
      {jobOptions.map((jobOption) => {
        const props = {
          jobOption,
          getOptionTotal,
          handleRenameOption,
          handleRemoveOption,
          makeRecommended,
          handleAddNewItem,
          viewItems,
        };
        return <JobOption {...props} />;
      })}
      {jobOptions && jobOptions.length > 0 && (
        <Row>
          <Col span={24}>
            <Button size="large" style={{ width: "100%" }} onClick={presentEstimates}>
              {t("general_pres_estimate")}
            </Button>
          </Col>
        </Row>
      )}{" "}
      {showOptionItems && (
        <ViewItems
          jobOption={curJobOption}
          showForm={showOptionItems}
          handleCancel={handleCancel}
          handleUpdateItems={handleUpdateItems}
        />
      )}
      {showRenameOption && (
        <RenameOption {...{ jobOption: curJobOption, showForm: showRenameOption, updateOptionTitle, handleCancel }} />
      )}
      {showAddItemSelection && (
        <AddItemSelection
          {...{ jobOption: curJobOption, showForm: showAddItemSelection, handleAddItemSelection, handleCancel }}
        />
      )}
      {showAddItemsManual && (
        <AddItemsManually
          {...{ jobOption: curJobOption, showForm: showAddItemsManual, handleUpdateItems, handleCancel, organisation }}
        />
      )}
      {showAddItemsPB && (
        <AddItemsPB {...{ jobOption: curJobOption, job, showForm: showAddItemsPB, handleUpdateItems, handleCancel }} />
      )}
    </>
  );
};

export default Job_Estimate_Main;

const JobOption = ({
  jobOption,
  getOptionTotal,
  handleRenameOption,
  handleRemoveOption,
  makeRecommended,
  handleAddNewItem,
  viewItems,
}) => {
  /*
   "options": [
        {
            "title": "Basic",
            "amount": 500, 
            "items":[
                {
                    "title": "Products 1",
                    "description": "these products are going to used during installation",
                    "quantity": 5,
                    "price": 10,
                    "type": "M"
                },
                {
                    "title": "Product 2",
                    "description": "these products are required during work",
                    "quantity": 1,
                    "price": 100
                    "type": "PB"
                }, 
            ],
            "is_accepted": false,
            "is_recommended": false
        },
  */
  return (
    <>
      <Card
        size="small"
        className={`mb-2 ${jobOption.is_recommended && "box-orange box-double bg-orange"}`}
        title={`${jobOption.title} ${(jobOption.is_recommended && "✪") || ""}`}
        headStyle={{
          color: `${jobOption.is_recommended ? "#dd6633" : "#555"}`,
          fontSize: "18px",
          borderLeft: `solid 3px ${jobOption.is_recommended ? "orange" : "#cadeff"}`,
          backgroundColor: `${jobOption.is_recommended ? "gold" : "#eee"}`,
        }}
        bodyStyle={{ borderLeft: `solid 3px ${jobOption.is_recommended ? "orange" : "#cadeff"}` }}
        extra={
          <Button type="link" onClick={() => handleRenameOption(jobOption)}>
            Rename <EditOutlined />
          </Button>
        }
        style={{ width: "100%" }}
      >
        <Row>
          <Col span={24}>
            <h2 className="danger">
              {t("general_total_price")} <span className="text-danger text-large">${getOptionTotal(jobOption)}</span>
            </h2>
          </Col>
        </Row>
        <Row>
          <Col span={6}>{(jobOption.items && jobOption.items.length) || 0} Item(s)</Col>
          <Col span={18} className="text-right push-right">
            <Space>
              <Button type="dashed" danger onClick={() => handleAddNewItem(jobOption)}>
                {t("general_add_items")}
              </Button>
              {jobOption.items && jobOption.items.length > 0 && (
                <Button type="dashed" onClick={() => viewItems(jobOption)}>
                  {t("general_view_items")}
                </Button>
              )}
            </Space>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col span={18} className="mt-2">
            <Switch
              defaultChecked={false}
              checked={jobOption.is_recommended}
              onChange={() => makeRecommended(jobOption)}
            />
            <span className={`ml-1 mt-2 text-small ${jobOption.is_recommended ? "text-success text-bold" : ""}`}>
              {t("general_recommended")}
            </span>
          </Col>
          <Col span={6}>
            <Popconfirm title={`Are you sure to remove this option?`} onConfirm={() => handleRemoveOption(jobOption)}>
              <DeleteFilled className="text-large text-danger text-right push-right mt-2" />
            </Popconfirm>
          </Col>
        </Row>
      </Card>
    </>
  );
};

const ViewItems = ({ jobOption, showForm, handleCancel, handleUpdateItems }) => {
  const [option, setOption] = useState(jobOption);
  const columns = [
    {
      title: t("dashboard_job_search_item"),
      dataIndex: "title",
      key: "title",
      className: "ant-table-cell",
      align: "left",
      render: (value, record) => {
        return (
          <>
            <b className="text-success">{record.title}</b>
            <br />
            {record.description}
          </>
        );
      },
    },
    {
      title: t("general_added"),
      dataIndex: "type",
      key: "type",
      className: "ant-table-cell",
      align: "center",
      render: (value, record) => {
        return <>{record.type === "M" ? "Manually" : "Pricebook"}</>;
      },
    },
    {
      title: t("general_qty"),
      dataIndex: "qunatity",
      key: "quantity",
      cellClassName: "text-right",
      align: "center",
      render: (value, record) => {
        return <>{record.quantity}</>;
      },
    },
    {
      title: t("general_price"),
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
      render: (value, record) => (
        <Space size={20} align="center">
          <Popconfirm
            title={`Are you sure to remove this item`}
            onConfirm={(event) => {
              event.stopPropagation();
              //console.log(option);
              const opt = option;
              opt.items = option.items.filter((i) => i.title !== record.title);
              //console.log(opt);
              setOption(opt);
              handleUpdateItems(opt);
            }}
          >
            <DeleteFilled className="text-danger text-large" />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Modal
        title={`List of Items in ${jobOption.title}`}
        visible={showForm}
        // onOk={handleSave}
        onCancel={handleCancel}
        footer={[
          <Button type="dashed" danger onClick={handleCancel}>
            {t("general_close")}
          </Button>,
        ]}
      >
        <h4>{t("general_list_of_item_in")} {jobOption.title}</h4>

        <Table
          className="ant-table-custom"
          style={{ width: "100%" }}
          cellClassName="ant-table-cell"
          rowClassName="dx-row dx-data-row dx-row-lines dx-column-lines dx-row-alt"
          columns={columns}
          expandable={false}
          dataSource={option.items}
          rowkey={(record) => record.id}
          pagination={false}
        />
      </Modal>
    </>
  );
};

const RenameOption = ({ jobOption, showForm, updateOptionTitle, handleCancel }) => {
  const [form] = Form.useForm();
  const [record, setRecord] = useState(jobOption);
  return (
    <>
      <Modal
        title={`Rename "${jobOption.title}" option title`}
        visible={showForm}
        onCancel={handleCancel}
        footer={[<FormButtons {...{ form, handleCancel, ENTITY: "Option Name" }} />]}
      >
        <Form
          form={form}
          name={`form-rename-option`}
          layout="vertical"
          initialValues={{}}
          labelCol={{}}
          wrapperCol={{}}
          autoComplete="off"
          size="middle"
          onFinish={updateOptionTitle}
          onFinishFailed={handleCancel}
        >
          <Form.Item
            name="title"
            label={t("general_new_title")}
            rules={[{ required: true, message: "Title cannot be empty" }]}
            hasFeedback
          >
            <Input placeholder={t("general_new_title")} maxLength={100} size="large" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

const AddItemSelection = ({ jobOption, showForm, handleAddItemSelection, handleCancel }) => {
  const [form] = Form.useForm();
  const [record, setRecord] = useState(jobOption);
  const [license, setLicense] = useState(AuthService.getCurrentLicense());
  return (
    <>
      <Modal
        title={`New Item Selection for "${jobOption.title}"`}
        visible={showForm}
        bodyStyle={{ height: 200 }}
        onCancel={handleCancel}
        footer={[]}
      >
        <Row className="mt-5 pt-5">
          <Col span={24} className="text-center mt-t pt-5">
            <Button
              style={{ width: "80%" }}
              size="large"
              type="dashed"
              danger
              onClick={() => handleAddItemSelection("M")}
            >
              Add Item(s) Manually
            </Button>
          </Col>
          <Col span={24} className="text-center mt-t pt-5">
            <Button
              style={{ width: "80%" }}
              size="large"
              onClick={() =>
                license.id === 2
                  ? handleAddItemSelection("PB")
                  : notify("This feature is only available for GROW license of this application.", false)
              }
              disabled={false}
            >
              Add Item(s) from Pricebook
            </Button>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

const AddItemsManually = ({ jobOption, showForm, handleUpdateItems, handleCancel, organisation }) => {
  const [form] = Form.useForm();
  const [record, setRecord] = useState(jobOption);

  useEffect(() => {
    calculateItemPrice();
  }, []);

  const addItem = (addMore) => {
    let isValid = false;
    form
      .validateFields()
      .then((values) => {
        let item = form.getFieldsValue();
        item.type = "M";
        let option = { ...record };
        option.items.push(item);
        setRecord(option);
        form.resetFields();
        handleUpdateItems(record);
        if (!addMore) {
          // handleUpdateItems(record);
          notify("Item(s) added successfully!", true);
          handleCancel();
        } else {
          notify("Item added successfully! Add a new item now", true);
        }
      })
      .catch((values) => {
        notify("Please fill all the required fields", false);
      });
  };

  const calculateItemPrice = () => {
    let qty = form.getFieldValue("quantity") || 1;
    let unit_price = form.getFieldValue("unit_price") || 0;

    let tax_rate = form.getFieldValue("tax_rate");

    let gross_price = parseInt(qty) * parseFloat(unit_price);
    let total_price = _.round(gross_price + gross_price * (tax_rate / 100), 2);
    form.setFieldsValue({ price: total_price });
    //form.setFields([{ price: total_price }]);
    //console.log(form.getFieldsValue());
  };
  return (
    <>
      <Modal
        title={`Add new item to "${jobOption.title}" option`}
        visible={showForm}
        onCancel={handleCancel}
        footer={[]}
      >
        <Row>
          <Col>
            <h3>{record.items.length} items</h3>
          </Col>
        </Row>

        <Form
          form={form}
          name={`form-rename-option`}
          layout="vertical"
          initialValues={{}}
          labelCol={{}}
          wrapperCol={{}}
          autoComplete="off"
          size="middle"
        >
          <div className="">
            <Form.Item hidden={true} name="type" value="M" />
            <Form.Item
              name="title"
              label="Item name"
              rules={[{ required: true, message: "Item name is required" }]}
              hasFeedback
              className="one-row-item"
            >
              <Input placeholder="Please enter a new item name" maxLength={100} />
            </Form.Item>

            <Form.Item
              name="description"
              label={t("quick_setup_industries_modal_form_description")}
              rules={[{ required: true, message: "A brief description is required" }]}
              hasFeedback
              className="one-row-item"
            >
              <Input.TextArea placeholder="Item's Description" maxLength={500} />
            </Form.Item>

            <Row>
              <Col span={12}>
                <Form.Item
                  name="quantity"
                  label={t("dashboard_job_search_quantity")}
                  rules={[{ required: true, message: "Quantity is required" }]}
                  hasFeedback
                  initialValue={1}
                >
                  <InputNumber onChange={calculateItemPrice} style={{ width: "99%" }} min={1} max={9999} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="unit_price"
                  label={t("general_unit_price($)")}
                  rules={[{ required: true, message: "Unit price is required" }]}
                  hasFeedback
                  initialValue={0}
                >
                  <InputNumber
                    addonBefore="$"
                    onChange={calculateItemPrice}
                    style={{ width: "99%" }}
                    min={0}
                    max={99999}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={10}>
              <Col span={12}>
                <Form.Item name="tax_rate" label="Tax Rate" initialValue={organisation.tax_rate}>
                  <span style={{ fontSize: "20px" }} className="text-danger">
                    {organisation.tax_rate || 0}%
                  </span>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="price" label="Total Price($)" className="two-row-item" hasFeedback initialValue={0}>
                  <input
                    type="text"
                    readOnly
                    style={{ fontSize: "20px", border: "none", width: "60px" }}
                    className="text-success"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Row className="mt-5" gutter={2}>
                <Col span={12} className="text-left">
                  <Button size="large" onClick={() => addItem(true)} style={{ width: "100%" }}>
                    {t("general_add_another_item")}
                  </Button>
                </Col>
                <Col span={12} className="text-right">
                  <Button size="large" onClick={() => addItem(false)} style={{ width: "100%" }} className="bg-success">
                    {t("general_add")} &amp; {t("general_return")}
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col span={24} className="text-right mt-5">
                  <Button size="large" danger type="dashed" onClick={handleCancel} style={{ width: "100%" }}>
                    {t("quick_setup_organizations_modal_button_cancel")}
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
};

const AddItemsPB = ({ jobOption, job, showForm, handleUpdateItems, handleCancel }) => {
  const [form] = Form.useForm();
  const [record, setRecord] = useState(jobOption);
  // const { curOrg: organisation } = useContext(Context);

  const [categoryTree, setCategoryTree] = useState();
  const [selectedIndustryId, setSelectedIndustryId] = useState();
  const [selectedCategoryId, setSelectedCategoryId] = useState();
  const [services, setServices] = useState();

  const [showServiceSelection, setShowServiceSelection] = useState(false);
  const [curService, setCurService] = useState();
  const [curServiceMediaEndpoint, setCurServiceMediaEndpoint] = useState();
  const [curServiceQty, setCurServiceQty] = useState(1);
  const [curServiceTotalPrice, setCurServiceTotalPrice] = useState(0);

  useEffect(async () => {
    if (job && job.industry_id) {
      await getCategoriesByIndustry(job.industry_id);
    }
  }, []);

  const getCategoriesByIndustry = async (i) => {
    let { data: cTree } = await trackPromise(
      DefaultService.Entity_List("PriceBook_ServiceCategory", { organisation_id: job.organisation_id, industry_id: i })
    );

    cTree = getLookupTree(cTree, "id", "title", "children");

    setCategoryTree(cTree);
    //console.log(cTree);
    //setSelectedIndustryId(i);
  };

  const fetchCategoryServices = async (categoryId) => {
    let { data, status } = await trackPromise(
      DefaultService.Entity_List("PriceBook_Service", {
        organisation_id: job.organisation_id,
        industry_id: job.industry_id,
        category_Id: categoryId,
        is_active: true,
      })
    );

    setServices(data);
  };

  const selectService = (service) => {
    setCurService(service);
    setShowServiceSelection(true);

    let file_path = service.media && service.media.length > 0 && service.media[0].file_path;

    setCurServiceMediaEndpoint(`${environment.PATH_SERVICE_MEDIA}/${file_path}`);
    setCurServiceQty(1);
    setCurServiceTotalPrice(service.total_price);
  };

  const setSelectedServiceQty = (v) => {
    //console.log(v);
    let total_price = _.round((v || 1) * curService.total_price, 2);
    setCurServiceTotalPrice(total_price);
    setCurServiceQty(v || 1);
  };
  const columns = [
    {
      caption: t("general_title"),
      dataField: "title",
      dataType: "string",
      alignment: "left",
      cellRender: (d) => {
        return (
          <Button type="link" onClick={() => selectService(d.data)}>
            <h3>{d.data.title}</h3>
          </Button>
        );
      },
    },

    {
      caption: t("quick_setup_office_users_grid_photo"),
      dataType: "string",
      alignment: "left",
      cellRender: (d) => {
        let file_path = d.data.media && d.data.media.length > 0 && d.data.media[0].file_path;
        return (
          <>
            <Button style={{ height: "80px" }} type="link" onClick={() => selectService(d.data)}>
              <img src={`${environment.PATH_SERVICE_MEDIA}/${file_path}`} style={{ width: "80px" }} />
            </Button>
          </>
        );
      },
    },

    {
      caption: t("general_total_price"),
      dataField: "total_price",
      dataType: "number",
      alignment: "center",
      format: MoneyFormat,
    },
  ];
  const addItem = () => {
    let item = {
      type: "PB",
      title: curService.title,
      unit_price: curService.total_price,
      quantity: curServiceQty,
      price: curServiceTotalPrice,
      description: curService.description || "No description available",
    };

    let option = { ...jobOption };
    option.items.push(item);

    handleUpdateItems(option);
    notify("Item(s) added successfully!", true);
    handleCancel();
  };
  return (
    <>
      <Modal
        title={`Add new item to "${jobOption.title}" option`}
        visible={showForm}
        onCancel={handleCancel}
        footer={[]}
      >
        <h4>{t("general_select_a_service_category:")}</h4>
        <TreeSelect
          style={{ width: "100%" }}
          dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
          placeholder="Please select a category"
          treeDefaultExpandAll
          treeData={categoryTree}
          //value={form.getFieldsValue("parent_category_id")}
          onTreeLoad={() => {
            //console.log("cat tree", categoryTree);
          }}
          onChange={(v) => {
            //console.log(v);
            //console.log("tree data", categoryTree);
            //console.log("selected parent category", v);
            notify("category selected:" + v);
            setSelectedCategoryId(v);
            fetchCategoryServices(v);
          }}
        ></TreeSelect>
        <div className="mt-5 mb-5"></div>
        <div className="flex">
          <CustomDataGrid
            data={services}
            columns={columns}
            ENTITY="Service"
            ENTITY_PLURAL="Services"
            canDelete={false}
            canEdit={false}
            hideToolbar={true}
          />
        </div>
      </Modal>

      {showServiceSelection && (
        <Modal
          title={`Add new service to "${jobOption.title}" option`}
          visible={showServiceSelection}
          onCancel={() => setShowServiceSelection(false)}
          footer={[]}
        >
          <Card
            size="default"
            className={`mb-2 box-double"}`}
            title={`Total Price: $${curServiceTotalPrice}`}
            headStyle={{
              fontSize: "18px",
              borderLeft: `solid 3px #cadeff`,
              color: "red",
            }}
            extra={<Button onClick={addItem}>Add this Service</Button>}
            style={{ width: "100%" }}
          >
            <Row>
              <Col span={24}>
                <h2>{curService.title}</h2>
              </Col>
            </Row>
            <Row gutter={6}>
              <Col span={14}>
                <>
                  <img src={`${curServiceMediaEndpoint}`} style={{ width: "100%" }} />;
                </>
              </Col>
              <Col span={10}>
                <h3 className="flex">
                  <div className="mr-auto">Price:</div>
                  <div className="ml-auto">${curService.total_price}</div>
                </h3>
                <br />
                <h3 className="flex">
                  <div className="mr-auto">Qty:</div>
                  <div className="ml-auto">
                    <InputNumber
                      min={1}
                      max={100}
                      size="large"
                      defaultValue={curServiceQty}
                      onChange={setSelectedServiceQty}
                      style={{ width: "60px", textAlign: "right" }}
                    />
                  </div>
                </h3>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <h3>{t("general_description")}:</h3>
                <p>{curService.description}</p>
              </Col>
            </Row>
          </Card>
        </Modal>
      )}
    </>
  );
};
