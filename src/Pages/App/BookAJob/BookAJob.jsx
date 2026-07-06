import React, { useState, useEffect, useContext, useCallback } from "react";

import { Button, Row, Col, Card, Input, Form, Radio, Checkbox, AutoComplete, Space, Modal } from "antd";
import { notify } from "Services/ToastService";
import LookupService from "Services/API/LookupService";
import Context from "Store/Context";
import Address from "./Components/Address";
import JobDetails from "./Components/JobDetails";
import DefaultService from "Services/API/DefaultService";
import PageTitle from "../_Common/PageTitle";
import { AppPage, PageHeader, PageSection } from "../_Common/AppPage";
import FormUtils from "Components/Common/FormUtils";
import { useTranslation } from "react-i18next";
const { InfoItem } = FormUtils;

const BookAJob = (props) => {
  const { t } = useTranslation();
  const ENTITY_API_KEY = "JOB";

  const { curOrg: organisation } = useContext(Context);
  const [CustomerTypes, setCustomerTypes] = useState([]);
  const [ShowBilling, setShowBilling] = useState(true);
  const [ShowSite, setShowSite] = useState(true);
  const [ShowDiscountTag, setShowDiscountTag] = useState(false);
  const [ShowJobPriority, setShowJobPriority] = useState(false);
  const [ShowJobTag, setShowJobTag] = useState(false);
  const [ShowServiceType, setShowServiceType] = useState(false);
  const [Customers, setCustomers] = useState([]);
  const [AllCustomers, setAllCustomers] = useState([]);
  const [SearchQuery, setSearchQuery] = useState("");
  const [okDialog, setOkDialog] = useState(false);
  const [jobSiteLoc, setJobSiteLoc] = useState(null);
  const [form] = Form.useForm();

  const initialFormValues = {
    use_contact_as_billing: true,
    use_contact_as_site: true,
    organisation_id: 0,
    job_duration_mins: 120,
    customer_id: 0,
    job_site_address_id: 0,
    is_active: true,
  };

  const buildCustomersList = (customers) => {
    const format_title = (customer_name) => (
      <>
        <b>{customer_name}</b>
      </>
    );
    const format_options = ({ id, customer_id, type, mobile, postal_code, city, state, country }) => ({
      key: `${customer_id}_${id}`,
      value: customer_id,
      label: (
        <>
          <Row>
            <Col span={12}>
              <b>{type}</b>: {mobile}
            </Col>
            <Col span={3}>{postal_code}</Col>
            <Col span={3}>{city}</Col>
            <Col span={3}>{state}</Col>
            <Col span={3}>{country}</Col>
          </Row>
        </>
      ),
    });

    return customers.map((customer) => ({
      key: customer.id,
      value: customer.id,
      label: format_title(`${customer.first_name} ${customer.last_name}`),
      options: customer.addresses.map((addr) => format_options(addr)),
    }));
  };
  const setOrgnisation = useCallback(
    async (organisation_id) => {
      const customer_types = await LookupService.getLookupByEntity(
        "QS_Customer_Type",
        { organisation_id },
        "name",
        "id",
        "booking_page_sections_json"
      );
      const { data, status } = await DefaultService.Entity_List("CUSTOMER", { organisation_id });

      if (status) {
        setAllCustomers(data);
        //setCustomers(buildCustomersList(data));
      }

      //setCustomers(customers);
      setCustomerTypes(customer_types);

      form.setFieldsValue({ organisation_id });
    },
    [form]
  );
  useEffect(() => {
    (async () => {
      if (organisation === undefined || organisation === null) return;
      await setOrgnisation(organisation.id);
    })();
  }, [organisation, setOrgnisation]);

  const handleCustomerSearch = (query) => {
    query = query.toLowerCase();

    var searched_customers = AllCustomers.filter(
      (customer) =>
        customer.first_name.toLowerCase().includes(query) ||
        customer.last_name.toLowerCase().includes(query) ||
        customer.addresses.filter(
          (addr) =>
            addr.postal_code.toLowerCase().includes(query) ||
            addr.city.toLowerCase().includes(query) ||
            addr.state.toLowerCase().includes(query) ||
            addr.country.toLowerCase().includes(query) ||
            addr.mobile.toLowerCase().includes(query)
        ).length > 0
    );

    setCustomers(buildCustomersList(query ? searched_customers : []));
  };
  const handleBillingChange = (e) => setShowBilling(e.target.checked);
  const handleSiteChange = (e) => setShowSite(e.target.checked);
  const setBookingSections = (sections) => {
    setShowDiscountTag(sections.includes("discount_tag"));
    setShowJobPriority(sections.includes("job_priority"));
    setShowServiceType(sections.includes("service_type"));
    setShowJobTag(sections.includes("job_tag"));
  };
  const handleCustomerTypeChange = (e) => {
    var selected_customer = CustomerTypes.filter((v) => v.value === e.target.value);
    const sections = JSON.parse(selected_customer[0].fk);
    setBookingSections(sections);
  };

  const formatNested = (obj, property) => {
    var keys = Object.keys(obj).filter((v) => v.startsWith(`${property}.`));
    var result = keys.reduce((pv, v) => {
      var toks = v.split(".");
      pv[toks[1]] = obj[v];
      delete obj[v];
      return pv;
    }, {});
    obj[property] = result;
    return obj;
  };

  const handleReset = async () => {
    setBookingSections([]);
    await setOrgnisation(organisation.id);
  };
  const handleFormFinish = async (values) => {
    formatNested(values, "contact_address");
    formatNested(values, "billing_address");
    formatNested(values, "job_site_address");

    if (values.billing_address.id === undefined) values.billing_address = values.contact_address;
    if (values.job_site_address.id === undefined) values.job_site_address = values.contact_address;

    values.contact_address_id = values.contact_address.id === undefined ? 0 : values.contact_address.id;
    values.job_site_address_id = values.job_site_address.id === undefined ? 0 : values.job_site_address.id;
    values.billing_address_id = values.billing_address.id === undefined ? 0 : values.billing_address.id;

    const { message, status } = await DefaultService.Entity_Add(ENTITY_API_KEY, values);
    notify(message, status);
    if (status) {
      setOkDialog(true);
    }
  };

  const extractAddressInfoAndSetForm = async (address, type, load_location = false) => {
    var result = {};

    if (address !== undefined) {
      for (const key in address) {
        if (Object.hasOwnProperty.call(address, key)) {
          const attr = address[key];
          result[`${type}.${key}`] = attr;
        }
      }

      if (load_location) {
        var {
          line_1,
          line_2,
          postal_code,
          country: country_id,
          state: state_id,
          city: city_id
        } = address;
        var {
          data: { lat, lng },
        } = await DefaultService.GetGeoLocation(line_1, line_2, city_id, state_id, country_id, postal_code);

        result[`${type}.country_id`] = country_id;
        result[`${type}.state_id`] = state_id;
        result[`${type}.city_id`] = city_id;
        result[`${type}.lat`] = lat;
        result[`${type}.lng`] = lng;
      }
    }

    return result;
  };
  const setSelectedCustomer = async (customer) => {
    //console.log('customer selected: ', customer);
    setSearchQuery(`${customer.first_name} ${customer.last_name}`);
    const contact_address = customer.addresses.filter((addr) => addr.type === "CONTACT")[0];
    const billing_address = customer.addresses.filter((addr) => addr.type === "BILLING")[0];
    const job_site_address = customer.addresses.filter((addr) => addr.type === "SITE")[0];
    var updated_values = {
      customer_id: customer.id,
      email: customer.email,
      customer_type_id: customer.customer_type_id,
      ...(await extractAddressInfoAndSetForm(contact_address, "contact_address", true)),
      ...(await extractAddressInfoAndSetForm(billing_address, "billing_address", true)),
      ...(await extractAddressInfoAndSetForm(
        job_site_address === undefined ? contact_address : job_site_address,
        "job_site_address",
        true
      )),
    };
    updated_values.job_site_lat = updated_values["job_site_address.lat"];
    updated_values.job_site_lng = updated_values["job_site_address.lng"];

    setJobSiteLoc({ lat: updated_values["job_site_address.lat"], lng: updated_values["job_site_address.lng"] });
    form.setFieldsValue(updated_values);

    handleCustomerTypeChange({ target: { value: customer.customer_type_id } });
  };

  const handleCustomerSelect = async (value) => {
    var searched_customer = AllCustomers.filter((customer) => customer.id === +value)[0];
    await setSelectedCustomer(searched_customer);
  };

  const handleJobOk = async () => {
    form.resetFields();
    setOkDialog(false);
    await setOrgnisation(organisation.id);
  }
  return (
    <AppPage>
      <PageHeader title={<PageTitle />} />
      <PageSection>
      <Row gutter={5} justify="space-between">
        <Col span={24}>
          <AutoComplete
            options={Customers}
            style={{ width: "100%" }}
            onSearch={handleCustomerSearch}
            onSelect={handleCustomerSelect}
            value={SearchQuery}
            notFoundContent="No customer found. click Customer list to Add New"
          >
            <Input.Search
              placeholder="Search Customer"
              enterButton="Search"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </AutoComplete>
        </Col>
      </Row>
      </PageSection>
      <Row>
        <Col>
          <Modal title="Job Status" onOk={handleJobOk} onCancel={handleJobOk} visible={okDialog}>
            <p>Job booked successfully. Please go to dispatching to assign jobs</p>
          </Modal>
        </Col>
      </Row>
      <Form layout="vertical" form={form} onFinish={handleFormFinish} initialValues={initialFormValues}>
        <Form.Item name="organisation_id" hidden />
        <Form.Item name="customer_id" hidden />
        <Form.Item name="job_site_address_id" hidden />
        <Form.Item name="job_site_lat" hidden />
        <Form.Item name="job_site_lng" hidden />
        <Row gutter={5}>
          <Col span={24}>
            <Card title={t("general_customer_details")} >
              <Row gutter={5}>
                <Col span={24}>
                  <InfoItem
                    span={24}
                    label={t("quick_setup_office_users_form_email")}
                    name="email"
                    rules={[{
                      required: true,
                      message: `Please input email`,
                    }]}
                  />

                </Col>
              </Row>
              <Row>
                <Col span={18}>
                  <Form.Item
                    name="customer_type_id"
                    label={t("quick_setup_customer_type_grid_heading_customer_type")}
                    rules={[
                      {
                        required: true,
                        message: "Please select any one customer Type",
                      },
                    ]}
                  >
                    <Radio.Group onChange={handleCustomerTypeChange}>
                      {CustomerTypes.map((item) => (
                        <Radio.Button key={item.value} value={item.value}>
                          {item.label}
                        </Radio.Button>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
              <Address name="contact_address" form={form} showMap={ShowSite} map_loc={jobSiteLoc} />
              <Row>
                <Col span={3}>
                  <Form.Item name="use_contact_as_billing" valuePropName="checked">
                    <Checkbox checked={ShowBilling} onChange={handleBillingChange}>
                      {t("radio_btn_use_same_address_for_billing")}
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item name="use_contact_as_site" valuePropName="checked">
                    <Checkbox checked={ShowSite} onChange={handleSiteChange}>
                      {t("radio_btn_use_same_address_for_site")}
                    </Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            {!ShowBilling && (
              <Card title="Billing Details">
                <Address name="billing_address" form={form} />
              </Card>
            )}
          </Col>
          <Col span={12}>
            {!ShowSite && (
              <Card title="Job Site Details">
                <Address name="job_site_address" form={form} showMap={true} />
              </Card>
            )}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Card title={t("general_job_details")}>
              <JobDetails
                ShowDiscountTag={ShowDiscountTag}
                ShowJobPriority={ShowJobPriority}
                ShowJobTag={ShowJobTag}
                ShowServiceType={ShowServiceType}
              />
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item name="is_active" valuePropName="checked">
              <Checkbox> {t("label_is_active")} </Checkbox>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={5} justify="end">
          <Col>
            <Button htmlType="reset" type="dashed" onClick={handleReset}>
              {t("general_reset")}
            </Button>
          </Col>
          <Col>
            <Button htmlType="submit" type="primary">
              {t("label_book_job")}
            </Button>
          </Col>
        </Row>
      </Form>
    </AppPage>
  );
};

export default BookAJob;
