import React, { useState, useEffect, useContext } from "react";

import { trackPromise } from "react-promise-tracker";
import { notify } from "Services/ToastService";

import { Button, Form, Select, Space, Tooltip } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import CustomDataGrid from "Components/DevEx/CustomDataGrid";

import moment from "moment";
import LookupService from "Services/API/LookupService";
import DefaultService from "Services/API/DefaultService";
import _ from "lodash";
import NumberFormat from "react-number-format";
import { MoneyFormat, PercentFormat } from "Lib/DevExConstants";
import Form_Service from "./Components/Form_Service";
import Context from "Store/Context";
import { filterByMultipleIds } from "Lib/ReactHelper";
import PageTitle from "../_Common/PageTitle";
import { useTranslation } from "react-i18next";

const Services = (props) => {
  const { t } = useTranslation();
  const ENTITY = "Service";
  const ENTITY_PLURAL = "Services";
  const ENTITY_API_KEY = "PriceBook_Service";

  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);

  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();

  const [industries, setIndustries] = useState();
  const [selectedIndustryId, setSelectedIndustryId] = useState();

  const [categories, setCategories] = useState();
  const [serviceTypes, setServiceTypes] = useState();
  const [tasks, setTasks] = useState();
  const [utilities, setUtilities] = useState();
  const [products, setProducts] = useState();
  const [billableHourlyRates, setBillableHourlyRates] = useState();

  const { curOrg: organisation } = useContext(Context);

  useEffect(async () => {
    if (organisation) {
      setIndustries(await trackPromise(LookupService.Industries({ organisation_id: organisation.id })));

      const { data: c } = await trackPromise(
        DefaultService.Entity_List("PriceBook_ServiceCategory", { organisation_id: organisation.id, is_active: true })
      );
      const { data: st } = await trackPromise(
        DefaultService.Entity_List("QS_Service_Type", { organisation_id: organisation.id, is_active: true })
      );
      const { data: t } = await trackPromise(
        DefaultService.Entity_List("PriceBook_Task", { organisation_id: organisation.id, is_active: true })
      );
      const { data: u } = await trackPromise(
        DefaultService.Entity_List("PriceBook_Utility", { organisation_id: organisation.id, is_active: true })
      );
      let { data: p } = await trackPromise(
        DefaultService.Entity_List("Inventory_Product", { organisation_id: organisation.id, is_active: true }, [
          ["product_name", "ASC"],
        ])
      );
      let { data: bh } = await trackPromise(
        DefaultService.Entity_List("PriceBook_BillableHourlyRate", {
          organisation_id: organisation.id,
          is_active: true,
        })
      );

      setCategories(c);
      setServiceTypes(st);
      setTasks(t);
      setUtilities(u);
      setProducts(p);
      setBillableHourlyRates(bh);

      //setMatrixTypes(await trackPromise(LookupService.getLookupByEntity_SingleVal("Query_MarginMatrixTypes", null)));
      await handleSearch();
    }
  }, [organisation]);

  useEffect(() => {
    if (recordToEdit && recordToEdit.id === 0) {
      //recordToEdit.ranges = [];
    }
    form.resetFields();
  }, [recordToEdit]);

  const handleSearch = async () => {
    let { data, status, message } = await trackPromise(
      DefaultService.Entity_List(ENTITY_API_KEY, { organisation_id: organisation.id })
    );
    !status && notify(message, status);
    setData(data);
  };
  const handleEdit = async (item) => {
    console.log("Service To Edit", item);

    let record = {};
    if (item.id) {
      record = { ...item };
      record.service_types =
        (item.service_types &&
          item.service_types.map((sp) => {
            return sp.id;
          })) ||
        [];

      record.tasks =
        (item.tasks &&
          item.tasks.map((t) => {
            return t.id;
          })) ||
        [];

      record.utilities =
        (item.utilities &&
          item.utilities.map((u) => {
            return u.id;
          })) ||
        [];

      let selectedProdIds =
        (item.products &&
          item.products.map((p) => {
            return p.product_id;
          })) ||
        [];
      let prods = filterByMultipleIds(products, "id", selectedProdIds);
      record.products =
        prods &&
        prods.map((p) => {
          return { ...p, quantity: _.find(record.products, { product_id: p.id }).quantity };
        });
      // record.products =
      //   (item.products &&

      //     products.map((p) => {
      //       let found = _.find(item.products, { product_id: p.id });
      //       if (found && p.id) {
      //         return { ...p, product_id: p.id, quantity: p.quantity };
      //       }
      //     })) ||
      //   [];
    } else {
      record.organisation_id = organisation.id;
      record.products = [];
    }
    setRecordToEdit(record);

    setShowEditForm(true);
  };

  const handleDelete = async (item) => {
    //console.log("Delete Handler", item);
    let { status, message } = await trackPromise(DefaultService.Entity_Delete(ENTITY_API_KEY, item.id));
    notify(message, status);
    await handleSearch();
  };

  const handleCancel = () => {
    setShowEditForm(false);
  };

  const onFinish = async (values) => {
    //console.log(files);

    /* IF FILES NEED TO BE UPLOADED VIA FORM
    const formData = new FormData();
     files.forEach((file) => {
       formData.append("files[]", file);
     });
    */
    let record = values;
    console.log("Form values", values);

    //SET SOME DEFAULT VALUES HERE
    // record.products = _.map(record.products, (p) => {
    //   return { product_id: p.id, quantity: p.quantity || 0 };
    // });
    console.log("Record to save", record);

    const { status, message } = record.id
      ? await trackPromise(DefaultService.Entity_Update(ENTITY_API_KEY, record))
      : await trackPromise(DefaultService.Entity_Add(ENTITY_API_KEY, record));

    notify(message, status);
    if (status) {
      //setLogoImage(null);
      setRecordToEdit({});
      setShowEditForm(false);
      handleSearch();
    }
  };
  const onFinishFailed = async () => {
    notify("Please provide all the required input fields", false);
  };

  const onIndustryChanged = async (i) => {
    let { data } = await trackPromise(
      DefaultService.Entity_List(ENTITY_API_KEY, { organisation_id: organisation.id, industry_id: i })
    );
    setData(data);
    setSelectedIndustryId(i);
  };

  const columns = [
    {
      caption: t("general_title"),
      dataField: "title",
      dataType: "string",
      alignment: "left",
    },
    {
      caption: t("quick_setup_service_types_grid_industry"),
      dataField: "industry.name",
      dataType: "string",
      alignment: "left",
    },
    {
      caption: t("general_description"),
      dataField: "description",
      dataType: "string",
      alignment: "left",
    },
    {
      caption: t("general_bllable_hours"),
      dataField: "billable_hours",
      dataType: "number",
      alignment: "center",
    },
    {
      caption: t("general_labor_cost"),
      dataField: "labor_cost",
      dataType: "number",
      alignment: "center",
      format: MoneyFormat,
    },
    {
      caption: t("general_product_cost"),
      dataField: "product_cost",
      dataType: "number",
      alignment: "center",
      format: MoneyFormat,
    },
    {
      caption: t("general_utility_cost"),
      dataField: "utility_cost",
      dataType: "number",
      alignment: "center",
      format: MoneyFormat,
    },
    {
      caption: t("general_price"),
      dataField: "price",
      dataType: "number",
      alignment: "center",
      format: MoneyFormat,
    },
    {
      caption: t("general_tax"),
      dataField: "tax",
      dataType: "number",
      alignment: "center",
      format: MoneyFormat,
    },

    {
      caption: t("general_total_price"),
      dataField: "total_price",
      dataType: "number",
      alignment: "center",
      format: MoneyFormat,
    },
    {
      caption: t("general_active"),
      dataField: "is_active",
      dataType: "string",
      alignment: "center",
    },
  ];

  return (
    <>
      <div className="flex mb-2">
        <PageTitle />
        <h3 className="push-right">
          <Space>
            <Tooltip title={`Select an industry to see its service on this page`}>
              {t("general_industry")}: &nbsp;
              <Select
                multiple={false}
                options={industries}
                onChange={(i) => onIndustryChanged(i)}
                style={{ width: "150px" }}
              />
            </Tooltip>

            <Tooltip title={`Do you have more ${ENTITY_PLURAL}? Click here to add another`}>
              <Button className="bg-success" icon={<PlusCircleOutlined />} onClick={handleEdit}>
                {t("quick_setup_organizations_modal_button")}
              </Button>
            </Tooltip>
          </Space>
        </h3>
      </div>
      <div className="flex">
        <CustomDataGrid
          data={data}
          columns={columns}
          ENTITY={ENTITY}
          ENTITY_PLURAL={ENTITY_PLURAL}
          editHandler={handleEdit}
          deleteHandler={handleDelete}
          canDelete={true}
          canEdit={true}
        />
      </div>

      {showEditForm && (
        <Form_Service
          form={form}
          showForm={showEditForm}
          recordToEdit={recordToEdit}
          handleCancel={handleCancel}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          ENTITY={ENTITY}
          data={{
            organisation,
            industries,
            selectedIndustryId,
            categories,
            serviceTypes,
            tasks,
            utilities,
            products,
            billableHourlyRates,
          }}
        />
      )}
    </>
  );
};

export default Services;
