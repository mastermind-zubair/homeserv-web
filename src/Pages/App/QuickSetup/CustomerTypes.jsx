import React, { useState, useEffect, useContext } from "react";

import { trackPromise } from "react-promise-tracker";
import { notify } from "Services/ToastService";

import { Button, Checkbox, Form, Tooltip } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import CustomDataGrid from "Components/DevEx/CustomDataGrid";

import LookupService from "Services/API/LookupService";
import Form_CustomerType from "./Components/Form_CustomerType";
import { useTranslation } from "react-i18next";
import DefaultService from "Services/API/DefaultService";
import Context from "Store/Context";
import PageTitle from "../_Common/PageTitle";

const CustomerTypes = (props) => {
  const { curOrg: organisation } = useContext(Context);
  const ENTITY = "Customer type";
  const ENTITY_PLURAL = "Customer types";
  const ENTITY_API_KEY = "QS_Customer_Type";

  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);

  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();

  const [bookingPageSections, setBookingPageSections] = useState();
  useEffect(async () => {
    if (organisation) {
      await handleSearch();
      let bSections = LookupService.BookingPageSections();
      setBookingPageSections(bSections);
    }
  }, [organisation]);

  useEffect(() => {
    form.resetFields();
  }, [recordToEdit]);

  const handleSearch = async () => {
    let { data, status, message } = await trackPromise(
      DefaultService.Entity_List(ENTITY_API_KEY, { organisation_id: organisation.id })
    );
    data.map((d) => {
      d.booking_page_sections = JSON.parse(d.booking_page_sections_json);
    });
    notify(message, status);
    setData(data);
  };
  const handleEdit = async (item) => {
    let record = {};
    if (item.id) {
      record = { ...item };
    } else {
      record.organisation_id = organisation.id;
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
  const { t } = useTranslation();
  const onFinish = async (values) => {
    //console.log(files);

    /* IF FILES NEED TO BE UPLOADED VIA FORM
    const formData = new FormData();
     files.forEach((file) => {
       formData.append("files[]", file);
     });
    */
    let record = values;
    console.log("form values", values);

    //SET SOME DEFAULT VALUES HERE
    // if (logoImage) {
    //   record.business_logo = logoImage.base64.substring(logoImage.base64.indexOf(",") + 1);
    // }
    //record.is_default = false;

    record.booking_page_sections_json = JSON.stringify(record.booking_page_sections);

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
    {
      caption: t("quick_setup_customer_type_grid_heading_customer_type"),
      dataField: "name",
      dataType: "string",
      cellRender: (itemData) => {
        return <b>{itemData.text}</b>;
      },
      showSummary: true,
      summaryType: "count",
    },
    {
      caption: t("quick_setup_job_tags_grid_description"),
      dataField: "description",
      dataType: "string",
    },
    {
      caption: t("quick_setup_customer_type_grid_heading_booking_page_section"),
      dataField: "booking_page_sections_json",
      cellRender: (itemData) => {
        let val = JSON.parse(itemData.text);
        return (
          <>
            {bookingPageSections.map((v) => {
              return (
                <div key={v}>
                  <Checkbox checked={val.filter((vl) => vl === v.value).length > 0} />
                  &nbsp;&nbsp; {v.label}
                </div>
              );
            })}
          </>
        );
      },
    },
    {
      caption: t("quick_setup_service_types_form_active"),
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
                {t("quick_setup_add_new_cust_type")}
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
            canEdit={true}
            canDelete={true}
          />
        </div>

        <Form_CustomerType
          form={form}
          showForm={showEditForm}
          recordToEdit={recordToEdit}
          handleCancel={handleCancel}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          ENTITY={ENTITY}
          data={{ bookingPageSections }}
        />
      </>
    )) || <h3>{t("general_text")}</h3>
  );
};

export default CustomerTypes;
