import React, { useState, useEffect, useContext, memo } from "react";

import { trackPromise } from "react-promise-tracker";
import { notify } from "Services/ToastService";

import { Button, Col, Form, Row, Tooltip } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import CustomDataGrid from "Components/DevEx/CustomDataGrid";

import moment from "moment";
import LookupService from "Services/API/LookupService";
import DefaultService from "Services/API/DefaultService";
import Form_Quotes from "./Components/Form_Quotes";
import Context from "Store/Context";
import PageTitle from "../_Common/PageTitle";
import { useTranslation } from "react-i18next";
import Form_Quotes_New from "./Components/Form_Quotes_New";

const Quotes = (props) => {
  const ENTITY = "Quote";
  const ENTITY_PLURAL = "Quotes";
  const ENTITY_API_KEY = "Outbound_Quote";

  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [dateFormat, setDateFormat] = useState("MM-dd-yyyy");
  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();

  const [industries, setIndustries] = useState();

  const { curOrg: organisation } = useContext(Context);

  const { t } = useTranslation();
  useEffect(async () => {
    if (organisation) {
      setIndustries(
        await trackPromise(
          LookupService.Industries({ organisation_id: organisation.id })
        )
      );
      setDateFormat(organisation.date_format);
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
      //DefaultService.Entity_List(ENTITY_API_KEY, { organisation_id: organisation.id })
      DefaultService.GetPendingQuotes({ organisation_id: organisation.id })
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

    if (item.id) setShowEditForm(true);
    else setShowNewForm(true);
  };

  const handleDelete = async (item) => {
    //console.log("Delete Handler", item);
    let { status, message } = await trackPromise(
      DefaultService.Entity_Delete(ENTITY_API_KEY, item.id)
    );
    notify(message, status);
    await handleSearch();
  };

  const handleCancel = () => {
    setShowEditForm(false);
    setShowNewForm(false);
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
      setShowNewForm(false);
      handleSearch();
    }
  };
  const onFinishFailed = async () => {
    notify("Please provide all the required input fields", false);
  };

  const columns = [
    // {
    //   caption: "Photo",
    //   dataField: "image",
    //   dataType: "string",
    //   alignment: "center",
    //   className: "bg-primary",
    //   style: { maxWidth: "50px", backgroundColor: "red" },
    //   cellRender: (item) => {
    //     let row = item.row.data;
    //     return (
    //       <>
    //         <TaskPhoto filename={row.image} width={60} />
    //       </>
    //     );
    //   },
    // },

    {
      caption: t("general_job_#"),
      dataField: "job_id",
      dataType: "string",
      alignment: "right",
    },
    {
      caption: t("general_date_created"),
      dataField: "createdAt",
      dataType: "date",
      alignment: "right",
      format: dateFormat,
    },
    {
      caption: t("general_technician"),
      dataField: "field_technician.display_name",
      dataType: "string",
      alignment: "left",
    },

    // {
    //   caption: "Client Name",
    //   dataField: "job.customer.full_name",
    //   dataType: "string",
    //   alignment: "left",
    // },
    // {
    //   caption: "Address",
    //   dataField: "job.job_site_address.full_address",
    //   dataType: "string",
    //   alignment: "left",
    // },
    {
      caption: t("general_quote_amount"),
      dataType: "number",
      alignment: "left",
      cellRender: (item) => {
        let row = item.row.data;
        return (
          <ul>
            {row.options.map((opt) => {
              return (
                <Row>
                  <Col span={10}>{opt.title}: </Col>
                  <Col span={14}>${opt.amount}</Col>
                </Row>
              );
            })}
          </ul>
        );
      },
    },
    {
      caption: t("general_status"),
      dataField: "is_active",
      dataType: "string",
      alignment: "center",
    },
  ];

  return (
    <>
      <div className="flex mb-2">
        <PageTitle />
        <h3 className="push-right text-right">
          <Tooltip title={`Click here to add a new ${ENTITY}?`}>
            <Button
              className="bg-success"
              icon={<PlusCircleOutlined />}
              onClick={handleEdit}
            >
              {t("outbound_quotes_add_new_quote")}
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
          canView={true}
          canEdit={false}
        />
      </div>

      {showEditForm && (
        <Form_Quotes
          form={form}
          showForm={showEditForm}
          recordToEdit={recordToEdit}
          handleCancel={handleCancel}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          ENTITY={ENTITY}
          data={{ organisation }}
        />
      )}

      {showNewForm && (
        <Form_Quotes_New
          form={form}
          showForm={showNewForm}
          recordToEdit={recordToEdit}
          handleCancel={handleCancel}
          onFinish={() => {
            handleSearch();
            handleCancel();
          }}
          onFinishFailed={onFinishFailed}
          ENTITY={ENTITY}
          data={{ organisation }}
        />
      )}
    </>
  );
};

export default memo(Quotes);
