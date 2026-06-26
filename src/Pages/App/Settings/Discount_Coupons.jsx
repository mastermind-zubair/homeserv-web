import React, { useState, useEffect, useContext } from "react";

import { trackPromise } from "react-promise-tracker";
import { notify } from "Services/ToastService";

import { Button, Form, Tooltip } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import CustomDataGrid from "Components/DevEx/CustomDataGrid";

import moment from "moment";
import DefaultService from "Services/API/DefaultService";
import Form_DiscountCoupon from "./Components/Form_DiscountCoupon";
import { MoneyFormat } from "Lib/DevExConstants";
import Context from "Store/Context";
import PageTitle from "../_Common/PageTitle";
import { useTranslation } from "react-i18next";
const DiscountCoupons = (props) => {
  const ENTITY = "Discount Coupon";
  const ENTITY_PLURAL = "Discount Coupons";
  const ENTITY_API_KEY = "Settings_Discount_Coupon";

  const { curOrg: organisation } = useContext(Context);
  const [dateFormat, setDateFormat] = useState("MM-dd-yyyy");

  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);

  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();
  const { t } = useTranslation();
  useEffect(async () => {
    if (organisation) {
      await handleSearch();
      console.log('organisation.date_format: ', organisation.date_format);
      setDateFormat(organisation.date_format);
    }
  }, [organisation]);

  useEffect(() => {
    if (recordToEdit && recordToEdit.id === 0) {
      recordToEdit.ranges = [];
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
    //console.log("Edit Handler", item);

    let record = {};
    if (item.id) {
      record = { ...item };
      record.expiry_date = moment(record.expiry_date);
      // record.members =
      //   record.members &&
      //   record.members.map((m) => {
      //     return m.id;
      //   });
    } else {
      record.organisation_id = organisation.id;
      record.expiry_date = moment(new Date());
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

  const columns = [
    // {
    //   caption: "Organisation",
    //   dataField: "organisation.name",
    //   dataType: "string",
    //   alignment: "left",
    // },
    {
      caption: t("general_code"),
      dataField: "code",
      dataType: "string",
      alignment: "left",
    },

    {
      caption: t("general_title"),
      dataField: "title",
      dataType: "string",
      alignment: "left",
    },
    {
      caption: t("dashboard_job_search_amount"),
      dataField: "amount",
      dataType: "number",
      alignment: "center",
      format: MoneyFormat,
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
                {t("general_add_new_serv_dis_coup")}
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
          <Form_DiscountCoupon
            form={form}
            showForm={showEditForm}
            recordToEdit={recordToEdit}
            handleCancel={handleCancel}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            ENTITY={ENTITY}
            dateFormat={dateFormat}
            data={{ organisation }}
          />
        )}
      </>
    )) || <h3>You need to select an organisation first</h3>
  );
};

export default DiscountCoupons;
