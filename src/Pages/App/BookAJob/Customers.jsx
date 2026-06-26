import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Row, Tooltip } from "antd";
import CustomDataGrid from "Components/DevEx/CustomDataGrid";
import GridColumn from "Components/DevEx/GridUtils";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
//import { useTranslation } from "react-i18next";
import DefaultService from "Services/API/DefaultService";
import LookupService from "Services/API/LookupService";
import { notify } from "Services/ToastService";
import Context from "Store/Context";
import PageTitle from "../_Common/PageTitle";
import FormCustomer from "./Components/Form_Customer";

function Customers(props) {
  //const { t } = useTranslation();
  const { curOrg: organisation } = useContext(Context);
  const ENTITY = "Customer";
  const ENTITY_PLURAL = "Customers";
  const ENTITY_API_KEY = "CUSTOMER";

  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);
  const [CustomerTypes, setCustomerTypes] = useState([]);
  const [recordToEdit, setRecordToEdit] = useState();
  const [data, setData] = useState([]);

  const handleSearch = useCallback(async () => {
    let { data, status, message } = await DefaultService.Entity_List(ENTITY_API_KEY, {
      organisation_id: organisation.id,
    });
    notify(message, status);
    setData(data);
  }, [organisation]);

  useEffect(() => {
    (async () => {
      if (organisation) {
        await handleSearch();
        setCustomerTypes(
          await LookupService.getLookupByEntity("QS_Customer_Type", {
            organisation_id: organisation.id,
          })
        );
      }
    })();
  }, [organisation, handleSearch]);
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
        var { country: country_id, state: state_id, city: city_id } = address;
        var {
          data: { lat, lng },
        } = await DefaultService.GetCountryStateCity(country_id, state_id, city_id);

        result[`${type}.country_id`] = country_id;
        result[`${type}.state_id`] = state_id;
        result[`${type}.city_id`] = city_id;
        result[`${type}.lat`] = lat;
        result[`${type}.lng`] = lng;
        console.log(type, result);
      }
    }

    return result;
  };
  const handleEdit = async (item) => {
    let record = {
      use_contact_as_billing: true,
      first_name: "",
      last_name: "",
    };
    if (item.id) {
      record = { ...item };
    } else {
      record.organisation_id = organisation.id;
    }
    console.log('record to edit: ', record);
    setRecordToEdit(record);
    form.setFieldsValue({
      ...(await extractAddressInfoAndSetForm(record.contact_address, "contact_address", true)),
      ...(await extractAddressInfoAndSetForm(record.billing_address, "billing_address", true))
    })
    setShowEditForm(true);
  };

  const handleDelete = async (item) => {
    let { status, message } = await DefaultService.Entity_Delete(ENTITY_API_KEY, item.id);
    notify(message, status);
    await handleSearch();
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

  const onFinish = async (values) => {
    formatNested(values, "contact_address");
    formatNested(values, "billing_address");
    let record = values;
    console.log("form values", values);

    const { status, message } = record.id
      ? await DefaultService.Entity_Update(ENTITY_API_KEY, record)
      : await DefaultService.Entity_Add(ENTITY_API_KEY, record);

    notify(message, status);
    if (status) {
      setRecordToEdit({});
      setShowEditForm(false);
      handleSearch();
    }
  };
  const onFinishFailed = async () => notify("Please provide all the required input fields", false);

  const handleCancel = () => setShowEditForm(false);

  const columns = [
    GridColumn("Id", "id", "number", { summaryType: "count" }),
    GridColumn("Email", "email", "string"),
    GridColumn("First name", "first_name", "string"),
    GridColumn("Last name", "last_name", "string"),
    GridColumn("Customer Type", "customer_type.name", "string"),
    GridColumn("Addresses", "addresses", "string", {
      cellRender: (item) => {
        let row = item.row.data;
        return <div>Total Addresses: {row.addresses.length}</div>;
      },
    }),
    GridColumn("Active", "is_active", "boolean", { alignment: "center" }),
  ];
  const { t } = useTranslation()
  return (
    <>
      <Row>
        <Col span={24}>
          <div className="flex mb-2">
            <PageTitle />
            <h3 className="push-right text-right">
              <Tooltip title={`Do you have more ${ENTITY_PLURAL}? Click here to add another`}>
                <Button className="bg-success" icon={<PlusCircleOutlined />} onClick={handleEdit}>
                  {t("quick_setup_add_new_cust")}
                </Button>
              </Tooltip>
            </h3>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <CustomDataGrid
            data={data}
            columns={columns}
            ENTITY={ENTITY}
            ENTITY_PLURAL={ENTITY_PLURAL}
            editHandler={handleEdit}
            deleteHandler={handleDelete}
            canEdit={true}
            canDelete={true}
          />
        </Col>
        <Col>
          <FormCustomer
            form={form}
            showForm={showEditForm}
            recordToEdit={recordToEdit}
            handleCancel={handleCancel}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            ENTITY={ENTITY}
            data={{ CustomerTypes }}
            organisation={organisation}
          />
        </Col>
      </Row>
    </>
  );
}

export default Customers;
