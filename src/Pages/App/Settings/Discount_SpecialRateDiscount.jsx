import React, { useState, useEffect, useContext } from "react";

import { trackPromise } from "react-promise-tracker";
import { notify } from "Services/ToastService";

import { Button, Form, Tooltip } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import CustomDataGrid from "Components/DevEx/CustomDataGrid";

import moment from "moment";
import LookupService from "Services/API/LookupService";
import DefaultService from "Services/API/DefaultService";
import { MoneyFormat, PercentFormat } from "Lib/DevExConstants";
import Form_Discount_SpecialRateDiscount from "./Components/Form_Discount_SpecialRateDiscount";
import Context from "Store/Context";
import PageTitle from "../_Common/PageTitle";
import { useTranslation } from "react-i18next";

const Discount_SpecialRateDiscount = (props) => {
  const ENTITY = "Special Rate Discount";
  const ENTITY_PLURAL = "Special Rate Discounts";

  const { curOrg: organisation } = useContext(Context);
  const [dateFormat, setDateFormat] = useState("MM-dd-yyyy");
  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);

  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();

  const [industries, setIndustries] = useState();
  const [discountTags, setDiscountTags] = useState();

  useEffect(async () => {
    if (organisation) {
      setIndustries(await trackPromise(LookupService.Industries({ organisation_id: organisation.id })));
      setDiscountTags(await trackPromise(LookupService.DiscountTags({ organisation_id: organisation.id })));
      await handleSearch();
      setDateFormat(organisation.date_format);
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
      DefaultService.Entity_List("Settings_Discount_SpecialRateDiscount", { organisation_id: organisation.id })
    );
    !status && notify(message, status);
    setData(data);
  };
  const handleEdit = async (item) => {
    //console.log("Edit Handler", item);

    let record = {};
    if (item.id) {
      record = { ...item };
      record.expiry_date = moment(record.expiry_date);
    } else {
      record.organisation_id = organisation.id;
      record.expiry_date = moment(new Date());
    }
    setRecordToEdit(record);

    setShowEditForm(true);
  };

  const handleDelete = async (item) => {
    //console.log("Delete Handler", item);
    let { status, message } = await trackPromise(
      DefaultService.Entity_Delete("Settings_Discount_SpecialRateDiscount", item.id)
    );
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

    console.log("Record to save", record);

    const { status, message } = record.id
      ? await trackPromise(DefaultService.Entity_Update("Settings_Discount_SpecialRateDiscount", record))
      : await trackPromise(DefaultService.Entity_Add("Settings_Discount_SpecialRateDiscount", record));

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
  const { t } = useTranslation();
  const columns = [
    // {
    //   caption: "Organisation",
    //   dataField: "organisation.name",
    //   dataType: "string",
    //   alignment: "left",
    // },
    {
      caption: t("quick_setup_service_types_grid_industry"),
      dataField: "industry.name",
      dataType: "string",
      alignment: "left",
    },

    {
      caption: t("quick_setup_discount_tags_modal_discount_tag"),
      dataField: "discount_tag.name",
      dataType: "string",
      alignment: "left",
    },
    {
      caption: t("general_discount_rate"),
      dataField: "rate_discount",
      dataType: "right",
      alignment: "left",
      format: PercentFormat,
    },
    {
      caption: t("general_expirty_date"),
      dataField: "expiry_date",
      dataType: "date",
      alignment: "left",
      format: dateFormat,
    },
    {
      caption: t("label_active"),
      dataField: "is_active",
      dataType: "string",
      alignment: "center",
    },
  ];

  return (
    (organisation && (
      <>
        <div className="flex mb-2">
          <PageTitle />
          <h3 className="push-right text-right">
            <Tooltip title={`Do you have more ${ENTITY_PLURAL}? Click here to add another`}>
              <Button className="bg-success" icon={<PlusCircleOutlined />} onClick={handleEdit}>
                {t("general_add_new_serv_sp_rate_dis")}
              </Button>
            </Tooltip>
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
          <Form_Discount_SpecialRateDiscount
            form={form}
            showForm={showEditForm}
            recordToEdit={recordToEdit}
            handleCancel={handleCancel}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            ENTITY={ENTITY}
            data={{ organisation, industries, discountTags }}
            dateFormat={dateFormat}
          />
        )}
      </>
    )) || <h3>You need to select an organisation first</h3>
  );
};

export default Discount_SpecialRateDiscount;
